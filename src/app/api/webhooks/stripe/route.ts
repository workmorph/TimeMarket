import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

// Stripe署名検証用のシークレット
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// Stripeインスタンスの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Stripeが無効の場合は処理しない
  if (process.env.STRIPE_ACCOUNT_ACTIVE === 'false') {
    console.warn('Stripe account is not active. Webhook ignored.')
    return NextResponse.json({ received: true })
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
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session, supabase)
        break
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent, supabase)
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(failedPayment, supabase)
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

// チェックアウトセッション完了時の処理（最も重要）
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const {
    auctionId,
    bidderId,
    bidderName,
    bidderEmail,
    sellerId,
    sellerName,
    bidAmount,
    platformFee,
    sellerAmount,
    auctionTitle,
  } = session.metadata || {}
  
  if (!auctionId || !bidderId || !bidAmount) {
    console.error('Missing metadata in checkout session', session.id)
    return
  }
  
  try {
    // 入札情報を更新
    const { error: updateError } = await supabase
      .from('bids')
      .update({
        payment_status: 'succeeded',
        payment_intent: session.payment_intent,
        updated_at: new Date().toISOString()
      })
      .eq('payment_session_id', session.id)
    
    if (updateError) {
      console.error('Failed to update bid:', updateError)
      throw updateError
    }
    
    // 注文（order）を作成
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: bidderId,
        seller_id: sellerId,
        auction_id: auctionId,
        amount: parseInt(bidAmount),
        platform_fee: parseInt(platformFee),
        seller_amount: parseInt(sellerAmount),
        payment_session_id: session.id,
        payment_intent_id: session.payment_intent as string,
        status: 'pending_meeting',
        metadata: {
          auction_title: auctionTitle,
          bidder_name: bidderName,
          bidder_email: bidderEmail,
          seller_name: sellerName,
          stripe_session: session.id,
        }
      })
    
    if (orderError) {
      console.error('Failed to create order:', orderError)
      // エラーがあっても続行（監査ログ記録のため）
    }
    
    // オークションの状態を更新
    const { error: auctionError } = await supabase
      .from('auctions')
      .update({
        status: 'completed',
        winner_id: bidderId,
        final_price: parseInt(bidAmount),
        updated_at: new Date().toISOString()
      })
      .eq('id', auctionId)
    
    if (auctionError) {
      console.error('Failed to update auction:', auctionError)
    }
    
    // 監査ログを記録
    await supabase.from('activity_logs').insert({
      user_id: bidderId,
      action_type: 'payment_completed',
      resource_type: 'auction',
      resource_id: auctionId,
      metadata: {
        session_id: session.id,
        payment_intent: session.payment_intent,
        amount: bidAmount,
        platform_fee: platformFee,
        seller_amount: sellerAmount,
      }
    }).catch(error => {
      console.warn('活動ログの記録に失敗:', error)
    })
    
    console.log(`Checkout session completed: ${session.id}`)
    
    // TODO: メール通知の送信
    // - 落札者への確認メール
    // - 出品者への通知メール
    
  } catch (error) {
    console.error('Failed to handle checkout session:', error)
    throw error
  }
}

// 支払い成功時の処理（Webhookが重複して呼ばれる場合のバックアップ）
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { auctionId, bidderId } = paymentIntent.metadata || {}
  
  if (!auctionId || !bidderId) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // 入札情報を更新
    const { error } = await supabase
      .from('bids')
      .update({
        payment_status: 'succeeded',
        payment_intent: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('payment_intent', paymentIntent.id)
    
    if (error) {
      console.error('Failed to update bid:', error)
    }
    
    console.log(`Payment intent succeeded: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Failed to update bid payment status:', error)
  }
}

// 支払い失敗時の処理
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { auctionId, bidderId } = paymentIntent.metadata || {}
  
  if (!auctionId || !bidderId) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // 入札情報を更新
    const { error } = await supabase
      .from('bids')
      .update({
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('payment_intent', paymentIntent.id)
    
    if (error) {
      console.error('Failed to update bid:', error)
    }
    
    console.log(`Payment failed for bid: ${paymentIntent.id}`)
    
    // 監査ログを記録
    await supabase.from('activity_logs').insert({
      user_id: bidderId,
      action_type: 'payment_failed',
      resource_type: 'auction',
      resource_id: auctionId,
      metadata: {
        payment_intent: paymentIntent.id,
        failure_code: paymentIntent.last_payment_error?.code,
        failure_message: paymentIntent.last_payment_error?.message,
      }
    }).catch(err => {
      console.warn('活動ログの記録に失敗:', err)
    })
  } catch (error) {
    console.error('Failed to handle payment failure:', error)
  }
} 