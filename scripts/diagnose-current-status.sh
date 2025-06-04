#!/bin/bash
# 🔍 TimeBid現在状況診断スクリプト

echo "🔍 TimeBid プロジェクト現在状況診断"
echo "=========================================="

# 基本情報
echo "📅 診断実行時刻: $(date)"
echo "📁 現在のディレクトリ: $(pwd)"
echo ""

# 1. Git状況
echo "🌿 1. Git状況:"
echo "現在のブランチ: $(git branch --show-current)"
echo "最新コミット: $(git log --oneline -1)"
echo "変更ファイル数: $(git status --porcelain | wc -l)"
echo "ステージング状況:"
git status --short
echo ""

# 2. 依存関係状況
echo "📦 2. 依存関係状況:"
if [ -f "package.json" ]; then
    echo "✅ package.json: 存在"
else
    echo "❌ package.json: 不足"
fi

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json: 存在"
else
    echo "⚠️ package-lock.json: 不足"
fi

if [ -d "node_modules" ]; then
    echo "✅ node_modules: 存在"
    echo "   インストール済みパッケージ数: $(ls node_modules | wc -l)"
else
    echo "❌ node_modules: 不足 ← 重要な問題"
fi
echo ""

# 3. 重要ファイル存在確認
echo "🔍 3. 重要ファイル存在確認:"
declare -a important_files=(
    "src/lib/auth/session.ts"
    "src/app/api/checkout/route.ts"
    "src/app/api/webhooks/stripe/route.ts"
    "src/app/dashboard/api-keys/page.tsx"
    "src/app/terms/page.tsx"
    "src/components/ui/tooltip.tsx"
    "scripts/fix-husky-deps.sh"
    "scripts/fix-typescript-errors.sh"
    "scripts/fix-circular-reference.sh"
)

for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: 存在"
    else
        echo "❌ $file: 不足"
    fi
done
echo ""

# 4. 実行可能なチェック
echo "🧪 4. 実行可能なチェック:"

echo "TypeScriptチェック..."
if command -v npm &> /dev/null && [ -d "node_modules" ]; then
    echo "npm run type-check を実行中..."
    if npm run type-check > /dev/null 2>&1; then
        echo "✅ TypeScript: エラーなし"
    else
        error_count=$(npm run type-check 2>&1 | grep -c "error TS" || echo "0")
        echo "⚠️ TypeScript: ${error_count}個のエラー"
    fi
else
    echo "❌ TypeScript: チェック不可能（npm または node_modules 不足）"
fi

echo "ビルドチェック..."
if command -v npm &> /dev/null && [ -d "node_modules" ]; then
    if npm run build > /dev/null 2>&1; then
        echo "✅ ビルド: 成功"
    else
        echo "❌ ビルド: 失敗"
    fi
else
    echo "❌ ビルド: チェック不可能（npm または node_modules 不足）"
fi
echo ""

# 5. 修正スクリプト状況
echo "🔧 5. 修正スクリプト状況:"
for script in scripts/fix-*.sh; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "✅ $script: 存在・実行可能"
        else
            echo "⚠️ $script: 存在・実行権限なし"
        fi
    else
        echo "❌ $script: 不足"
    fi
done
echo ""

# 6. 問題診断と推奨アクション
echo "🎯 6. 問題診断と推奨アクション:"

if [ ! -d "node_modules" ]; then
    echo "🚨 最重要問題: node_modules が存在しません"
    echo "   原因: npm install が実行されていない"
    echo "   解決策: npm install を実行"
    echo ""
fi

if [ ! -f "package-lock.json" ]; then
    echo "⚠️ package-lock.json が存在しません"
    echo "   影響: 依存関係の固定化ができていない"
    echo "   解決策: npm install 実行時に自動生成"
    echo ""
fi

echo "📋 推奨実行順序:"
echo "1. npm install                    # 依存関係インストール"
echo "2. chmod +x scripts/fix-*.sh      # スクリプト実行権限付与"
echo "3. npm run type-check             # エラー状況確認"
echo "4. scripts/fix-typescript-errors.sh  # エラー修正"
echo "5. npm run build                  # ビルド確認"

echo ""
echo "=========================================="
echo "🏁 診断完了"