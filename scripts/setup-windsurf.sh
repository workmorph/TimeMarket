#!/bin/bash

# Windsurf初期セットアップスクリプト

echo "🚀 Windsurf自動実行環境をセットアップ中..."

# スクリプト実行権限設定
chmod +x scripts/integrate-ui-templates.sh

# 必要なディレクトリ作成
mkdir -p .windsurf/archives
mkdir -p .windsurf/reports
mkdir -p .github/ISSUE_TEMPLATE

# 初期ステータスファイル作成
touch .windsurf/escalation-required.md
touch .windsurf/approval-request.md

# check-status.shに実行権限付与
chmod +x check-status.sh

echo "✅ セットアップ完了！"
echo ""
echo "🎯 次のアクション:"
echo "1. Windsurfで .windsurf/README.md を開く"
echo "2. .windsurf/EXECUTE_NOW.md のタスクを実行開始"
echo "3. 2時間後に npm run check-status で進捗確認"
