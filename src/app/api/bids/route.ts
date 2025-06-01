import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'

// POST /api/bids - 新規入札作成
export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    // セッションからユーザーIDを取得
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    const body = await request.json()
    
    // バリデーション
    const { auction_id, amount } = body
    
    if (!auction_id || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: '入札金額が無効です' },
        { status: 400 }
      )
    }
    
    // オークション情報取得
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*, profiles(email), bids(amount)')
      .eq('id', auction_id)
      .single()
    
    if (auctionError || !auction) {
      return NextResponse.json(
        { error: 'オークションが見つかりません' },
        { status: 404 }
      )
    }
    
    // オークションのステータス確認
    if (auction.status !== 'active') {
      return NextResponse.json(
        { error: 'このオークションは現在入札できません' },
        { status: 400 }
      )
    }
    
    // 入札期限確認
    const now = new Date()
    const endTime = new Date(auction.end_time)
    if (now > endTime) {
      return NextResponse.json(
        { error: 'オークションの入札期限が過ぎています' },
        { status: 400 }
      )
    }
    
    // 自分のオークションには入札できない
    if (auction.user_id === userId) {
      return NextResponse.json(
        { error: '自分のオークションには入札できません' },
        { status: 400 }
      )
    }
    
    // 最低入札額チェック
    const bidAmount = Number(amount)
    const currentMaxBid = auction.current_price || auction.starting_price
    
    if (bidAmount <= currentMaxBid) {
      return NextResponse.json(
        { error: `現在の最高入札額 (${currentMaxBid}) より高い金額で入札してください` },
        { status: 400 }
      )
    }
    
    // 環境変数に基づいてStripe処理を実行
    const stripeEnabled = process.env.STRIPE_ACCOUNT_ACTIVE !== 'false'
    let paymentIntentId = null
    
    if (stripeEnabled) {
      const stripe = getStripe()
      if (!stripe) {
        return NextResponse.json(
          { error: '決済システムが利用できません' },
          { status: 500 }
        )
      }
      
      try {
        // Stripeで仮決済を作成 (Manual Capture)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(bidAmount * 100), // Stripeは金額をセント単位で扱う
          currency: 'jpy',
          capture_method: 'manual', // 仮決済 (Manual Capture)
          confirm: false,
          metadata: {
            auction_id,
            user_id: userId,
            bid_amount: bidAmount.toString()
          }
        })
        
        paymentIntentId = paymentIntent.id
      } catch (stripeError) {
        console.error('Stripe payment intent creation failed:', stripeError)
        return NextResponse.json(
          { error: '決済処理に失敗しました' },
          { status: 500 }
        )
      }
    }
    
    // データベースに入札情報を保存
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id,
        user_id: userId,
        amount: bidAmount,
        payment_intent_id: paymentIntentId
      })
      .select()
      .single()
    
    if (bidError) {
      // Stripeの仮決済をキャンセル
      if (stripeEnabled && paymentIntentId) {
        try {
          const stripe = getStripe()
          await stripe?.paymentIntents.cancel(paymentIntentId)
        } catch (cancelError) {
          console.error('Failed to cancel payment intent:', cancelError)
        }
      }
      
      throw bidError
    }
    
    // オークションの現在価格を更新
    await supabase
      .from('auctions')
      .update({ 
        current_price: bidAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', auction_id)
    
    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    console.error('Error creating bid:', error)
    return NextResponse.json(
      { error: '入札の処理に失敗しました' },
      { status: 500 }
    )
  }
}

// GET /api/bids - オークションごとの入札履歴取得
export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const searchParams = request.nextUrl.searchParams
  const auctionId = searchParams.get('auction_id')
  
  if (!auctionId) {
    return NextResponse.json(
      { error: 'オークションIDが指定されていません' },
      { status: 400 }
    )
  }
  
  try {
    // セッションからユーザーIDを取得
    const { data: { session } } = await supabase.auth.getSession()
    
    // オークション情報取得
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('user_id')
      .eq('id', auctionId)
      .single()
    
    if (auctionError) {
      return NextResponse.json(
        { error: 'オークションが見つかりません' },
        { status: 404 }
      )
    }
    
    // 入札履歴取得
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('*, profiles(username, avatar_url)')
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false })
    
    if (bidsError) {
      throw bidsError
    }
    
    // 自分の入札かオークション作成者の場合は詳細情報を表示
    // それ以外の場合は一部の情報を制限
    const isOwner = session && auction.user_id === session.user.id
    const filteredBids = bids.map(bid => {
      // 自分の入札かオークション作成者の場合は全ての情報を返す
      if (isOwner || (session && bid.user_id === session.user.id)) {
        return bid
      }
      
      // それ以外の場合はユーザー情報を制限
      return {
        ...bid,
        user_id: undefined,
        payment_intent_id: undefined,
        profiles: {
          username: bid.profiles.username.substring(0, 1) + '***',
          avatar_url: bid.profiles.avatar_url
        }
      }
    })
    
    return NextResponse.json(filteredBids)
  } catch (error) {
    console.error('Error fetching bids:', error)
    return NextResponse.json(
      { error: '入札履歴の取得に失敗しました' },
      { status: 500 }
    )
  }
} 