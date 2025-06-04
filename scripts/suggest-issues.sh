#!/bin/bash

# TimeBid Issue作成アシスタント
# このスクリプトはプロジェクト状況を分析してClaude AIがIssue作成を支援します

echo "🎯 TimeBid Issue作成アシスタント"
echo "================================="

# プロジェクト状況確認
echo -e "\n📊 現在のプロジェクト状況:"

# 1. 未実装機能の確認
echo -e "\n🔍 未実装機能チェック:"

# Google Calendar統合
if [ ! -f "src/lib/google-calendar.ts" ]; then
    echo "❌ Google Calendar統合 (高優先度)"
fi

# リアルタイム通知
if [ ! -f "src/components/auction/BidNotification.tsx" ]; then
    echo "❌ リアルタイム入札通知 (高優先度)"
fi

# A/Bテスト価格表示
if [ ! -f "src/components/auction/PriceDisplayVariants.tsx" ]; then
    echo "❌ A/Bテスト価格表示 (中優先度)"
fi

# ウィジェット多サイト対応
if [ ! -f "src/widget/multi-tenant-config.ts" ]; then
    echo "❌ ウィジェット多サイト対応 (中優先度)"
fi

# 2. 現在のエラーチェック
echo -e "\n🔍 TypeScriptエラーチェック:"
if npm run type-check 2>/dev/null | grep -q "error"; then
    echo "❌ TypeScriptエラーあり - 修正が必要"
else
    echo "✅ TypeScriptエラーなし"
fi

# 3. ビルド状況
echo -e "\n🔍 ビルド状況:"
if npm run build >/dev/null 2>&1; then
    echo "✅ ビルド成功"
else
    echo "❌ ビルドエラーあり - 修正が必要"
fi

# 4. 推奨アクション
echo -e "\n💡 推奨Issue作成順序:"
echo "1. Google Calendar統合 (docs/claude-issue-templates.md Template 1)"
echo "2. リアルタイム入札通知 (docs/claude-issue-templates.md Template 2)"  
echo "3. A/Bテスト価格表示 (docs/claude-issue-templates.md Template 3)"

echo -e "\n📚 テンプレート参照:"
echo "cat docs/claude-issue-templates.md"

echo -e "\n🚀 次のアクション:"
echo "1. GitHub Issues → New Issue"
echo "2. 上記テンプレートをコピー&ペースト"
echo "3. プロジェクト固有の情報を追記"
echo "4. Claude Codeが自動実装"

echo -e "\n✨ 完了!"
