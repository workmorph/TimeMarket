/**
 * ユーザープロフィールに関する型定義
 */

/**
 * ユーザープロフィール
 */
export interface Profile {
  id: string;
  username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 公開プロフィール（他のユーザーに表示される情報）
 */
export interface PublicProfile {
  id: string;
  username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
}

/**
 * プロフィール更新用データ型（部分的な更新が可能）
 */
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

/**
 * 予約情報
 */
export interface Reservation {
  id: string;
  user_id: string;
  auction_id: string;
  calendar_event_id: string | null;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

/**
 * プロフィールAPIレスポンス（自分自身のプロフィール）
 */
export interface ProfileResponse {
  data: {
    profile: Profile;
    reservations: Reservation[];
    auctions: Array<Record<string, unknown>>; // 後でAuction型をインポートして置き換える
    bids: Array<Record<string, unknown>>; // 後でBid型をインポートして置き換える
  };
  message?: string;
}

/**
 * 公開プロフィールAPIレスポンス（他のユーザーのプロフィール）
 */
export interface PublicProfileResponse {
  data: {
    profile: PublicProfile;
  };
  message?: string;
}
