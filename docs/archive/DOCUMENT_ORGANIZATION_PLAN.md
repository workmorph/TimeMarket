# 📂 TimeBid ドキュメント整理計画

## 現在の問題点
- ルートディレクトリに20以上のドキュメントが散在
- 重複した内容のファイルが存在
- どのファイルを見ればいいか分かりにくい
- 時系列が把握しづらい

## 📋 提案する新しい構造

```
/Users/kentanonaka/workmorph/time-bid/
├── README.md                    # プロジェクト概要（そのまま）
├── .windsurf/                   # Windsurf専用（現状維持）
│   └── （現在のファイル群）
├── docs/                        # 📁 新規作成
│   ├── README.md               # ドキュメント総合インデックス
│   ├── 01-overview/            # プロジェクト概要
│   │   ├── PROJECT_STATUS.md   # 現在の進捗状況
│   │   ├── ARCHITECTURE.md     # 技術構成
│   │   └── ROADMAP.md          # ロードマップ
│   ├── 02-sessions/            # セッション履歴
│   │   ├── SESSION_LOG.md      # セッション記録
│   │   ├── SESSION_HISTORY.md  # 時系列履歴
│   │   └── HANDOVER.md         # 引き継ぎ文書
│   ├── 03-tasks/               # タスク管理
│   │   ├── CURRENT_SPRINT.md   # 現在のスプリント
│   │   ├── PARALLEL_TASKS.md   # 並列タスク一覧
│   │   └── DAY_PLANS/          # 日別計画
│   ├── 04-team/                # チーム管理
│   │   ├── TEAM_MANAGEMENT.md  # 5人体制管理
│   │   ├── CASCADE_GUIDE.md    # Windsurf操作
│   │   └── INSTRUCTIONS/       # 各担当への指示
│   └── 05-archive/             # アーカイブ
│       └── （古いドキュメント）
└── scripts/                     # スクリプト（現状維持）
```

## 🔄 整理手順

### Phase 1: ディレクトリ作成
```bash
mkdir -p docs/{01-overview,02-sessions,03-tasks,04-team,05-archive}
mkdir -p docs/03-tasks/DAY_PLANS
mkdir -p docs/04-team/INSTRUCTIONS
```

### Phase 2: ファイル移動とリネーム

| 現在のファイル | 移動先 | 新名称 |
|---------------|--------|--------|
| CLAUDE_SESSION_LOG.md | docs/02-sessions/ | SESSION_LOG.md |
| CLAUDE_SESSION_HISTORY.md | docs/02-sessions/ | SESSION_HISTORY.md |
| CLAUDE_HANDOVER.md | docs/02-sessions/ | HANDOVER.md |
| SPRINT_80_PERCENT.md | docs/03-tasks/ | CURRENT_SPRINT.md |
| PARALLEL_TASKS*.md | docs/03-tasks/ | 統合して PARALLEL_TASKS.md |
| TEAM_MANAGEMENT_5.md | docs/04-team/ | TEAM_MANAGEMENT.md |
| WINDSURF_CASCADE_GUIDE.md | docs/04-team/ | CASCADE_GUIDE.md |
| DAY1_IMMEDIATE_TASKS.md | docs/03-tasks/DAY_PLANS/ | DAY1.md |

### Phase 3: 新規作成ファイル

#### docs/README.md（総合インデックス）
```markdown
# 📚 TimeBid ドキュメント

## 🚀 クイックスタート
- 現在の進捗: [PROJECT_STATUS.md](01-overview/PROJECT_STATUS.md)
- 今日のタスク: [CURRENT_SPRINT.md](03-tasks/CURRENT_SPRINT.md)
- チーム状況: [TEAM_MANAGEMENT.md](04-team/TEAM_MANAGEMENT.md)

## 📂 ディレクトリ構成
1. **01-overview/** - プロジェクト概要
2. **02-sessions/** - 開発履歴と引き継ぎ
3. **03-tasks/** - タスク管理
4. **04-team/** - チーム運営
5. **05-archive/** - 過去の文書
```

#### docs/01-overview/PROJECT_STATUS.md（統合ステータス）
```markdown
# 🎯 TimeBid プロジェクトステータス

## 現在の進捗: 40%
- Phase 1: UI改善 ✅
- Phase 2: 決済実装 🔄 進行中
- Phase 3: 本番準備 ⏳

## アクティブなタスク
1. Stripe決済（Person 1）
2. 静的ページ（Person 2）
3. テスト作成（Person 3）

最終更新: 2025-06-03 15:30
```

## 📊 整理によるメリット

1. **可読性向上**
   - カテゴリ別に整理
   - 明確な階層構造
   - 統一された命名規則

2. **保存性向上**
   - バージョン管理しやすい
   - アーカイブが明確
   - 重複の排除

3. **効率的なアクセス**
   - README.mdから即アクセス
   - 役割別に参照可能
   - 最新情報の把握が容易

## 🎯 実行確認

この整理を実行してよろしいですか？実行する場合：
1. バックアップを作成
2. 段階的に移動
3. リンクの更新
4. チームへの周知

準備ができたら「実行」とお伝えください。
