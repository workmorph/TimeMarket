#!/bin/bash
# 📂 ファイル分担チェッカー - 競合回避システム

echo "📂 ファイル分担チェック開始..."

# 各チームの分担ファイル定義
CORE_FILES=(
    "src/app/api/"
    "src/components/auction/"
    "src/components/ui/"
    "src/lib/"
    "src/hooks/"
    "src/types/"
    "supabase/"
)

CONTENT_FILES=(
    "src/app/terms/"
    "src/app/privacy/"
    "src/app/help/"
    "src/app/about/"
    "src/app/page.tsx"
    "src/app/layout.tsx"
    "public/"
)

OPS_FILES=(
    "src/__tests__/"
    "cypress/"
    "docs/"
    "scripts/"
    ".github/workflows/"
    "package.json"
    "jest.config.js"
    "playwright.config.ts"
    ".env.test"
)

# Git管理下の変更ファイルを取得
CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || echo "")
STAGED_FILES=$(git diff --staged --name-only 2>/dev/null || echo "")
ALL_CHANGED="$CHANGED_FILES $STAGED_FILES"

if [ -z "$ALL_CHANGED" ]; then
    echo "✅ 変更ファイルなし - チェック完了"
    exit 0
fi

echo "🔍 変更ファイルを分析中..."

# 変更ファイルをチーム別に分類
check_team_assignment() {
    local file=$1
    local team_found=""
    
    # Core担当ファイルチェック
    for core_path in "${CORE_FILES[@]}"; do
        if [[ $file == $core_path* ]]; then
            team_found="Core"
            break
        fi
    done
    
    # Content担当ファイルチェック
    if [ -z "$team_found" ]; then
        for content_path in "${CONTENT_FILES[@]}"; do
            if [[ $file == $content_path* ]]; then
                team_found="Content"
                break
            fi
        done
    fi
    
    # Ops担当ファイルチェック
    if [ -z "$team_found" ]; then
        for ops_path in "${OPS_FILES[@]}"; do
            if [[ $file == $ops_path* ]]; then
                team_found="Ops"
                break
            fi
        done
    fi
    
    echo "$team_found"
}

# 変更ファイルの分析
VIOLATIONS=0
echo ""
echo "📊 変更ファイル分析結果:"
echo "----------------------------------------"

for file in $ALL_CHANGED; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        assigned_team=$(check_team_assignment "$file")
        
        if [ -n "$assigned_team" ]; then
            echo "✅ $file → Claude-$assigned_team 担当"
        else
            echo "⚠️ $file → 担当未定義（要確認）"
            VIOLATIONS=$((VIOLATIONS + 1))
        fi
    fi
done

echo "----------------------------------------"

# 競合チェック
echo ""
echo "🔍 競合チェック..."

TEAMS_INVOLVED=()
for file in $ALL_CHANGED; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        team=$(check_team_assignment "$file")
        if [ -n "$team" ] && [[ ! " ${TEAMS_INVOLVED[@]} " =~ " ${team} " ]]; then
            TEAMS_INVOLVED+=("$team")
        fi
    fi
done

if [ ${#TEAMS_INVOLVED[@]} -gt 1 ]; then
    echo "⚠️ 複数チームが関与: ${TEAMS_INVOLVED[*]}"
    echo "   → 調整が必要な可能性があります"
    VIOLATIONS=$((VIOLATIONS + 1))
else
    echo "✅ 単一チームの変更: ${TEAMS_INVOLVED[*]}"
fi

echo ""
echo "📋 チーム分担表:"
echo "----------------------------------------"
echo "🔧 Claude-Core:"
for path in "${CORE_FILES[@]}"; do
    echo "   $path"
done

echo ""
echo "📄 Claude-Content:"
for path in "${CONTENT_FILES[@]}"; do
    echo "   $path"
done

echo ""
echo "🛠️ Claude-Ops:"
for path in "${OPS_FILES[@]}"; do
    echo "   $path"
done

echo ""
echo "========================================="

if [ $VIOLATIONS -eq 0 ]; then
    echo "✅ ファイル分担チェック: 正常"
    exit 0
else
    echo "⚠️ ファイル分担チェック: $VIOLATIONS 件の要確認事項"
    echo ""
    echo "🚨 対応が必要:"
    echo "1. 担当未定義ファイルの分担決定"
    echo "2. 複数チーム関与の場合は調整"
    echo "3. 必要に応じて docs/team-control/ESCALATION.md に報告"
    exit 1
fi