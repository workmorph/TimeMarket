#!/bin/bash

# TimeBid 安全統合 - Phase 2
echo "🔧 TimeBid 安全統合 Phase 2"
echo "=============================="

cd /Users/kentanonaka/workmorph/time-bid

# Step 1: 現在の変更内容確認
echo -e "\n📋 Step 1: 変更内容の詳細確認"
echo "変更されたファイル:"
git diff --name-only
echo -e "\n新規ファイル:"
git ls-files --others --exclude-standard

# Step 2: 変更内容の説明
echo -e "\n📝 Step 2: 変更内容"
echo "1. package.json - husky版本更新 (9.0.11)"
echo "2. 新規ファイル:"
echo "   - .github/ISSUE_TEMPLATE/feature.md - GitHub Issue テンプレート"
echo "   - docs/claude-issue-templates.md - Claude用テンプレート集"
echo "   - docs/claude-workflow.md - Claudeワークフローガイド"
echo "   - scripts/suggest-issues.sh - Issue提案スクリプト"
echo "   - merge-branches.sh - 統合スクリプト"

# Step 3: ユーザー確認
echo -e "\n❓ これらの変更をコミットしますか? (y/N)"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "❌ 処理を中止しました"
    exit 1
fi

# Step 4: 変更をコミット
echo -e "\n💾 Step 4: 変更をコミット"
git add .
git commit -m "feat: プロジェクト管理システム改善

- Claude用Issueテンプレートシステム追加
- GitHub Issue テンプレート作成
- プロジェクト状況分析スクリプト追加
- Claude AI ワークフローガイド作成
- husky版本を9.1.8に統一

Changes:
- .github/ISSUE_TEMPLATE/feature.md
- docs/claude-issue-templates.md  
- docs/claude-workflow.md
- scripts/suggest-issues.sh
- package.json (husky version sync)"

if [ $? -eq 0 ]; then
    echo "✅ コミット成功"
else
    echo "❌ コミット失敗"
    exit 1
fi

# Step 5: 統合の再実行
echo -e "\n🔀 Step 5: 統合を再実行しますか? (y/N)"
read -r merge_response
if [[ "$merge_response" =~ ^[Yy]$ ]]; then
    echo "統合を開始..."
    ./merge-branches.sh
else
    echo "手動で統合を実行してください:"
    echo "  ./merge-branches.sh"
fi

echo -e "\n✨ Phase 2 完了!"
