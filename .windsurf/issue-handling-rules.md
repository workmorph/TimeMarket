# Issue処理ルール - Windsurf自動実装ガイド

## 自動実装可能なIssueパターン

### ✅ 完全自動化可能（Windsurfが単独で実装）
- UIコンポーネントのスタイル改善
- TypeScriptの型定義追加
- アクセシビリティ属性追加
- レスポンシブデザイン対応
- console.log削除
- エラーハンドリング追加

### ⚠️ 部分自動化（人間の確認必要）
- 新規API統合（環境変数設定が必要）
- データベーススキーマ変更
- 認証フロー変更
- 外部ライブラリ追加

### ❌ 自動化不可（人間専用）
- ビジネスロジック変更
- 料金体系変更
- 本番環境設定
- セキュリティポリシー変更

## Issueラベルによる自動判定

```yaml
windsurf-ready: 即座に自動実装開始
needs-review: 実装後に人間のレビュー必要
human-only: Windsurfは実装しない
```

## 実装前チェックリスト
1. [ ] rules.mdの制約確認
2. [ ] 既存機能への影響評価
3. [ ] テストケース作成
4. [ ] パフォーマンス影響確認

## エスカレーション条件
- ビルドエラー発生
- テストカバレッジ80%未満
- パフォーマンス劣化検出
- セキュリティ警告
