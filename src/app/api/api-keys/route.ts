import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  createApiKey, 
  getUserApiKeys, 
  deactivateApiKey, 
  CreateApiKeyParams 
} from '@/models/ApiKey';

/**
 * APIキーの取得
 */
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // ユーザー認証チェック
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // ユーザーのAPIキーを取得
    const apiKeys = await getUserApiKeys(supabase, user.id);
    
    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('APIキー取得エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * 新しいAPIキーの作成
 */
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // ユーザー認証チェック
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // リクエストボディの解析
    const body = await request.json();
    
    // バリデーション
    if (!body.name) {
      return NextResponse.json(
        { error: 'APIキー名は必須です' },
        { status: 400 }
      );
    }
    
    // パラメータの準備
    const params: CreateApiKeyParams = {
      name: body.name,
      permissions: body.permissions,
      allowed_origins: body.allowed_origins,
      rate_limit: body.rate_limit,
      expires_at: body.expires_at
    };
    
    // APIキーの作成
    const { apiKey, rawKey } = await createApiKey(supabase, user.id, params);
    
    // 生のAPIキーは一度だけ返す
    return NextResponse.json({
      apiKey: {
        ...apiKey,
        key: rawKey // 生のAPIキーを返す（この後表示されることはない）
      },
      message: 'APIキーが作成されました。このキーは二度と表示されないので安全に保管してください。'
    });
  } catch (error) {
    console.error('APIキー作成エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの作成に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * APIキーの無効化
 */
export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // ユーザー認証チェック
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // URLからキーIDを取得
    const url = new URL(request.url);
    const keyId = url.searchParams.get('id');
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'APIキーIDが指定されていません' },
        { status: 400 }
      );
    }
    
    // APIキーの無効化
    const apiKey = await deactivateApiKey(supabase, keyId, user.id);
    
    return NextResponse.json({
      apiKey,
      message: 'APIキーが無効化されました'
    });
  } catch (error) {
    console.error('APIキー無効化エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの無効化に失敗しました' },
      { status: 500 }
    );
  }
}
