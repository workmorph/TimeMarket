#!/bin/bash

# TimeBid ドキュメント整理スクリプト
# 実行前に必ずバックアップを取ってください

echo "📚 TimeBid ドキュメント整理を開始します..."
echo "⚠️  実行前の確認："
echo "  - 現在のディレクトリは正しいですか？"
echo "  - Gitでコミット済みですか？"
echo ""
read -p "続行しますか？ (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "キャンセルしました"
    exit 1
fi

# 1. ディレクトリ作成
echo "📁 ディレクトリ構造を作成中..."
mkdir -p docs/{01-active,02-management,03-windsurf,04-tasks,05-technical,99-archive}
mkdir -p docs/99-archive/{old-tasks,old-sessions,deprecated}

# 2. 現在アクティブなファイルを移動
echo "🔥 アクティブなファイルを整理中..."

# メインスプリント
if [ -f "SPRINT_80_PERCENT.md" ]; then
    cp SPRINT_80_PERCENT.md docs/01-active/CURRENT_SPRINT.md
    echo "  ✅ CURRENT_SPRINT.md 作成"
fi

# チーム管理
if [ -f "TEAM_MANAGEMENT_5.md" ]; then
    cp TEAM_MANAGEMENT_5.md docs/01-active/TEAM_STATUS.md
    echo "  ✅ TEAM_STATUS.md 作成"
fi

# 並列タスクを統合
echo "📝 並列タスクを統合中..."
cat > docs/01-active/PARALLEL_TASKS.md << 'EOF'
# 並列実行可能タスク（統合版）

## 最終更新: $(date)

### 優先度順タスク一覧

EOF

# 各PARALLEL_TASKS*.mdを統合
for file in PARALLEL_TASKS*.md; do
    if [ -f "$file" ]; then
        echo "### From $file" >> docs/01-active/PARALLEL_TASKS.md
        echo "" >> docs/01-active/PARALLEL_TASKS.md
        cat "$file" >> docs/01-active/PARALLEL_TASKS.md
        echo "" >> docs/01-active/PARALLEL_TASKS.md
    fi
done

# 3. 管理ドキュメントを移動
echo "📋 管理ドキュメントを整理中..."
[ -f "CLAUDE_HANDOVER.md" ] && cp CLAUDE_HANDOVER.md docs/02-management/
[ -f "CLAUDE_SESSION_HISTORY.md" ] && cp CLAUDE_SESSION_HISTORY.md docs/02-management/SESSION_HISTORY.md
[ -f "CLAUDE_SESSION_LOG.md" ] && cp CLAUDE_SESSION_LOG.md docs/02-management/

# 4. Windsurfドキュメントを整理
echo "🤖 Windsurfドキュメントを整理中..."
[ -f "WINDSURF_INSTRUCTIONS.md" ] && cp WINDSURF_INSTRUCTIONS.md docs/03-windsurf/instructions.md
[ -f "WINDSURF_CASCADE_GUIDE.md" ] && cp WINDSURF_CASCADE_GUIDE.md docs/03-windsurf/cascade-guide.md

# .windsurfディレクトリから重要ファイルをコピー
[ -f ".windsurf/rules.md" ] && cp .windsurf/rules.md docs/03-windsurf/
[ -f ".windsurf/CHECKLIST.md" ] && cp .windsurf/CHECKLIST.md docs/03-windsurf/checklist.md
[ -f ".windsurf/execution-log.md" ] && cp .windsurf/execution-log.md docs/03-windsurf/

# 5. ナビゲーションREADME作成
echo "📖 ナビゲーションを作成中..."
cat > docs/README.md << 'EOF'
# 📚 TimeBid ドキュメントナビゲーション

## 🔥 今すぐ確認すべきファイル

### 現在の状況
- [現在のスプリント](01-active/CURRENT_SPRINT.md) - 実行中のメインタスク
- [チーム状況](01-active/TEAM_STATUS.md) - 5人体制の現状
- [並列タスク一覧](01-active/PARALLEL_TASKS.md) - 実行可能なタスク

