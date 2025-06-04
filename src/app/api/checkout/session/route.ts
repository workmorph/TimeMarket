import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // 認証チェック
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    // URLパラメータからセッションIDを取得
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      )
    }
    
    // Stripeクライアントを取得
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripeクライアントが利用できません' },
        { status: 500 }
      )
    }
    
    // Stripeからセッション情報を取得
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    })
    
    // セッションのメタデータからオークション情報を取得
    const auctionId = checkoutSession.metadata?.auction_id
    const bidAmount = checkoutSession.metadata?.bid_amount
    const userId = checkoutSession.metadata?.user_id
    
    // セッションのユーザーIDと現在のユーザーIDが一致するか確認
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'このセッション情報へのアクセス権限がありません' },
        { status: 403 }
      )
    }
    
    // オークション情報を取得
    let auctionTitle = ''
    if (auctionId) {
      const { data: auction } = await supabase
        .from('auctions')
        .select('title')
        .eq('id', auctionId)
        .single()
      
      if (auction) {
        auctionTitle = auction.title
      }
    }
    
    // 入札額と手数料を計算
    const bidAmountNum = bidAmount ? parseFloat(bidAmount) : 0
    const platformFee = Math.round(bidAmountNum * 0.15)
    
    // レスポンスデータを構築
    const responseData = {
      id: checkoutSession.id,
      amount_total: checkoutSession.amount_total || 0,
      payment_status: checkoutSession.payment_status,
      auction_id: auctionId || '',
      auction_title: auctionTitle,
      created_at: new Date(checkoutSession.created * 1000).toISOString(),
      bid_amount: bidAmountNum,
      platform_fee: platformFee,
    }
    
    return NextResponse.json(responseData)
    
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    
    // Stripeエラーの詳細をログに記録
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `セッション情報の取得に失敗しました: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'セッション情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}