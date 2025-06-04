#!/bin/bash
# 📊 Git取り込み後の確認スクリプト

echo "🔍 Git取り込み後の状況確認..."
echo "=================================="

# 現在のブランチとコミット
echo "🌿 現在のブランチ:"
git branch --show-current

echo ""
echo "📝 最新のコミット:"
git log --oneline -3

# リモートとの同期状況
echo ""
echo "🔄 リモートとの同期状況:"
if git diff --quiet HEAD origin/$(git branch --show-current) 2>/dev/null; then
    echo "✅ リモートと同期済み"
else
    echo "⚠️ リモートとの差分あり"
fi

# ファイル変更状況
echo ""
echo "📂 ワーキングディレクトリの状況:"
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ 変更なし（クリーン）"
else
    echo "⚠️ 変更ファイルあり:"
    git status --porcelain
fi

# プロジェクトの健全性チェック
echo ""
echo "🔧 プロジェクト健全性チェック:"
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不足"
fi

if [ -d "node_modules" ]; then
    echo "✅ node_modules 存在"
else
    echo "⚠️ node_modules 不足（npm installが必要）"
fi

if [ -f ".env.local" ]; then
    echo "✅ .env.local 存在"
else
    echo "⚠️ .env.local 不足"
fi

echo ""
echo "🎯 次に実行すべきコマンド:"
echo "1. npm install（依存関係更新）"
echo "2. npm run type-check（TypeScript確認）"
echo "3. npm run build（ビルド確認）"

echo ""
echo "=================================="
echo "✅ 確認完了"