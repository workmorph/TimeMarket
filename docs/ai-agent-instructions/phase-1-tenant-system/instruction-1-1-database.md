# 🎯 Instruction 1-1: マルチテナントデータベース設計

**Phase 1 - Step 1: テナント管理基盤データベース構築**

---

## 📋 **指示概要**

### **タスク定義**

マルチテナントSaaS機能のためのデータベーススキーマ設計・実装

### **成果物**

- テナント管理テーブル群の作成
- Supabaseマイグレーションファイル
- TypeScript型定義ファイル

### **所要時間見積**

- 実装: 4-6時間
- テスト: 1-2時間
- 合計: 5-8時間

---

## 🔧 **前提条件**

### **環境確認**

```bash
# 以下を実行して環境を確認
cd /Users/kentanonaka/workmorph/time-bid
npm run type-check  # エラー0件であること
npm run build       # 成功すること
```

### **依存関係**

- Supabase CLI がインストール済みであること
- プロジェクトが既存のSupabaseに接続済みであること
- 既存のテーブル構造に影響しないこと

---

## 📊 **実装タスク**

### **Task 1.1.1: マイグレーションファイル作成**

#### **新規テーブル設計**

```sql
-- 1. テナント基本情報
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL用識別子
  plan TEXT CHECK (plan IN ('starter', 'pro', 'enterprise')) DEFAULT 'starter',
  status TEXT CHECK (status IN ('active', 'suspended', 'cancelled')) DEFAULT 'active',

  -- ブランディング設定
  brand_settings JSONB DEFAULT '{
    "companyName": "",
    "logoUrl": "",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#60A5FA",
    "fontFamily": "Noto Sans JP"
  }'::jsonb,

  -- 制限設定
  limits JSONB DEFAULT '{
    "monthlyAuctions": 100,
    "apiCallsPerMinute": 60,
    "customDomains": 1,
    "dataRetentionDays": 30
  }'::jsonb,

  -- 機能制限
  features JSONB DEFAULT '{
    "customTheme": false,
    "apiAccess": false,
    "webhooks": false,
    "whiteLabel": false,
    "analytics": false
  }'::jsonb,

  -- メタデータ
  custom_domain TEXT,
  allowed_origins TEXT[] DEFAULT ARRAY['*'],
  webhook_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. テナント・ユーザー関連付け
CREATE TABLE tenant_users (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  permissions JSONB DEFAULT '[]'::jsonb,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (tenant_id, user_id)
);

-- 3. テナント専属専門家
CREATE TABLE tenant_experts (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exclusive BOOLEAN DEFAULT false, -- 専属かどうか
  hourly_rate DECIMAL(10,2), -- テナント固有の時間単価
  specialties TEXT[],
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (tenant_id, expert_id)
);

-- 4. ウィジェット設定
CREATE TABLE widget_configs (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE PRIMARY KEY,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_css TEXT,
  custom_js TEXT,
  allowed_origins TEXT[] DEFAULT ARRAY['*'],
  security JSONB DEFAULT '{
    "rateLimit": {"maxRequests": 60, "windowMs": 60000},
    "contentSecurityPolicy": {}
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- 5. ウィジェット設定変更履歴
CREATE TABLE widget_config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  changed_by UUID REFERENCES users(id),
  change_type TEXT CHECK (change_type IN ('create', 'update', 'delete')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. テナント課金情報
CREATE TABLE tenant_billing (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE PRIMARY KEY,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JPY',
  interval TEXT CHECK (interval IN ('month', 'year')) DEFAULT 'month',
  next_billing_date TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **インデックス作成**

```sql
-- パフォーマンス最適化用インデックス
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX idx_tenant_experts_expert_id ON tenant_experts(expert_id);
CREATE INDEX idx_tenant_experts_exclusive ON tenant_experts(tenant_id, exclusive);
CREATE INDEX idx_widget_config_history_tenant_id ON widget_config_history(tenant_id);
CREATE INDEX idx_widget_config_history_created_at ON widget_config_history(created_at);
```

#### **RLS (Row Level Security) 設定**

```sql
-- テナントデータの分離保証
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;

