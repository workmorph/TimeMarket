// サーバークライアントとクライアントサイドクライアントをエクスポート
import { createClient as createServerClient } from './server';
import { createClient as createBrowserClient } from './client';

// サーバーサイドのクライアント作成関数をエクスポート
export { createServerClient as createClient };
export { createBrowserClient };
