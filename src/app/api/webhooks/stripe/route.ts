import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'
import Stripe from 'stripe'

// Stripe署名検証用のシークレット
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// 処理対象のイベントタイプ
const relevantEvents = new Set([
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'checkout.session.completed',
  'checkout.session.expired',
])

// 監査ログを記録する関数
async function logWebhookEvent(
  supabase: any,
  eventType: string,
  eventId: string,
  metadata: Record<string, any>
) {
  try {
    // webhook_logsテーブルが存在しない場合はスキップ
    const { error } = await supabase
      .from('webhook_logs')
      .insert({
        event_type: eventType,
        event_id: eventId,
        metadata,
        created_at: new Date().toISOString(),
      })
    
    if (error && error.code !== '42P01') { // テーブルが存在しないエラー以外
      console.error('Failed to log webhook event:', error)
    }
  } catch (error) {
    // ログ記録の失敗はメイン処理に影響させない
    console.error('Failed to log webhook event:', error)
  }
}

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
    let event: Stripe.Event
    
    // 署名検証（本番環境のみ）
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } else {
      // 開発環境では署名検証をスキップ
      event = JSON.parse(body) as Stripe.Event
      console.warn('Webhook signature verification skipped (no endpoint secret)')
    }
    
    // 関連のないイベントは早期リターン
    if (!relevantEvents.has(event.type)) {
      console.log(`Ignoring event type: ${event.type}`)
      return NextResponse.json({ received: true })
    }
    
    // 監査ログ記録
    await logWebhookEvent(supabase, event.type, event.id, event.data.object)
    
    // イベントタイプに応じた処理
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session, supabase)
        break
        
      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionExpired(expiredSession, supabase)
        break
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent, supabase)
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(failedPayment, supabase)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook error:', errorMessage, err)
    
    // エラーレスポンスを返す（Stripeに再試行させるため）
    return NextResponse.json(
      { error: `Webhook handler failed: ${errorMessage}` },
      { status: 400 }
    )
  }
}

// チェックアウトセッション完了時の処理
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const { bid_id, auction_id, user_id } = session.metadata || {}
  
  if (!bid_id || !auction_id || !user_id) {
    console.error('Missing required metadata in checkout session:', {
      sessionId: session.id,
      metadata: session.metadata,
    })
    return
  }
  
  try {
    // 入札情報を更新
    const { error: updateError } = await supabase
      .from('bids')
      .update({
        payment_status: 'paid',
        payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', bid_id)
    
    if (updateError) {
      console.error('Failed to update bid:', updateError)
      throw updateError
    }
    
    // オークション価格を更新
    const { data: paidBids } = await supabase
      .from('bids')
      .select('amount')
      .eq('auction_id', auction_id)
      .eq('payment_status', 'paid')
      .order('amount', { ascending: false })
    
    if (paidBids && paidBids.length > 0) {
      await supabase
        .from('auctions')
        .update({ 
          current_price: paidBids[0].amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', auction_id)
    }
    
    console.log(`Checkout session completed for bid ${bid_id}`)
    
    // TODO: 通知送信
    // await notifyUserPaymentSuccess(user_id, auction_id, bid_id)
  } catch (error) {
    console.error('Failed to handle checkout session completed:', error)
    throw error // Stripeに再試行させる
  }
}

// チェックアウトセッション期限切れ時の処理
async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const { bid_id } = session.metadata || {}
  
  if (!bid_id) {
    console.warn('No bid_id in expired checkout session metadata')
    return
  }
  
  try {
    await supabase
      .from('bids')
      .update({
        payment_status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('id', bid_id)
    
    console.log(`Checkout session expired for bid ${bid_id}`)
  } catch (error) {
    console.error('Failed to handle checkout session expired:', error)
  }
}

// 支払い成功時の処理
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { bid_id, auction_id, user_id } = paymentIntent.metadata || {}
  
  if (!bid_id) {
    console.error('Missing bid_id in payment intent metadata', paymentIntent.id)
    return
  }
  
  try {
    // 入札情報を更新
    await supabase
      .from('bids')
      .update({
        payment_status: 'paid',
        payment_intent_id: paymentIntent.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', bid_id)
    
    console.log(`Payment succeeded for bid: ${bid_id}`)
  } catch (error) {
    console.error('Failed to update bid payment status:', error)
    throw error
  }
}

// 支払い失敗時の処理
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { bid_id, auction_id, user_id } = paymentIntent.metadata || {}
  
  if (!bid_id || !auction_id) {
    console.error('Missing metadata in payment intent', paymentIntent.id)
    return
  }
  
  try {
    // エラー詳細を記録
    const failureReason = paymentIntent.last_payment_error?.message || '決済に失敗しました'
    
    // 入札情報を更新
    await supabase
      .from('bids')
      .update({
        payment_status: 'failed',
        payment_error: failureReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', bid_id)
    
    console.log(`Payment failed for bid: ${bid_id}`)
    
    // 最高入札額を再計算
    const { data: highestBid } = await supabase
      .from('bids')
      .select('amount')
      .eq('auction_id', auction_id)
      .eq('payment_status', 'paid')
      .order('amount', { ascending: false })
      .limit(1)
      .single()
    
    // オークションの現在価格を更新
    if (highestBid) {
      await supabase
        .from('auctions')
        .update({
          current_price: highestBid.amount,
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
            current_price: auction.starting_price,
            updated_at: new Date().toISOString()
          })
          .eq('id', auction_id)
      }
    }
    
    // TODO: 通知送信
    // await notifyUserPaymentFailed(user_id, auction_id, bid_id, failureReason)
  } catch (error) {
    console.error('Failed to handle payment failure:', error)
    throw error
  }
}