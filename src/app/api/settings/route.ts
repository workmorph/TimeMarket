import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase';

/**
 * ユーザー設定取得エンドポイント
 */
export async function GET() {
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

    // ユーザー設定を取得
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: 結果が見つからない
      console.error('Settings fetch error:', error);
      return NextResponse.json(
        { error: '設定情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 設定が存在しない場合はデフォルト値を返す
    if (!settings) {
      const defaultSettings = {
        user_id: session.user.id,
        theme: 'system',
        language: 'ja',
        email_notifications: true,
        push_notifications: true,
        calendar_settings: {
          default_calendar_id: null,
          working_hours: {
            monday: { start: '09:00', end: '17:00', enabled: true },
            tuesday: { start: '09:00', end: '17:00', enabled: true },
            wednesday: { start: '09:00', end: '17:00', enabled: true },
            thursday: { start: '09:00', end: '17:00', enabled: true },
            friday: { start: '09:00', end: '17:00', enabled: true },
            saturday: { start: '09:00', end: '17:00', enabled: false },
            sunday: { start: '09:00', end: '17:00', enabled: false },
          },
          buffer_time: 15, // 予約間の緩衝時間（分）
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return NextResponse.json({
        data: defaultSettings
      });
    }

    return NextResponse.json({
      data: settings
    });
  } catch (error) {
    console.error('Settings API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * ユーザー設定更新エンドポイント
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

    // リクエストボディから更新データを取得
    const settingsData = await request.json() as Record<string, unknown>;
    
    // 更新可能なフィールドのみを抽出
    const allowedFields = [
      'theme',
      'language',
      'email_notifications',
      'push_notifications',
      'calendar_settings',
    ];
    
    const updateData: Record<string, unknown> = {
      user_id: session.user.id,
      updated_at: new Date().toISOString(),
    };
    
    for (const field of allowedFields) {
      if (field in settingsData) {
        updateData[field] = settingsData[field];
      }
    }

    // カレンダー設定のバリデーション
    if (updateData.calendar_settings) {
      const calendarSettings = updateData.calendar_settings as Record<string, unknown>;
      
      // 作業時間のバリデーション
      const workingHours = calendarSettings.working_hours as Record<string, Record<string, unknown>>;
      if (workingHours) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of days) {
          if (workingHours[day]) {
            const daySettings = workingHours[day];
            const start = daySettings.start as string;
            const end = daySettings.end as string;
            const enabled = daySettings.enabled as boolean;
            
            // 時間形式のバリデーション
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (start && !timeRegex.test(start)) {
              return NextResponse.json(
                { error: `${day}の開始時間が無効です。HH:MM形式で指定してください` },
                { status: 400 }
              );
            }
            if (end && !timeRegex.test(end)) {
              return NextResponse.json(
                { error: `${day}の終了時間が無効です。HH:MM形式で指定してください` },
                { status: 400 }
              );
            }
            
            // 開始時間が終了時間より前かチェック
            if (start && end && start >= end) {
              return NextResponse.json(
                { error: `${day}の開始時間は終了時間より前である必要があります` },
                { status: 400 }
              );
            }
            
            // enabledがブール値かチェック
            if (enabled !== undefined && typeof enabled !== 'boolean') {
              return NextResponse.json(
                { error: `${day}の有効/無効設定はブール値である必要があります` },
                { status: 400 }
              );
            }
          }
        }
      }
      
      // バッファー時間のバリデーション
      const bufferTime = calendarSettings.buffer_time as number;
      if (bufferTime !== undefined) {
        if (typeof bufferTime !== 'number' || bufferTime < 0 || bufferTime > 120) {
          return NextResponse.json(
            { error: 'バッファ時間は0〜120分の範囲で指定してください' },
            { status: 400 }
          );
        }
      }
    }

    // 既存の設定を確認
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    let result;
    
    if (existingSettings) {
      // 既存の設定を更新
      result = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', session.user.id)
        .select()
        .single();
    } else {
      // 新しい設定を作成
      updateData.created_at = new Date().toISOString();
      result = await supabase
        .from('user_settings')
        .insert(updateData)
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error('Settings update error:', error);
      return NextResponse.json(
        { error: '設定の更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: '設定を更新しました'
    });
  } catch (error) {
    console.error('Settings Update API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
