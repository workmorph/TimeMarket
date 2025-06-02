オークション詳細ページのSupabase連携実装 - 作業ログ
日時: 2025年6月2日

実装した変更点
モックデータからリアルタイムデータへの切り替え
useRealtimeAuctionフックを使用して、Supabaseからオークション情報と入札履歴をリアルタイムで取得
データ取得中のローディング表示を追加
エラー発生時のエラー表示を追加
フォールバック用のモックデータを用意し、データ取得前に表示
ユーティリティ関数の整理
getTimeRemaining、formatCurrency、formatDateTime関数を/src/lib/utils.tsに移動
共通関数として再利用可能に
入札フォームの実装
入札フォームコンポーネント(/src/app/auctions/[id]/bid-form.tsx)を作成
入札額のバリデーション機能を追加
ログイン状態に応じた入札処理の分岐を実装
未ログイン時はログインページへリダイレクト
型安全性の向上
型エラーを修正し、nullチェックを追加
オプショナルチェイニングとnullish coalescing演算子を使用してnull安全なコードに
技術的な詳細
Supabaseのリアルタイム機能を使用して、オークション情報と入札履歴の変更をサブスクライブ
Zustandストアではなく、React Hooksを使用してコンポーネント内で状態管理
入札処理はSupabaseのトランザクションに相当する処理で、入札テーブルへの挿入とオークション情報の更新を連続して実行
修正したファイル
/src/app/auctions/[id]/page.tsx - オークション詳細ページをSupabaseと連携
/src/app/auctions/[id]/bid-form.tsx - 入札フォームコンポーネントを新規作成
/src/lib/utils.ts - ユーティリティ関数を追加
今後の課題
オークション一覧ページの実装
オークション作成機能の追加
認証保護ルートの適用
決済連携の実装
参考情報
useRealtimeAuctionフックは/src/hooks/use-realtime-auction.tsに実装されています
認証機能は/src/hooks/use-auth.tsを使用しています
Supabaseクライアントは/src/lib/supabase.tsで設定されています
このログは、他の開発者が変更内容を理解し、今後の開発を継続するための参考情報として記録されています。

Feedback submitted