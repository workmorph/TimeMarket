#!/bin/bash
# 🔄 GitHub変更取り込み & 現状確認スクリプト

echo "🔍 現在のプロジェクト状況確認開始"
echo "========================================"

# 1. Git状況確認
echo "📊 1. Git状況確認..."
echo "現在のブランチ:"
git branch --show-current 2>/dev/null || echo "Git情報取得エラー"

echo ""
echo "リモート情報:"
git remote -v 2>/dev/null || echo "リモート情報なし"

echo ""
echo "未コミットの変更:"
git status --porcelain 2>/dev/null || echo "Git status取得エラー"

# 2. リモートとの差分確認
echo ""
echo "📡 2. リモート最新情報取得..."
git fetch origin 2>/dev/null && echo "✅ Fetch完了" || echo "❌ Fetch失敗"

echo ""
echo "リモートとの差分:"
git log HEAD..origin/main --oneline 2>/dev/null || echo "差分確認不可"

# 3. 重要ファイルの存在確認
echo ""
echo "📁 3. 重要ファイル確認..."
echo "src/lib/auth/session.ts: $([ -f "src/lib/auth/session.ts" ] && echo "✅ 存在" || echo "❌ 不存在")"
echo "src/components/ui/tooltip.tsx: $([ -f "src/components/ui/tooltip.tsx" ] && echo "✅ 存在" || echo "❌ 不存在")"
echo "src/hooks/use-realtime-auction.ts: $([ -f "src/hooks/use-realtime-auction.ts" ] && echo "✅ 存在" || echo "❌ 不存在")"

# 4. TypeScriptエラー確認
echo ""
echo "🔧 4. TypeScriptエラー確認..."
if command -v npm &> /dev/null; then
    echo "TypeScript型チェック実行中..."
    npm run type-check 2>&1 | head -20
else
    echo "npm コマンドが利用できません"
fi

# 5. ビルド状況確認
echo ""
echo "🏗️ 5. ビルド状況確認..."
if command -v npm &> /dev/null; then
    echo "ビルドテスト実行中..."
    npm run build 2>&1 | tail -10
else
    echo "npm コマンドが利用できません"
fi

echo ""
echo "📋 6. 散らばったファイル確認..."
echo "ルートディレクトリの整理状況:"
ls -la | grep -E "\\.md$" | head -10

echo ""
echo "🎯 確認完了: $(date)"
echo "========================================"