# TimeBid Development Rules - 絶対遵守事項

## 🤖 AGENT MONITORING: エージェント作業監視・更新ルール（最優先）

### 1. 作業完了時の必須更新

- 作業完了時は必ず以下のファイルを更新すること
- `.windsurf/EXECUTE_NOW.md` - タスク完了状況の更新
- `docs/claude/session-log.md` - セッション記録の追加
- `docs/claude/session-history.md` - セッション履歴の更新

### 2. 次エージェントへの引き継ぎ

- 完了したタスクは明確に「✅ 完了」マーク
- 未完了タスクは「🔄 進行中」または「⏳ 待機」マーク
- 次に参照すべきファイルパスを具体的に記載

### 3. 状況監視の実行

- セッション開始時：`npm run type-check` でエラー確認
- セッション開始時：`docs/claude/CLAUDE_README.md` を参照
- セッション開始時：`.windsurf/EXECUTE_NOW.md` で現在タスク確認
- 作業中：進捗状況を逐次更新

### 4. 緊急度判定

- 🚨 **緊急**: TypeScriptエラー、ビルドエラー
- ⚡ **高優先**: UI改善、機能追加
- 📦 **中優先**: 配布準備、デプロイ準備
- 🎨 **低優先**: UI微調整、ドキュメント整備

## CRITICAL: 破ってはならないルール

### 1. アーキテクチャ制約

- Next.js App Router構造を維持（pages/は禁止）
- Supabase外部のデータベースは使用禁止
- 既存のSupabaseスキーマ変更は事前承認必須
- TypeScript必須、JavaScript変換禁止

### 2. セキュリティ制約

- API KEYのハードコード絶対禁止
- .env.localの本番キー使用禁止
- iframe sandboxing必須（ウィジェット）
- 外部スクリプト読み込み事前承認必須

### 3. パフォーマンス制約

- バンドルサイズ >2MB禁止
- Core Web Vitals: LCP <2.5s, FID <100ms必須
- OpenAI API: 1リクエスト >$0.01禁止
- 画像最適化必須（WebP/AVIF）

### 4. ビジネスロジック制約

- 15%手数料構造変更禁止
- オークション終了ロジック変更は承認必須
- 決済フローはStripe以外禁止
- 日本語UIテキスト以外禁止

## REQUIRED: 必須実装項目

### 1. AI統合

- PricingEngine fallbackは必須
- OpenAI APIエラーハンドリング必須
- AI提案の人間承認フロー必須

### 2. リアルタイム機能

- WebSocket接続失敗時のフォールバック必須
- 5秒以上の遅延アラート必須
- オフライン対応必須

### 3. エラーハンドリング

- ユーザー向けエラーメッセージは日本語
- 開発者向けログは英語
- 致命的エラーは自動回復試行

### 4. テスト

- 新機能にはunit test必須
- integration test必須
- E2Eテスト（critical path）必須

## FORBIDDEN: 禁止事項

### 1. 技術選択

- jQuery, Bootstrap使用禁止
- localStorage/sessionStorageの直接使用禁止
- inline style (style属性) 禁止
- console.log本番環境残存禁止

### 2. UI/UX

- モバイル未対応のコンポーネント禁止
- アクセシビリティ無視禁止（WCAG 2.1 AA必須）
- 英語ユーザー向けテキスト禁止
- 未テストの本番デプロイ禁止

### 3. データ処理

- クライアントサイドでの機密データ処理禁止
- 無制限なAPIコール禁止
- ユーザーデータの外部送信禁止
- SQLインジェクション可能性のあるクエリ禁止

## APPROVAL REQUIRED: 事前承認必須事項

### 1. 外部サービス追加

- 新しいAPI統合
- 新しいライブラリ追加（>1MB）
- 新しいSaaSサービス契約

### 2. 重要機能変更

- 認証フロー変更
- 決済フロー変更
- データスキーマ変更
- 本番環境設定変更

### 3. セキュリティ関連

- CORS設定変更
- CSP設定変更
- 暗号化方式変更
- トークン管理方式変更
