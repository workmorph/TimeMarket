#!/bin/bash
# 🔍 Git状況確認スクリプト

echo "📊 現在のGit状況を確認中..."
echo "=================================="

# 現在のブランチ
echo "🌿 現在のブランチ:"
git branch --show-current

# 最新のコミット
echo ""
echo "📝 最新のローカルコミット（5件）:"
git log --oneline -5

# ステージングエリアの状況
echo ""
echo "📂 ステージングエリア:"
git status --porcelain

# リモートとの差分（要fetch後）
echo ""
echo "🔄 リモートとの差分確認:"
echo "（まずgit fetch originを実行してください）"

# 未プッシュのコミット
echo ""
echo "⬆️ プッシュ待ちのコミット:"
git log origin/main..HEAD --oneline 2>/dev/null || echo "リモート情報を取得してください"

# プル待ちのコミット
echo ""
echo "⬇️ プル待ちのコミット:"
git log HEAD..origin/main --oneline 2>/dev/null || echo "リモート情報を取得してください"

echo ""
echo "=================================="
echo "✅ 状況確認完了"