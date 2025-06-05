-- テナント管理テーブル群の作成
-- TimeBid マルチテナントSaaS機能実装

-- テナントテーブル
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0066cc',
  secondary_color TEXT DEFAULT '#f5f5f5',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  subscription_plan TEXT DEFAULT 'basic', -- 'basic', 'professional', 'enterprise'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'trial', 'expired', 'cancelled'
  trial_ends_at TIMESTAMPTZ,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- テナント設定テーブル
CREATE TABLE IF NOT EXISTS tenant_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  config_key TEXT NOT NULL,
  config_value JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, config_key)
);

-- テナント専門家関連テーブル
CREATE TABLE IF NOT EXISTS tenant_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'expert', -- 'expert', 'admin'
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- テナントAPIキーテーブル
CREATE TABLE IF NOT EXISTS tenant_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  allowed_origins TEXT[]
);

-- テナント使用量テーブル
CREATE TABLE IF NOT EXISTS tenant_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- 2025-06-01 形式で月初日を保存
  api_calls INTEGER DEFAULT 0,
  widget_views INTEGER DEFAULT 0,
  auctions_created INTEGER DEFAULT 0,
  bids_placed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, month)
);

-- テナント請求テーブル
CREATE TABLE IF NOT EXISTS tenant_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'JPY',
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'cancelled'
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security) ポリシーの設定
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invoices ENABLE ROW LEVEL SECURITY;

-- テナント所有者ポリシー
CREATE POLICY tenant_owner_policy ON tenants
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- テナント管理者ポリシー
CREATE POLICY tenant_admin_policy ON tenants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_experts
      WHERE tenant_id = tenants.id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- テナント設定ポリシー
CREATE POLICY tenant_config_policy ON tenant_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_experts
      WHERE tenant_id = tenant_configs.tenant_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM tenants
      WHERE id = tenant_configs.tenant_id
      AND owner_id = auth.uid()
    )
  );

-- テナント専門家ポリシー
CREATE POLICY tenant_expert_policy ON tenant_experts
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM tenant_experts
      WHERE tenant_id = tenant_experts.tenant_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM tenants
      WHERE id = tenant_experts.tenant_id
      AND owner_id = auth.uid()
    )
  );

-- テナントAPIキーポリシー
CREATE POLICY tenant_api_key_policy ON tenant_api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_experts
      WHERE tenant_id = tenant_api_keys.tenant_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM tenants
      WHERE id = tenant_api_keys.tenant_id
      AND owner_id = auth.uid()
    )
  );

-- テナント使用量ポリシー
CREATE POLICY tenant_usage_policy ON tenant_usage
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_experts
      WHERE tenant_id = tenant_usage.tenant_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM tenants
      WHERE id = tenant_usage.tenant_id
      AND owner_id = auth.uid()
    )
  );

-- テナント請求ポリシー
CREATE POLICY tenant_invoice_policy ON tenant_invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_experts
      WHERE tenant_id = tenant_invoices.tenant_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM tenants
      WHERE id = tenant_invoices.tenant_id
      AND owner_id = auth.uid()
    )
  );

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenant_experts_tenant_id ON tenant_experts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_experts_user_id ON tenant_experts(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_configs_tenant_id ON tenant_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_tenant_id ON tenant_api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_id_month ON tenant_usage(tenant_id, month);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_tenant_id ON tenant_invoices(tenant_id);

-- 更新日時を自動更新する関数とトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_configs_updated_at
BEFORE UPDATE ON tenant_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_experts_updated_at
BEFORE UPDATE ON tenant_experts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_api_keys_updated_at
BEFORE UPDATE ON tenant_api_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_usage_updated_at
BEFORE UPDATE ON tenant_usage
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_invoices_updated_at
BEFORE UPDATE ON tenant_invoices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 既存のオークションテーブルにテナントIDを追加
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_auctions_tenant_id ON auctions(tenant_id);

-- 既存の入札テーブルにテナントIDを追加（分析用）
ALTER TABLE bids ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_bids_tenant_id ON bids(tenant_id);
