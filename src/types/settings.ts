/**
 * ユーザー設定に関する型定義
 */

/**
 * 曜日ごとの作業時間設定
 */
export interface WorkingHours {
  start: string; // HH:MM形式
  end: string; // HH:MM形式
  enabled: boolean;
}

/**
 * 曜日ごとの作業時間設定マップ
 */
export interface WeeklyWorkingHours {
  monday: WorkingHours;
  tuesday: WorkingHours;
  wednesday: WorkingHours;
  thursday: WorkingHours;
  friday: WorkingHours;
  saturday: WorkingHours;
  sunday: WorkingHours;
}

/**
 * カレンダー設定
 */
export interface UserCalendarSettings {
  default_calendar_id: string | null;
  working_hours: WeeklyWorkingHours;
  buffer_time: number; // 予約間の緩衝時間（分）
}

/**
 * ユーザー設定
 */
export interface TimeBidUserSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  calendar_settings: UserCalendarSettings;
  created_at: string;
  updated_at: string;
}

/**
 * ユーザー設定の更新用データ型（部分的な更新が可能）
 */
export type UserSettingsUpdate = Partial<Omit<TimeBidUserSettings, 'user_id' | 'created_at' | 'updated_at'>>;

/**
 * ユーザー設定APIレスポンス
 */
export interface UserSettingsResponse {
  data: TimeBidUserSettings;
  message?: string;
}
