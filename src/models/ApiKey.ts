import { SupabaseClient } from '@supabase/supabase-js';
import { randomBytes, createHash } from 'crypto';

export interface ApiKeyPermissions {
  read: boolean;
  write: boolean;
  [key: string]: boolean;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key: string;
  name: string;
  permissions: ApiKeyPermissions;
  allowed_origins: string[];
  rate_limit: number;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  is_active: boolean;
}

export interface CreateApiKeyParams {
  name: string;
  permissions?: ApiKeyPermissions;
  allowed_origins?: string[];
  rate_limit?: number;
  expires_at?: string | null;
}

/**
 * APIキーを生成する
 * @returns 生成されたAPIキー
 */
export function generateApiKey(): string {
  // プレフィックスを付けて識別しやすくする
  const prefix = 'tb_';
  // ランダムな32バイトを生成し、base64エンコード
  const randomString = randomBytes(32).toString('base64');
  // 特殊文字を除去
  const cleanString = randomString.replace(/[+/=]/g, '');
  // 先頭24文字を使用
  return `${prefix}${cleanString.substring(0, 24)}`;
}

/**
 * APIキーのハッシュを生成する
 * @param apiKey APIキー
 * @returns ハッシュ化されたAPIキー
 */
export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

/**
 * APIキーを作成する
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @param params 作成パラメータ
 * @returns 作成されたAPIキーと生のAPIキー
 */
export async function createApiKey(
  supabase: SupabaseClient,
  userId: string,
  params: CreateApiKeyParams
): Promise<{ apiKey: ApiKey; rawKey: string }> {
  const rawKey = generateApiKey();
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      key: rawKey,
      name: params.name,
      permissions: params.permissions || { read: true, write: false },
      allowed_origins: params.allowed_origins || [],
      rate_limit: params.rate_limit || 100,
      expires_at: params.expires_at || null
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`APIキーの作成に失敗しました: ${error.message}`);
  }
  
  return { apiKey: data as ApiKey, rawKey };
}

/**
 * APIキーを検証する
 * @param supabase Supabaseクライアント
 * @param apiKey APIキー
 * @param origin オリジン（オプション）
 * @returns 検証結果
 */
export async function validateApiKey(
  supabase: SupabaseClient,
  apiKey: string,
  origin?: string
): Promise<{ isValid: boolean; userId?: string; permissions?: ApiKeyPermissions }> {
  const { data, error } = await supabase
    .rpc('validate_api_key', { api_key: apiKey, origin: origin || null });
  
  if (error || !data || data.length === 0) {
    return { isValid: false };
  }
  
  return {
    isValid: data[0].is_valid,
    userId: data[0].user_id,
    permissions: data[0].permissions
  };
}

/**
 * ユーザーのAPIキーを取得する
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @returns APIキーのリスト
 */
export async function getUserApiKeys(
  supabase: SupabaseClient,
  userId: string
): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`APIキーの取得に失敗しました: ${error.message}`);
  }
  
  return data as ApiKey[];
}

/**
 * APIキーを無効化する
 * @param supabase Supabaseクライアント
 * @param keyId APIキーID
 * @param userId ユーザーID
 * @returns 無効化されたAPIキー
 */
export async function deactivateApiKey(
  supabase: SupabaseClient,
  keyId: string,
  userId: string
): Promise<ApiKey> {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(`APIキーの無効化に失敗しました: ${error.message}`);
  }
  
  return data as ApiKey;
}
