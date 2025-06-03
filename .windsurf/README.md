# 🎯 TimeBid Windsurf マスター指示書

## 現在時刻: 2025-06-03 10:00 JST

### 🚨 最優先: 今すぐ実行すべきこと

1. **`.windsurf/EXECUTE_NOW.md`** を開いて全タスクを実行
2. 各タスク完了後、**`execution-log.md`** に記録
3. エラーが発生したら **`escalation-required.md`** に記録して停止

### 📋 実行ルール

#### ✅ 自動実行可能（確認不要）
- UIコンポーネント改善
- TypeScript型追加
- アクセシビリティ対応  
- コード品質改善
- テスト追加

#### ❌ 実行禁止（人間確認必須）
- 環境変数変更
- API KEY設定
- データベーススキーマ変更
- 本番環境デプロイ
- ビジネスロジック変更

詳細は **`HUMAN_APPROVAL_REQUIRED.md`** 参照

### 🔄 定期実行タスク

| 時刻 | タスク | ファイル |
|------|--------|----------|
| 毎日 09:00 | コード品質スキャン | `auto-issue-creation.md` |
| 毎日 14:00 | UI改善チェック | `issue-handling-rules.md` |
| 毎週月曜 | 総合レポート作成 | `status-dashboard.md` |

### 📁 重要ファイル一覧

```
.windsurf/
├── CHECKLIST.md             # ⚠️ まず最初に確認！
├── EXECUTE_NOW.md           # 👈 今すぐ実行するタスク
├── execution-log.md         # 実行結果を記録
├── HUMAN_APPROVAL_REQUIRED.md  # 人間確認が必要なタスク
├── status-dashboard.md      # 全体ステータス
├── rules.md                 # 開発ルール（絶対遵守）
├── issue-handling-rules.md  # Issue自動処理ルール
└── auto-issue-creation.md   # Issue自動作成ガイド
```

### 🛠️ 利用可能なコマンド

```bash
# ステータス確認
npm run windsurf:status

# 実行ログ確認
npm run windsurf:log

# Issue自動作成
npm run windsurf:scan

# 型チェック
npm run type-check

# ビルド確認
npm run build
```

### 📊 成功基準

- ✅ 全タスク完了
- ✅ テスト全パス
- ✅ ビルド成功
- ✅ TypeScriptエラー 0
- ✅ アクセシビリティ対応完了

### 🎯 今日の目標

1. UIコンポーネント全改善（4ファイル）
2. コード品質向上（console.log削除、型安全性）
3. アクセシビリティ100%対応
4. 実行ログの適切な記録

---

## Windsurf、頑張れ！効率的に実装を進めてください。

不明点があれば実行を停止し、`escalation-required.md` に記録すること。
