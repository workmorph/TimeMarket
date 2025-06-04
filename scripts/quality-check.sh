#!/bin/bash
# 実行権限付与: chmod +x scripts/quality-check.sh
# 🔍 3チーム体制 統合品質チェッカー

echo "🚀 TimeBid 3チーム体制 品質チェック開始"
echo "実行時刻: $(date)"
echo "=================================="

# 実行ログ
LOG_FILE="docs/team-control/quality-check.log"
echo "[$(date)] 品質チェック開始" >> $LOG_FILE

# 1. TypeScript型チェック
echo "📝 1/6: TypeScript型チェック..."
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript: 成功"
    echo "[$(date)] TypeScript: 成功" >> $LOG_FILE
else
    echo "❌ TypeScript: エラーあり"
    echo "[$(date)] TypeScript: エラーあり" >> $LOG_FILE
    echo "🚨 Claude-Core: TypeScriptエラーを修正してください"
fi

# 2. ビルドチェック
echo "🏗️ 2/6: ビルドチェック..."
if npm run build > /dev/null 2>&1; then
    echo "✅ ビルド: 成功"
    echo "[$(date)] ビルド: 成功" >> $LOG_FILE
else
    echo "❌ ビルド: 失敗"
    echo "[$(date)] ビルド: 失敗" >> $LOG_FILE
    echo "🚨 緊急: ビルドエラーです。作業を停止して修正してください"
fi

# 3. リントチェック
echo "✨ 3/6: コード品質チェック..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ リント: 成功"
    echo "[$(date)] リント: 成功" >> $LOG_FILE
else
    echo "⚠️ リント: 警告あり"
    echo "[$(date)] リント: 警告あり" >> $LOG_FILE
fi

# 4. ファイル分担チェック
echo "📂 4/6: ファイル分担チェック..."
./scripts/check-file-assignments.sh
if [ $? -eq 0 ]; then
    echo "✅ ファイル分担: 正常"
    echo "[$(date)] ファイル分担: 正常" >> $LOG_FILE
else
    echo "⚠️ ファイル分担: 要確認"
    echo "[$(date)] ファイル分担: 要確認" >> $LOG_FILE
fi

# 5. 進捗同期チェック
echo "🔄 5/6: 進捗同期チェック..."
LAST_CORE_UPDATE=$(stat -f "%Sm" -t "%H:%M" docs/team-control/core-status.md 2>/dev/null || echo "未作成")
LAST_CONTENT_UPDATE=$(stat -f "%Sm" -t "%H:%M" docs/team-control/content-status.md 2>/dev/null || echo "未作成")
LAST_OPS_UPDATE=$(stat -f "%Sm" -t "%H:%M" docs/team-control/ops-status.md 2>/dev/null || echo "未作成")

echo "  Core最終更新: $LAST_CORE_UPDATE"
echo "  Content最終更新: $LAST_CONTENT_UPDATE"
echo "  Ops最終更新: $LAST_OPS_UPDATE"

# 6. エスカレーション確認
echo "🚨 6/6: エスカレーション確認..."
ESCALATION_COUNT=$(grep -c "## 🚨.*エスカレーション" docs/team-control/ESCALATION.md 2>/dev/null || echo "0")
if [ "$ESCALATION_COUNT" -gt 0 ]; then
    echo "⚠️ アクティブなエスカレーション: ${ESCALATION_COUNT}件"
    echo "[$(date)] エスカレーション: ${ESCALATION_COUNT}件" >> $LOG_FILE
else
    echo "✅ エスカレーション: なし"
    echo "[$(date)] エスカレーション: なし" >> $LOG_FILE
fi

echo "=================================="
echo "🎯 品質チェック完了: $(date)"

# 結果をマスター制御に更新
CURRENT_TIME=$(date +"%H:%M")
sed -i '' "s/最終更新: .*/最終更新: $CURRENT_TIME/" docs/team-control/MASTER_CONTROL.md

echo "📊 詳細は docs/team-control/ を確認してください"