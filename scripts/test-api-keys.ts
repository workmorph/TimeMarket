/**
 * TimeBid APIキー機能テストスクリプト
 * 
 * このスクリプトは以下の機能をテストします：
 * 1. APIキーの作成
 * 2. APIキーの一覧取得
 * 3. APIキーの検証
 * 4. APIキーの無効化
 * 5. エラーハンドリング
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// .env.testファイルを読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// 環境変数が読み込まれたか確認
const envFile = path.resolve(process.cwd(), '.env.test');
if (fs.existsSync(envFile)) {
  console.log(chalk.green(`✅ 環境変数ファイル(.env.test)を読み込みました`));
} else {
  console.log(chalk.red(`❌ 環境変数ファイル(.env.test)が見つかりません`));
  process.exit(1);
}

// 型定義
interface ApiKey {
  id: string;
  name: string;
  key?: string;
  allowed_origins: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  user_id: string;
}

interface ApiKeyResponse {
  apiKey: ApiKey;
  key?: string;
}

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
  };
}

interface ErrorResponse {
  error: string;
  message?: string;
}

interface VerifyResponse {
  valid: boolean;
  userId?: string;
  message?: string;
}

// 環境変数の読み込み
dotenv.config();

// テスト設定
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

// テスト用のAPIキー情報
const TEST_KEY_NAME = `テスト用APIキー_${new Date().toISOString()}`;
const TEST_ORIGINS = 'https://example.com,https://test.example.com';

// 認証トークンとAPIキーを保持する変数
let authToken: string | null = null;
let createdApiKey: ApiKey | null = null;
let apiKeyValue: string | null | undefined = null;

/**
 * ログイン処理
 */
