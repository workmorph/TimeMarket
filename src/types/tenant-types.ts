/**
 * テナント関連の型定義
 * マルチテナントSaaS機能のためのTypeScript型定義
 */

/**
 * テナント情報の型定義
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  subscription_plan: "basic" | "professional" | "enterprise";
  subscription_status: "active" | "trial" | "expired" | "cancelled";
  trial_ends_at?: string;
  owner_id?: string;
}

/**
 * テナント設定の型定義
 */
export interface TenantConfig {
  id: string;
  tenant_id: string;
  config_key: string;
  config_value: unknown;
  created_at: string;
  updated_at: string;
}

/**
 * テナント専門家の型定義
 */
export interface TenantExpert {
  id: string;
  tenant_id: string;
  user_id: string;
  role: "expert" | "admin";
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // 結合データ（APIレスポンス用）
  profile?: {
    full_name?: string;
    avatar_url?: string;
    email?: string;
  };
}

/**
 * テナントAPIキーの型定義
 */
export interface TenantApiKey {
  id: string;
  tenant_id: string;
  name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  last_used_at?: string;
  allowed_origins?: string[];
}

/**
 * テナント使用量の型定義
 */
export interface TenantUsage {
  id: string;
  tenant_id: string;
  month: string; // YYYY-MM-DD形式（月初日）
  api_calls: number;
  widget_views: number;
  auctions_created: number;
  bids_placed: number;
  created_at: string;
  updated_at: string;
}

/**
 * テナント請求の型定義
 */
export interface TenantInvoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * テナント作成用の入力型
 */
export interface CreateTenantInput {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}
