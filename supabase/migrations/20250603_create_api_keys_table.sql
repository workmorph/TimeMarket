-- API Keysテーブルの作成
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{"read": true, "write": false}'::jsonb,
  allowed_origins TEXT[] DEFAULT ARRAY[]::TEXT[],
  rate_limit INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_idx ON api_keys(key);

-- RLSポリシーの設定
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のAPIキーのみ閲覧可能
CREATE POLICY "Users can view their own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザーは自分のAPIキーのみ作成可能
CREATE POLICY "Users can insert their own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のAPIキーのみ更新可能
CREATE POLICY "Users can update their own API keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーは自分のAPIキーのみ削除可能
CREATE POLICY "Users can delete their own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- サービスロールはすべてのAPIキーにアクセス可能
CREATE POLICY "Service role has full access to API keys" ON api_keys
  USING (auth.role() = 'service_role');

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON api_keys
FOR EACH ROW
EXECUTE FUNCTION update_api_keys_updated_at();

-- APIキー検証関数
CREATE OR REPLACE FUNCTION validate_api_key(api_key TEXT, origin TEXT DEFAULT NULL)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  permissions JSONB,
  rate_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as is_valid,
    k.user_id,
    k.permissions,
    k.rate_limit
  FROM api_keys k
  WHERE 
    k.key = api_key
    AND k.is_active = TRUE
    AND (k.expires_at IS NULL OR k.expires_at > now())
    AND (origin IS NULL OR origin = '' OR origin = ANY(k.allowed_origins) OR array_length(k.allowed_origins, 1) IS NULL);
    
  -- 最終使用日時を更新
  UPDATE api_keys
  SET last_used_at = now()
  WHERE key = api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