-- 基本的なRLSポリシー
CREATE POLICY "Users can view their tenant" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM tenant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their tenant" ON tenants
  FOR UPDATE USING (
    id IN (
      SELECT tenant_id FROM tenant_users
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

### **Task 1.1.2: TypeScript型定義作成**

**ファイル作成**: `src/lib/supabase/tenant-types.ts`

```typescript
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "pro" | "enterprise";
  status: "active" | "suspended" | "cancelled";
  brand_settings: {
    companyName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  limits: {
    monthlyAuctions: number;
    apiCallsPerMinute: number;
    customDomains: number;
    dataRetentionDays: number;
  };
  features: {
    customTheme: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    whiteLabel: boolean;
    analytics: boolean;
  };
  custom_domain?: string;
  allowed_origins: string[];
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  tenant_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  permissions: string[];
  joined_at: string;
}

export interface TenantExpert {
  tenant_id: string;
  expert_id: string;
  exclusive: boolean;
  hourly_rate?: number;
  specialties: string[];
  bio?: string;
  is_active: boolean;
  created_at: string;
}

export interface WidgetConfig {
  tenant_id: string;
  config: Record<string, any>;
  custom_css?: string;
  custom_js?: string;
  allowed_origins: string[];
  security: {
    rateLimit: {
      maxRequests: number;
      windowMs: number;
    };
    contentSecurityPolicy: Record<string, any>;
  };
  updated_at: string;
  updated_by?: string;
}

export interface TenantBilling {
  tenant_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
  next_billing_date?: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}
```

### **Task 1.1.3: データベースヘルパー関数作成**

**ファイル作成**: `src/lib/supabase/tenant-helpers.ts`

```typescript
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Tenant, TenantUser, TenantExpert } from "./tenant-types";

export class TenantService {
  private supabase = createClientComponentClient();

  // テナント取得
  async getTenant(tenantId: string): Promise<Tenant | null> {
    const { data, error } = await this.supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();

    if (error) throw error;
    return data;
  }

  // ユーザーのテナント取得
  async getUserTenants(userId: string): Promise<Tenant[]> {
    const { data, error } = await this.supabase
      .from("tenant_users")
      .select("tenant_id, tenants(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data.map((item) => item.tenants).filter(Boolean);
  }

  // テナント専属専門家取得
  async getTenantExperts(tenantId: string): Promise<TenantExpert[]> {
    const { data, error } = await this.supabase
      .from("tenant_experts")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("is_active", true);

    if (error) throw error;
    return data;
  }

  // テナント作成
  async createTenant(
    tenantData: Partial<Tenant>,
    ownerId: string
  ): Promise<Tenant> {
    const { data: tenant, error: tenantError } = await this.supabase
      .from("tenants")
      .insert(tenantData)
      .select()
      .single();

    if (tenantError) throw tenantError;

    // オーナーをテナントに関連付け
    const { error: userError } = await this.supabase
      .from("tenant_users")
      .insert({
        tenant_id: tenant.id,
        user_id: ownerId,
        role: "owner",
      });

    if (userError) throw userError;
    return tenant;
  }
}
```

---

## 🧪 **テスト手順**

### **Test 1.1.1: マイグレーション実行**

```bash
# Supabaseマイグレーション実行
npx supabase db push

# 実行後の確認
npx supabase db dump --schema public
```

### **Test 1.1.2: 型定義確認**

```bash
# TypeScript コンパイル確認
npm run type-check

# ビルド確認
npm run build
```

### **Test 1.1.3: テナントサービステスト**

```typescript
// テスト用データ挿入・取得テスト
const testTenant = await tenantService.createTenant(
  {
    name: "Test Company",
    slug: "test-company",
  },
  "test-user-id"
);

console.log("Created tenant:", testTenant);
```

---

## ✅ **成功条件**

### **必須条件**

- [ ] 全テーブルが正常に作成される
- [ ] インデックスが適切に設定される
- [ ] RLSポリシーが動作する
- [ ] TypeScript型定義がエラーなし
- [ ] npm run build が成功する

### **品質条件**

- [ ] テーブル設計がER図と一致
- [ ] セキュリティ要件を満たす
- [ ] パフォーマンス要件を満たす
- [ ] 既存機能に影響しない

---

## 📝 **GitHubコミット指示**

### **コミット実行**

```bash
# 変更をステージング
git add .

# コミットメッセージ
git commit -m "feat(phase-1): [1-1] マルチテナントデータベース基盤構築

- テナント管理テーブル群作成（tenants, tenant_users, tenant_experts等）
- TypeScript型定義追加（tenant-types.ts, tenant-helpers.ts）
- RLS設定によるマルチテナントデータ分離実装
- インデックス・パフォーマンス最適化完了

Tests:
- マイグレーション実行成功
- TypeScriptコンパイル成功
- ビルド成功

Refs: instruction-1-1-database.md"

# プッシュ
git push origin main
```

---

## 🔗 **次の指示**

### **自動移行**

コミット完了後、以下の指示書に自動移行してください：

**次の指示**:
`docs/ai-agent-instructions/phase-1-tenant-system/instruction-1-2-tenant-api.md`

### **移行条件**

- 上記の成功条件が全て満たされている
- GitHubコミットが正常に完了している
- エラーが発生していない

---

## 🚨 **エラー時の対処**

### **マイグレーションエラー**

1. Supabase接続確認
2. 既存テーブルとの競合確認
3. Claude に詳細報告

### **TypeScriptエラー**

1. 既存型定義との競合確認
2. import/export文法確認
3. エラーメッセージ詳細記録

**問題発生時は即座にClaude に報告し、指示を待ってください。**

---

**作成日**: 2025-06-05 15:15 JST  
**推定完了時刻**: 2025-06-05 21:00 JST  
**次の指示**: instruction-1-2-tenant-api.md
