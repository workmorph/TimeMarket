import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'
import Stripe from 'stripe'

// Stripe署名検証用のシークレット
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
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

// 支払い成功時の処理
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { auction_id, user_id } = paymentIntent.metadata || {}
  
  if (!auction_id || !user_id) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // 入札情報を更新
    await supabase
      .from('bids')
      .update({
        payment_status: 'succeeded',
        updated_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntent.id)
    
    console.log(`Payment succeeded for bid: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Failed to update bid payment status:', error)
  }
}

// 支払い失敗時の処理
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { auction_id, user_id } = paymentIntent.metadata || {}
  
  if (!auction_id || !user_id) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // 入札情報を更新
    await supabase
      .from('bids')
      .update({
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntent.id)
    
    console.log(`Payment failed for bid: ${paymentIntent.id}`)
    
    // 最高入札額を再計算
    const { data: highestBid } = await supabase
      .from('bids')
      .select('amount')
      .eq('auction_id', auction_id)
      .eq('payment_status', 'succeeded')
      .order('amount', { ascending: false })
      .limit(1)
      .single()
    
    // オークションの現在価格を更新
    if (highestBid) {
      await supabase
        .from('auctions')
        .update({
          current_highest_bid: highestBid.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', auction_id)
    } else {
      // 有効な入札がない場合は開始価格に戻す
      const { data: auction } = await supabase
        .from('auctions')
        .select('starting_price')
        .eq('id', auction_id)
        .single()
      
      if (auction) {
        await supabase
          .from('auctions')
          .update({
            current_highest_bid: auction.starting_price,
            updated_at: new Date().toISOString()
          })
          .eq('id', auction_id)
      }
    }
  } catch (error) {
    console.error('Failed to handle payment failure:', error)
  }
} 