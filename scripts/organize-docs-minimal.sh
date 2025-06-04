#!/bin/bash

# TimeBid ドキュメント最小限整理スクリプト
# 実行: bash scripts/organize-docs-minimal.sh

echo "📚 TimeBid ドキュメント整理を開始..."

# 1. アーカイブディレクトリ作成
echo "📁 アーカイブディレクトリを作成..."
mkdir -p docs/archive
mkdir -p docs/reference
mkdir -p docs/active

# 2. 古いファイルをアーカイブ
echo "🗄️ 古いファイルをアーカイブ..."
[ -f "DAY1_IMMEDIATE_TASKS.md" ] && mv DAY1_IMMEDIATE_TASKS.md docs/archive/
[ -f "DOCUMENT_ORGANIZATION_PLAN.md" ] && mv DOCUMENT_ORGANIZATION_PLAN.md docs/archive/

# 3. 統合ダッシュボードへのシンボリックリンク作成
echo "🔗 重要ファイルへのリンクを作成..."
ln -sf ../../PROJECT_DASHBOARD.md docs/active/DASHBOARD.md 2>/dev/null || true
ln -sf ../../CLAUDE_HANDOVER.md docs/active/LATEST_HANDOVER.md 2>/dev/null || true

# 4. 整理完了メッセージ
echo "✅ 最小限の整理が完了しました！"
echo ""
echo "📊 整理結果："
echo "- アーカイブ済み: $(ls docs/archive 2>/dev/null | wc -l) ファイル"
echo "- アクティブ: $(ls *.md 2>/dev/null | grep -v README | wc -l) ファイル"
echo ""
echo "💡 次のステップ："
echo "1. PROJECT_DASHBOARD.md で全体状況を確認"
echo "2. 17:00頃に本格的な整理を実施"
echo ""
echo "📍 重要: 現在実行中のタスクファイルは移動していません"

# 5. ログに記録
echo "[$(date '+%Y-%m-%d %H:%M')] ドキュメント最小限整理完了" >> .windsurf/execution-log.md
