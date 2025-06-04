import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getServerSession } from '@/lib/auth/session';
import { formatCurrency } from '@/lib/utils';

// Stripeインスタンスの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// TimeBidの手数料率（15%）
const PLATFORM_FEE_PERCENTAGE = 15;

// 手数料計算関数
function calculateFees(amount: number) {
  const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100));
  const sellerAmount = amount - platformFee;
  return { platformFee, sellerAmount };
}

export async function POST(req: NextRequest) {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // リクエストボディからデータを取得
    const { auctionId, bidAmount } = await req.json();

    if (!auctionId || !bidAmount) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }
    
    // 金額が正の整数であることを確認
    if (!Number.isInteger(bidAmount) || bidAmount <= 0) {
      return NextResponse.json(
        { error: '入札金額は正の整数である必要があります' },
        { status: 400 }
      );
    }

    // Supabaseクライアントの初期化
    const supabase = createClient();

    // オークション情報の取得
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*, user:user_id(*)')
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      return NextResponse.json(
        { error: 'オークションが見つかりません' },
        { status: 404 }
      );
    }

    // 落札者が自分自身のオークションに入札していないかチェック
    if (auction.user_id === session.user.id) {
      return NextResponse.json(
        { error: '自分のオークションには入札できません' },
        { status: 400 }
      );
    }

    // 手数料の計算（15%）
    const { platformFee, sellerAmount } = calculateFees(bidAmount);

    // 支払い成功時のURLを設定（クエリパラメータを追加）
    const successUrl = new URL(
      `/checkout/success?auction=${auctionId}&session_id={CHECKOUT_SESSION_ID}`,
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    ).toString();

    // 支払いキャンセル時のURLを設定
    const cancelUrl = new URL(
      `/auctions/${auctionId}?payment_canceled=true`,
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    ).toString();

    // Stripeチェックアウトセッションの作成
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `${auction.title} - 入札`,
              description: `${auction.description ? auction.description.substring(0, 100) : ''}${auction.description && auction.description.length > 100 ? '...' : ''}`,
              images: auction.images && auction.images.length > 0 ? [auction.images[0]] : [],
            },
            unit_amount: bidAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        auctionId,
        bidderId: session.user.id,
        bidderName: session.user.name || session.user.email?.split('@')[0] || 'ユーザー',
        sellerId: auction.user_id,
        sellerName: auction.user?.name || 'ホスト',
        bidAmount: bidAmount.toString(),
        platformFee: platformFee.toString(),
        sellerAmount: sellerAmount.toString(),
        auctionTitle: auction.title,
        createdAt: new Date().toISOString(),
      },
      customer_email: session.user.email,
      allow_promotion_codes: true,
    });

    // 入札情報をデータベースに保存（支払い前の状態）
    const { error: bidError } = await supabase.from('bids').insert({
      auction_id: auctionId,
      user_id: session.user.id,
      bidder_name: session.user.name || session.user.email?.split('@')[0] || 'ユーザー',
      amount: bidAmount,
      payment_intent: checkoutSession.payment_intent as string,
      payment_session_id: checkoutSession.id,
      payment_status: 'pending',
      platform_fee: platformFee,
      seller_amount: sellerAmount,
    });

    if (bidError) {
      console.error('入札情報の保存に失敗しました:', bidError);
      // エラーログを詳細に記録
      console.error('入札データ:', {
        auction_id: auctionId,
        user_id: session.user.id,
        amount: bidAmount,
        payment_intent: checkoutSession.payment_intent,
      });
      // エラーがあっても決済は続行（Webhookで後処理）
    }
    
    // 監査ログを記録
    await supabase.from('activity_logs').insert({
      user_id: session.user.id,
      action_type: 'checkout_initiated',
      resource_type: 'auction',
      resource_id: auctionId,
      metadata: {
        bid_amount: bidAmount,
        session_id: checkoutSession.id,
        payment_intent: checkoutSession.payment_intent,
      }
    }).catch(error => {
      // ログ記録のエラーは無視（メイン処理に影響させない）
      console.warn('活動ログの記録に失敗:', error);
    });

    // チェックアウトURLと追加情報を返す
    return NextResponse.json({
      url: checkoutSession.url,
      session_id: checkoutSession.id,
      amount: bidAmount,
      formatted_amount: formatCurrency(bidAmount),
      platform_fee: platformFee,
      seller_amount: sellerAmount
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    
    // エラーの種類に応じたレスポンス
    if (error instanceof Stripe.errors.StripeError) {
      // Stripeエラーの場合は詳細を返す
      return NextResponse.json(
        { 
          error: '決済処理中にエラーが発生しました', 
          code: error.code,
          type: error.type,
          detail: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: '決済の初期化に失敗しました' },
      { status: 500 }
    );
  }
}
