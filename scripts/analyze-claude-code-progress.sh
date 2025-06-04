#!/bin/bash
# 🔍 Claude Code作業成果確認スクリプト

echo "🎉 Claude Code作業成果の確認中..."
echo "=================================="

# 1. リモートブランチ一覧
echo "📋 Claude Codeで解決されたIssue:"
git branch -r | grep "claude/issue-" | sort

echo ""
echo "📊 mainブランチの最新コミット（10件）:"
git log origin/main --oneline -10

echo ""
echo "🔍 最近マージされたPR内容（推測）:"
git log origin/main --oneline --grep="Merge pull request" -5

echo ""
echo "📂 リモートmainに追加されたファイル（推測）:"
echo "（mainをチェックアウト後に確認可能）"

echo ""
echo "💎 ローカル独自の価値あるファイル:"
echo "docs/team-control/ - 3チャット体制"
echo "scripts/quality-check.sh - 品質自動チェック"
echo "scripts/initialize-3chat-system.sh - 体制初期化"
echo ".github/workflows/auto-create-issues.yml - Issue自動作成"

echo ""
echo "🎯 推奨戦略:"
echo "1. まずmainを安全に確認"
echo "2. ローカル独自価値を保護"
echo "3. 統合戦略を決定"

echo ""
echo "=================================="