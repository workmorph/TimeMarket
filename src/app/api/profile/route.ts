import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase';

/**
 * プロフィール取得エンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();

    // 認証チェック
    if (!session) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // クエリパラメータからユーザーIDを取得（指定がなければ自分自身）
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || session.user.id;

    // プロフィール情報を取得
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: 'プロフィール情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 自分自身のプロフィールの場合は、非公開情報も含める
    if (userId === session.user.id) {
      // 予約情報を取得
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (reservationsError) {
        console.warn('Reservations fetch warning:', reservationsError);
      }

      // オークション情報を取得
      const { data: auctions, error: auctionsError } = await supabase
        .from('auctions')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (auctionsError) {
        console.warn('Auctions fetch warning:', auctionsError);
      }

      // 入札情報を取得
      const { data: bids, error: bidsError } = await supabase
        .from('bids')
        .select('*, auctions(*)')
        .eq('bidder_id', userId)
        .order('created_at', { ascending: false });

      if (bidsError) {
        console.warn('Bids fetch warning:', bidsError);
      }

      return NextResponse.json({
        data: {
          profile,
          reservations: reservations || [],
          auctions: auctions || [],
          bids: bids || [],
        }
      });
    }

    // 他のユーザーのプロフィールの場合は、公開情報のみ返す
    return NextResponse.json({
      data: {
        profile: {
          id: profile.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          website: profile.website,
          created_at: profile.created_at,
        }
      }
    });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * プロフィール更新エンドポイント
 */
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();

    // 認証チェック
    if (!session) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // リクエストボディを取得
    const profileData = await request.json() as Record<string, string>;
    
    // 更新可能なフィールドのみを抽出
    const allowedFields = [
      'username',
      'name',
      'avatar_url',
      'bio',
      'website',
      'email_notifications',
      'push_notifications',
    ];
    
    const updateData: Record<string, unknown> = {};
    
    for (const field of allowedFields) {
      if (field in profileData) {
        updateData[field] = profileData[field];
      }
    }
    
    // 更新日時を設定
    updateData.updated_at = new Date().toISOString();

    // ユーザー名のバリデーション
    if (updateData.username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(updateData.username as string)) {
        return NextResponse.json(
          { error: 'ユーザー名は3〜20文字の英数字とアンダースコアのみ使用できます' },
          { status: 400 }
        );
      }
      
      // ユーザー名の重複チェック
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', updateData.username)
        .neq('id', session.user.id)
        .single();
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'このユーザー名は既に使用されています' },
          { status: 400 }
        );
      }
    }

    // プロフィール情報を更新
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'プロフィール情報の更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'プロフィールを更新しました'
    });
  } catch (error) {
    console.error('Profile Update API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