async function login(): Promise<void> {
  console.log(chalk.blue('🔑 ログイン処理を開始...'));
  
  try {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('TEST_USER_EMAILとTEST_USER_PASSWORDを環境変数に設定してください');
    }
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(`ログイン失敗: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json() as LoginResponse;
    authToken = data.token;
    console.log(chalk.green('✅ ログイン成功'));
  } catch (error) {
    console.error(chalk.red(`❌ ログインエラー: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}

/**
 * APIキーの作成
 */
async function createApiKey(): Promise<void> {
  console.log(chalk.blue('🔑 APIキーの作成を開始...'));
  
  try {
    if (!authToken) {
      throw new Error('認証トークンがありません。先にログインしてください');
    }
    
    const payload = {
      name: TEST_KEY_NAME,
      allowed_origins: TEST_ORIGINS.split(',').map(origin => origin.trim()),
    };
    
    const response = await fetch(`${BASE_URL}/api/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(`APIキー作成失敗: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json() as ApiKeyResponse;
    createdApiKey = data.apiKey;
    apiKeyValue = data.apiKey.key;
    
    console.log(chalk.green('✅ APIキー作成成功'));
    console.log(chalk.yellow('📝 APIキー情報:'));
    if (createdApiKey) {
      console.log(chalk.yellow(`  - ID: ${createdApiKey.id}`));
      console.log(chalk.yellow(`  - 名前: ${createdApiKey.name}`));
      console.log(chalk.yellow(`  - 許可オリジン: ${createdApiKey.allowed_origins.join(', ')}`));
      console.log(chalk.yellow(`  - 作成日: ${new Date(createdApiKey.created_at).toLocaleString()}`));
      console.log(chalk.yellow(`  - APIキー値: ${apiKeyValue}`));
    }
  } catch (error) {
    console.error(chalk.red(`❌ APIキー作成エラー: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}

/**
 * APIキーの一覧取得
 */
async function listApiKeys(): Promise<void> {
  console.log(chalk.blue('📋 APIキー一覧の取得を開始...'));
  
  try {
    if (!authToken) {
      throw new Error('認証トークンがありません。先にログインしてください');
    }
    
    const response = await fetch(`${BASE_URL}/api/api-keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(`APIキー一覧取得失敗: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json() as ApiKey[];
    console.log(chalk.green(`✅ APIキー一覧取得成功 (${data.length}件)`));
    
    // 作成したAPIキーが一覧に含まれているか確認
    const foundKey = data.find((key) => key.id === createdApiKey?.id);
    if (foundKey) {
      console.log(chalk.green('✅ 作成したAPIキーが一覧に含まれています'));
    } else {
      console.log(chalk.red('❌ 作成したAPIキーが一覧に含まれていません'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ APIキー一覧取得エラー: ${error instanceof Error ? error.message : String(error)}`));
  }
}

/**
 * APIキーの検証
 */
async function verifyApiKey(): Promise<void> {
  console.log(chalk.blue('🔍 APIキーの検証を開始...'));
  
  try {
    if (!apiKeyValue) {
      throw new Error('APIキー値がありません。先にAPIキーを作成してください');
    }
    
    // テスト用のオリジンを設定
    const testOrigin = TEST_ORIGINS.split(',')[0].trim();
    
    const response = await fetch(`${BASE_URL}/api/verify-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': testOrigin,
      },
      body: JSON.stringify({ apiKey: apiKeyValue }),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(`APIキー検証失敗: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json() as VerifyResponse;
    console.log(chalk.green('✅ APIキー検証成功'));
    console.log(chalk.yellow('📝 検証結果:'));
    console.log(chalk.yellow(`  - 有効: ${data.valid}`));
    console.log(chalk.yellow(`  - ユーザーID: ${data.userId}`));
    
    // 不正なオリジンでのテスト
    console.log(chalk.blue('🔍 不正なオリジンでのAPIキー検証を開始...'));
    
    const invalidResponse = await fetch(`${BASE_URL}/api/verify-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://invalid-origin.com',
      },
      body: JSON.stringify({ apiKey: apiKeyValue }),
    });
    
    if (!invalidResponse.ok) {
      console.log(chalk.green('✅ 不正なオリジンでの検証は適切に拒否されました'));
    } else {
      console.log(chalk.red('❌ 不正なオリジンでの検証が成功してしまいました（バグ）'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ APIキー検証エラー: ${error instanceof Error ? error.message : String(error)}`));
  }
}

/**
 * APIキーの無効化
 */
async function deactivateApiKey(): Promise<void> {
  console.log(chalk.blue('🗑 APIキーの無効化を開始...'));
  
  try {
    if (!authToken) {
      throw new Error('認証トークンがありません。先にログインしてください');
    }
    
    if (!createdApiKey) {
      throw new Error('APIキーがありません。先にAPIキーを作成してください');
    }
    
    const response = await fetch(`${BASE_URL}/api/api-keys/${createdApiKey.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(`APIキー無効化失敗: ${errorData.error || response.statusText}`);
    }
    
    console.log(chalk.green('✅ APIキー無効化成功'));
    
    // 無効化されたAPIキーで検証を試みる
    console.log(chalk.blue('🔍 無効化されたAPIキーでの検証を開始...'));
    
    const testOrigin = TEST_ORIGINS.split(',')[0].trim();
    
    const verifyResponse = await fetch(`${BASE_URL}/api/verify-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': testOrigin,
      },
      body: JSON.stringify({ apiKey: apiKeyValue }),
    });
    
    if (!verifyResponse.ok) {
      console.log(chalk.green('✅ 無効化されたAPIキーは適切に拒否されました'));
    } else {
      const data = await verifyResponse.json() as VerifyResponse;
      if (data.valid) {
        console.log(chalk.red('❌ 無効化されたAPIキーが有効と判定されてしまいました（バグ）'));
      } else {
        console.log(chalk.green('✅ 無効化されたAPIキーは適切に無効と判定されました'));
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ APIキー無効化エラー: ${error instanceof Error ? error.message : String(error)}`));
  }
}

/**
 * エラーケースのテスト
 */
async function testErrorCases(): Promise<void> {
  console.log(chalk.blue('🚨 エラーケースのテストを開始...'));
  
  try {
    if (!authToken) {
      throw new Error('認証トークンがありません。先にログインしてください');
    }
    
    // 不正なAPIキーでの検証テスト
    console.log(chalk.blue('🔍 不正なAPIキーでの検証テストを開始...'));
    
    const invalidKeyResponse = await fetch(`${BASE_URL}/api/verify-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': TEST_ORIGINS.split(',')[0].trim(),
      },
      body: JSON.stringify({ apiKey: 'invalid_key_' + uuidv4() }),
    });
    
    if (!invalidKeyResponse.ok) {
      const errorData = await invalidKeyResponse.json() as ErrorResponse;
      console.log(chalk.green(`✅ 不正なAPIキーは適切に拒否されました: ${errorData.error}`));
    } else {
      const data = await invalidKeyResponse.json() as VerifyResponse;
      console.log(chalk.red(`❌ 不正なAPIキーが有効と判定されてしまいました: ${JSON.stringify(data)}`));
    }
    
    // 名前なしでAPIキーを作成するテスト
    console.log(chalk.blue('🔑 名前なしでAPIキー作成テストを開始...'));
    
    const noNameResponse = await fetch(`${BASE_URL}/api/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: '' }),
    });
    
    if (!noNameResponse.ok) {
      const errorData = await noNameResponse.json() as ErrorResponse;
      console.log(chalk.green(`✅ 名前なしのAPIキー作成は適切に拒否されました: ${errorData.error}`));
    } else {
      console.log(chalk.red('❌ 名前なしでAPIキーが作成されてしまいました（バグ）'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ エラーケーステストエラー: ${error instanceof Error ? error.message : String(error)}`));
  }
}

/**
 * メイン実行関数
 */
async function main(): Promise<void> {
  console.log(chalk.yellow('=== TimeBid APIキー機能テスト開始 ==='));
  console.log(chalk.yellow(`実行日時: ${new Date().toLocaleString()}`));
  console.log(chalk.yellow(`API URL: ${BASE_URL}`));
  console.log(chalk.yellow('==================================='));
  
  try {
    // 1. ログイン
    await login();
    
    // 2. APIキーの作成
    await createApiKey();
    
    // 3. APIキーの一覧取得
    await listApiKeys();
    
    // 4. APIキーの検証
    await verifyApiKey();
    
    // 5. エラーケースのテスト
    await testErrorCases();
    
    // 6. APIキーの無効化
    await deactivateApiKey();
    
    console.log(chalk.green('\n✅ すべてのテストが完了しました'));
  } catch (error) {
    console.error(chalk.red(`\n❌ テスト実行中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`));
  } finally {
    console.log(chalk.yellow('=== TimeBid APIキー機能テスト終了 ==='));
  }
}

// スクリプト実行
main();
