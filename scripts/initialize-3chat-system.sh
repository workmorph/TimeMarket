#!/bin/bash
# 🎛️ 3チャット体制 初期化スクリプト

echo "🚀 TimeBid 3チャット体制 初期化開始"
echo "========================================"

# 1. 実行権限の付与
echo "📁 1/5: スクリプト実行権限の付与..."
chmod +x scripts/quality-check.sh
chmod +x scripts/check-file-assignments.sh
chmod +x scripts/complete-organization.sh
echo "✅ 実行権限付与完了"

# 2. ログディレクトリの準備
echo "📂 2/5: ログディレクトリの準備..."
mkdir -p docs/team-control/logs
touch docs/team-control/quality-check.log
echo "✅ ログディレクトリ準備完了"

# 3. 進捗ファイルの初期化
echo "📊 3/5: 進捗ファイルの初期化..."
echo "# Claude-Core 進捗記録" > docs/team-control/core-status.md
echo "# Claude-Content 進捗記録" > docs/team-control/content-status.md  
echo "# Claude-Ops 進捗記録" > docs/team-control/ops-status.md
echo "✅ 進捗ファイル初期化完了"

# 4. 初回品質チェック
echo "🔍 4/5: 初回品質チェック..."
if ./scripts/quality-check.sh > /dev/null 2>&1; then
    echo "✅ 初回品質チェック: 正常"
else
    echo "⚠️ 初回品質チェック: 要確認（継続可能）"
fi

# 5. 体制状況の更新
echo "📈 5/5: 体制状況の更新..."
CURRENT_TIME=$(date +"%H:%M")
sed -i '' "s/\[未開始\]/\[準備完了\]/g" docs/team-control/MASTER_CONTROL.md
sed -i '' "s/最終更新: .*/最終更新: 初期化完了 - $CURRENT_TIME/" docs/team-control/MASTER_CONTROL.md
echo "✅ 体制状況更新完了"

echo "========================================"
echo "🎯 3チャット体制 準備完了！"
echo ""
echo "📋 次のステップ:"
echo "1. docs/team-control/LAUNCH_INSTRUCTIONS.md を確認"
echo "2. 3つのClaudeチャットを準備"  
echo "3. 各Claudeに起動指示を送信"
echo "4. 30分ごとに進捗を監視"
echo ""
echo "🚀 成功をお祈りします！"