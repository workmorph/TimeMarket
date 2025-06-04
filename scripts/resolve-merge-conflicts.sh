#!/bin/bash
# 🔧 マージコンフリクト解決ガイド

echo "🔍 マージコンフリクトの詳細分析..."
echo "=================================="

echo "📊 コンフリクト発生ファイル:"
git status --porcelain | grep "^UU\|^AA\|^DD" || echo "コンフリクト情報を確認中..."

echo ""
echo "🔍 Stripe Webhook コンフリクト詳細:"
echo "ファイル: src/app/api/webhooks/stripe/route.ts"
echo "- Claude Code版: 高度なエラーハンドリング・ログ機能"
echo "- ローカル版: 基本実装"
echo "👉 推奨: Claude Code版を採用（--theirs）"

echo ""
echo "🔍 ヘルプページ コンフリクト詳細:"
echo "ファイル: src/app/help/page.tsx"  
echo "- Claude Code版: 完全なFAQ・トラブルシューティング"
echo "- ローカル版: 基本実装"
echo "👉 推奨: Claude Code版を採用（--theirs）"

echo ""
echo "🎯 推奨解決コマンド:"
echo "git checkout --theirs src/app/api/webhooks/stripe/route.ts"
echo "git checkout --theirs src/app/help/page.tsx"
echo "git add ."
echo "git rebase --continue"

echo ""
echo "💎 ローカル独自価値は別途マージ:"
echo "- docs/team-control/ : 3チャット体制"
echo "- scripts/ : 自動化スクリプト"
echo "- .github/workflows/auto-create-issues.yml"

echo ""
echo "=================================="