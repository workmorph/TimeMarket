#!/bin/bash
# 文書整理完了スクリプト

echo "📁 残りのファイル整理を実行..."

# アーカイブディレクトリ作成
mkdir -p docs/archive
mkdir -p docs/tasks/archive

# 残りのタスクファイルを移動
mv PARALLEL_TASKS_EXTENDED.md docs/tasks/ 2>/dev/null
mv ULTRA_PARALLEL_TASKS.md docs/tasks/ 2>/dev/null
mv TEAM_MANAGEMENT_*.md docs/tasks/ 2>/dev/null
mv DAY1_IMMEDIATE_TASKS.md docs/tasks/archive/ 2>/dev/null

# Windsurf関連を整理
mv WINDSURF_*.md docs/operations/ 2>/dev/null

# プロジェクト管理ファイルを整理
mv PROJECT_DASHBOARD.md docs/ 2>/dev/null
mv DOCUMENT_ORGANIZATION_PLAN.md docs/archive/ 2>/dev/null

# 古いファイルをアーカイブ
mv ORGANIZE_NOW.md docs/archive/ 2>/dev/null
mv QUICK_STATUS.md docs/archive/ 2>/dev/null

echo "✅ 整理完了！"
echo ""
echo "📊 現在の構造:"
echo "- docs/ : 整理された文書"
echo "- .windsurf/ : Windsurf制御ファイル"  
echo "- src/ : ソースコード"
echo ""
echo "🎯 次のステップ:"
echo "1. cat docs/PROJECT_STATUS.md で全体確認"
echo "2. 各チームの作業開始"
echo "3. Windsurf作業状況確認: cat .windsurf/execution-log.md"