### 進捗確認
- [実行ログ](03-windsurf/execution-log.md) - Windsurfの実行記録
- [セッション履歴](02-management/SESSION_HISTORY.md) - これまでの作業履歴

## 📋 プロジェクト管理

### 引き継ぎ・履歴
- [Claude引き継ぎ](02-management/CLAUDE_HANDOVER.md) - セッション間の引き継ぎ
- [プロジェクト全体像](02-management/CLAUDE_SESSION_LOG.md) - 初期分析と戦略

### Windsurf管理
- [開発ルール](03-windsurf/rules.md) - 絶対遵守事項
- [実行前チェックリスト](03-windsurf/checklist.md) - 作業開始前の確認
- [Cascade使い方](03-windsurf/cascade-guide.md) - 複数AI並列実行

## 🔧 技術リファレンス

### アーキテクチャ
- [技術スタック] - Next.js, Supabase, Stripe
- [プロジェクト構造] - ディレクトリ説明

### 実装ガイド
- Phase 1: UI改善
- Phase 2: バックエンド
- Phase 3: デプロイ

## 📊 現在の進捗

- **全体進捗**: 45% / 80%（目標）
- **本日の目標**: 80%達成
- **MVP予定**: 2025-06-11

---
最終更新: $(date)
EOF

# 6. NEXT_ACTIONS作成
echo "🎯 次のアクションを作成中..."
cat > docs/01-active/NEXT_ACTIONS.md << 'EOF'
# 🎯 次のアクション

## 更新時刻: $(date)

### 🟢 現在実行中
1. **Cascade 1**: Stripe決済実装（Phase 1）- 進行中
2. **Cascade 2**: 静的ページ作成（Track A）- 進行中

### 🟡 待機中（優先順）
1. **Cascade 3**: テストスイート構築（Track D）
2. **Cascade 4**: シードデータ準備（Track F）
3. **Cascade 5**: SEO最適化（Track K）

### 🔴 ブロッカー
- なし

### 📊 本日の目標
- [ ] 決済フロー完成
- [ ] 静的ページ全完成
- [ ] テスト基盤構築
- [ ] デモデータ投入
- [ ] SEO基本設定

### ⏰ タイムライン
- 16:00 - Cascade 2 完了予定
- 17:00 - Cascade 1 完了予定
- 18:00 - 全体確認・進捗80%達成

### 💡 次のClaude確認ポイント
1. 実行ログ確認: `cat docs/03-windsurf/execution-log.md`
2. 進捗状況把握: `cat docs/01-active/TEAM_STATUS.md`
3. ブロッカー確認: このファイルの🔴セクション
EOF

# 7. アーカイブ
echo "📦 完了済みファイルをアーカイブ中..."
[ -f "DAY1_IMMEDIATE_TASKS.md" ] && mv DAY1_IMMEDIATE_TASKS.md docs/99-archive/old-tasks/

# 8. クリーンアップオプション（コメントアウト中）
echo ""
echo "✅ 整理が完了しました！"
echo ""
echo "📝 次のステップ："
echo "1. docs/README.md を確認してナビゲーションを把握"
echo "2. docs/01-active/ で現在のタスクを確認"
echo "3. 不要になった元ファイルは手動で削除してください"
echo ""
echo "💡 ヒント: 今後は docs/01-active/NEXT_ACTIONS.md を更新して進捗管理"

# 9. 整理結果の表示
echo ""
echo "📊 整理結果："
echo "  Active: $(ls -1 docs/01-active/ 2>/dev/null | wc -l) files"
echo "  Management: $(ls -1 docs/02-management/ 2>/dev/null | wc -l) files"
echo "  Windsurf: $(ls -1 docs/03-windsurf/ 2>/dev/null | wc -l) files"
echo "  Archive: $(find docs/99-archive -type f 2>/dev/null | wc -l) files"
