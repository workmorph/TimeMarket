# TimeBid ドキュメントナビゲーション

## 🗺️ ドキュメント構造

```
docs/
├── PROJECT_STATUS.md          # 🎯 プロジェクト全体状況（最重要）
├── architecture/              # システム設計文書
├── claude/                    # Claude AI関連
│   ├── HANDOVER.md           # 引き継ぎ文書
│   ├── SESSION_HISTORY.md    # セッション履歴
│   └── SESSION_LOG.md        # 詳細ログ
├── tasks/                     # タスク管理
│   ├── SPRINT_80_PERCENT.md  # 現在のスプリント
│   ├── PARALLEL_TASKS.md     # 並列実行タスク
│   └── その他タスク文書
├── operations/               # 運用関連
└── team-logs/               # チーム別ログ
```

## 🚀 クイックアクセス

### 今すぐ確認すべき文書
1. [プロジェクト全体状況](PROJECT_STATUS.md) - 全体像を5分で把握
2. [開発ルール](../.windsurf/rules.md) - 絶対遵守事項
3. [現在のタスク](../.windsurf/EXECUTE_NOW.md) - 実行中の作業
4. [実行ログ](../.windsurf/execution-log.md) - 最新の実行状況

### Claude セッション開始時
1. [引き継ぎ文書](claude/HANDOVER.md) - 前回からの引き継ぎ
2. [セッション履歴](claude/SESSION_HISTORY.md) - 過去の作業記録

### タスク管理
1. [80%スプリント](tasks/SPRINT_80_PERCENT.md) - 本日の目標
2. [並列タスク](tasks/PARALLEL_TASKS.md) - チーム別作業

## 📊 ステータス確認コマンド

```bash
# プロジェクト全体の状況確認
cat docs/PROJECT_STATUS.md

# 開発ルール確認（最重要）
cat .windsurf/rules.md

# 実行ログの最新20行
tail -20 .windsurf/execution-log.md

# クイックステータス確認
npm run check-status
```

## 🔄 更新ルール

- **PROJECT_STATUS.md**: 1時間ごと更新
- **execution-log.md**: タスク完了ごと
- **HANDOVER.md**: セッション終了時
- **team-logs/**: 30分ごと

## 👥 チーム別担当

| チーム | 担当領域 | 主要ディレクトリ |
|--------|----------|-----------------|
| Team-Main | コア機能 | src/app/, src/components/ |
| Team-Docs | ドキュメント | src/app/terms/, docs/ |
| Team-Admin | 管理機能 | src/app/admin/ |
| Team-Quality | テスト | src/__tests__/, cypress/ |

---

最終更新: 2025-06-03 15:00 JST