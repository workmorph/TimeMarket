#!/bin/bash

# Claude/Windsurf クイック状況確認スクリプト

echo "🔍 TimeBid プロジェクト状況確認を開始..."
echo ""

# 1. 引き継ぎ文書確認
echo "📋 引き継ぎ文書:"
if [ -f "CLAUDE_HANDOVER.md" ]; then
    echo "✅ CLAUDE_HANDOVER.md 存在"
    echo "   最終更新: $(stat -f "%Sm" -t "%Y-%m-%d %H:%M" CLAUDE_HANDOVER.md 2>/dev/null || stat -c "%y" CLAUDE_HANDOVER.md 2>/dev/null | cut -d' ' -f1-2)"
else
    echo "❌ CLAUDE_HANDOVER.md が見つかりません"
fi

# 2. Windsurf状況
echo ""
echo "🤖 Windsurf実行状況:"
if [ -f ".windsurf/execution-log.md" ]; then
    echo "最新エントリ:"
    tail -n 10 .windsurf/execution-log.md | grep -E "(✅|⚠️|❌)" | tail -n 3
else
    echo "実行ログなし"
fi

# 3. エラー確認
echo ""
echo "⚠️ エラー/警告:"
if [ -f ".windsurf/escalation-required.md" ] && [ -s ".windsurf/escalation-required.md" ]; then
    echo "❌ エスカレーション必要な問題あり"
    head -n 5 .windsurf/escalation-required.md
else
    echo "✅ エラーなし"
fi

# 4. ビルド状態
echo ""
echo "🔨 ビルド状態確認:"
if npm run build > /dev/null 2>&1; then
    echo "✅ ビルド成功"
else
    echo "❌ ビルドエラー - 詳細確認が必要"
fi

# 5. 推奨アクション
echo ""
echo "📌 推奨される次のアクション:"
echo "1. cat CLAUDE_HANDOVER.md  # 詳細な引き継ぎ確認"
echo "2. cat .windsurf/CHECKLIST.md  # 実行前チェックリスト"
echo "3. cat .windsurf/EXECUTE_NOW.md  # 実行待ちタスク確認"
echo ""
echo "✨ 確認完了！"
