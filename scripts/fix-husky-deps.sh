#!/bin/bash
# 🔧 Husky依存関係問題の修正

echo "🔧 Husky依存関係問題を修正中..."

# package-lock.jsonを削除して再インストール
echo "📦 package-lock.jsonを削除して依存関係をクリーン..."
rm -f package-lock.json

# Node modulesもクリーン
echo "🗑️ node_modulesをクリーン..."
rm -rf node_modules

# 依存関係を再インストール
echo "⬇️ 依存関係を再インストール..."
npm install

echo "✅ Husky問題解決完了！"