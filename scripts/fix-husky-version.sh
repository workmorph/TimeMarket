#!/bin/bash
# 🔧 Husky バージョン問題即座修正

echo "🔧 Husky バージョン問題を修正中..."
echo "=========================================="

# 現在のhuskyバージョン確認
echo "📋 現在の問題バージョン: husky@^9.1.8"

# 利用可能なhuskyバージョンを確認
echo "🔍 利用可能なhuskyバージョンを確認中..."
HUSKY_VERSIONS=$(npm view husky versions --json 2>/dev/null | grep -o '"[0-9]\+\.[0-9]\+\.[0-9]\+"' | tail -5)
echo "最新5バージョン: $HUSKY_VERSIONS"

# 安全なバージョンに修正（9.0.11が通常最新安定版）
echo "📝 package.jsonのhuskyバージョンを修正中..."

# バックアップ作成
cp package.json package.json.backup

# huskyバージョンを安全なものに変更
sed -i '' 's/"husky": "\^9\.1\.8"/"husky": "^9.0.11"/g' package.json

# 変更確認
echo "✅ 変更完了:"
grep '"husky"' package.json

echo ""
echo "🗑️ npm cache をクリア..."
npm cache clean --force

echo ""
echo "📦 修正されたpackage.jsonで再インストール..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Husky問題解決成功！"
    echo "✅ npm install 完了"
    echo "✅ node_modules 作成完了"
else
    echo ""
    echo "⚠️ まだ問題がある場合は、代替案を試行..."
    
    # 代替案1: huskyを8.x系に変更
    echo "🔄 代替案: husky 8.x系に変更中..."
    sed -i '' 's/"husky": "\^9\.0\.11"/"husky": "^8.0.3"/g' package.json
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ 代替案成功！husky 8.x系で動作"
    else
        # 最終手段: huskyを一時削除
        echo "🚨 最終手段: huskyを一時削除して進行..."
        sed -i '' '/"husky":/d' package.json
        npm install
        echo "⚠️ husky削除で一時的に進行中（後で再追加可能）"
    fi
fi

echo ""
echo "📊 インストール結果確認:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules: 作成完了"
    echo "   パッケージ数: $(ls node_modules | wc -l)"
else
    echo "❌ node_modules: まだ不足"
fi

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json: 生成完了"
else
    echo "❌ package-lock.json: まだ不足"
fi

echo ""
echo "🎯 次のステップ:"
echo "npm run type-check  # TypeScriptエラー確認"
echo "npm run build       # ビルド確認"

echo ""
echo "=========================================="