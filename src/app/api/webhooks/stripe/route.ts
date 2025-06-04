import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/client'
import Stripe from 'stripe'

// Stripe署名検証用のシークレット
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  // Stripeが無効の場合は処理しない
  if (process.env.STRIPE_ACCOUNT_ACTIVE === 'false') {
    console.warn('Stripe account is not active. Webhook ignored.')
    return NextResponse.json({ received: true })
  }
  
  const stripe = getStripe()
  if (!stripe) {
    console.error('Stripe client not available')
    return NextResponse.json(
      { error: 'Stripe client not available' },
      { status: 500 }
    )
  }
  
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }
  
  const body = await request.text()
  
  try {
    let event
    
    // 署名検証（本番環境のみ）
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } else {
      // 開発環境では署名検証をスキップ
      event = JSON.parse(body)
      console.warn('Webhook signature verification skipped (no endpoint secret)')
    }
    
    // イベントタイプに応じた処理
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(failedPayment)
        break
        
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      
      // その他のイベントタイプは今後必要に応じて追加
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

// 支払い成功時の処理
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  const { auction_id, user_id } = paymentIntent.metadata || {}
  
  if (!auction_id || !user_id) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // 管理者権限でSupabaseクライアントを作成
    const adminSupabase = createAdminClient()
    
    // トランザクション的に処理するために一連の操作を実行
    const { error: bidError } = await adminSupabase
      .from('bids')
      .update({
        payment_status: 'succeeded',
        updated_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntent.id)
    
    if (bidError) throw bidError
    
    // オークションの現在価格を更新
    const { data: bid } = await adminSupabase
      .from('bids')
      .select('amount')
      .eq('payment_intent_id', paymentIntent.id)
      .single()
    
    if (bid) {
      const { error: auctionError } = await adminSupabase
        .from('auctions')
        .update({
          current_price: bid.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', auction_id)
      
      if (auctionError) throw auctionError
    }
    
    console.log(`Payment succeeded for bid: ${paymentIntent.id}, auction: ${auction_id}`)
  } catch (error) {
    console.error('Failed to update bid payment status:', error)
  }
}

// 支払い失敗時の処理
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
) {
  const { auction_id, user_id } = paymentIntent.metadata || {}
  
  if (!auction_id || !user_id) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // 管理者権限でSupabaseクライアントを作成
    const adminSupabase = createAdminClient()
    
    // 入札情報を更新
    const { error: bidError } = await adminSupabase
      .from('bids')
      .update({
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntent.id)
    
    if (bidError) throw bidError
    
    console.log(`Payment failed for bid: ${paymentIntent.id}`)
    
    // 最高入札額を再計算
    const { data: highestBid, error: bidQueryError } = await adminSupabase
      .from('bids')
      .select('amount')
      .eq('auction_id', auction_id)
      .eq('payment_status', 'succeeded')
      .order('amount', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (bidQueryError) throw bidQueryError
    
    // オークションの現在価格を更新
    if (highestBid) {
      const { error: updateError } = await adminSupabase
        .from('auctions')
        .update({
          current_price: highestBid.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', auction_id)
      
      if (updateError) throw updateError
    } else {
      // 有効な入札がない場合は開始価格に戻す
      const { data: auction, error: auctionError } = await adminSupabase
        .from('auctions')
        .select('starting_price')
        .eq('id', auction_id)
        .single()
      
      if (auctionError) throw auctionError
      
      if (auction) {
        const { error: resetError } = await adminSupabase
          .from('auctions')
          .update({
            current_price: auction.starting_price,
            updated_at: new Date().toISOString()
          })
          .eq('id', auction_id)
        
        if (resetError) throw resetError
      }
    }
  } catch (error) {
    console.error('Failed to handle payment failure:', error)
  }
}

// チェックアウトセッション完了時の処理
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  // メタデータから必要な情報を取得
  const { auctionId, bidderId, sellerId, bidAmount, platformFee, sellerAmount } = session.metadata || {}
  
  if (!auctionId || !bidderId || !sellerId) {
    console.error('Missing metadata in checkout session', session.id)
    return
  }
  
  try {
    // 管理者権限でSupabaseクライアントを作成
    const adminSupabase = createAdminClient()
    
    // 入札情報を更新
    const { error: bidError } = await adminSupabase
      .from('bids')
      .update({
        payment_status: 'succeeded',
        payment_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('auction_id', auctionId)
      .eq('user_id', bidderId)
      .is('payment_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (bidError) {
      console.error('Failed to update bid with session ID:', bidError)
      return
    }
    
    // オークション情報を更新
    const { error: auctionError } = await adminSupabase
      .from('auctions')
      .update({
        current_price: parseInt(bidAmount || '0'),
        highest_bidder_id: bidderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId)
    
    if (auctionError) {
      console.error('Failed to update auction with highest bid:', auctionError)
      return
    }
    
    // 支払い記録を作成
    const { error: paymentError } = await adminSupabase
      .from('payments')
      .insert({
        auction_id: auctionId,
        user_id: bidderId,
        seller_id: sellerId,
        amount: parseInt(bidAmount || '0'),
        platform_fee: parseInt(platformFee || '0'),
        seller_amount: parseInt(sellerAmount || '0'),
        payment_id: session.id,
        payment_status: 'succeeded',
        payment_method: 'stripe',
      })
    
    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      return
    }
    
    console.log(`Checkout session completed: ${session.id}, auction: ${auctionId}`)
  } catch (error) {
    console.error('Failed to process checkout session completion:', error)
  }
}