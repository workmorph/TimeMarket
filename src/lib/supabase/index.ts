// サーバークライアントとクライアントサイドクライアントをエクスポート
import { createClient as createServerClient } from "./server";
import { createClient as createBrowserClient } from "./client";

// 型定義をエクスポート
export type {
  Database,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Auction,
  AuctionInsert,
  AuctionUpdate,
  Bid,
  BidInsert,
  BidUpdate,
  ApiKey,
  ApiKeyInsert,
  ApiKeyUpdate,
  ActivityLog,
  ActivityLogInsert,
  ActivityLogUpdate,
} from "./types";

// サーバーサイドの非同期クライアント作成関数をエクスポート
export { createServerClient as createClient };
export { createBrowserClient };

// デフォルトのブラウザクライアントをエクスポート（多くのファイルで使用）
export const supabase = createBrowserClient();
