#!/bin/bash

# TimeBid プロジェクト整理スクリプト
# 実行前に内容を確認してください

echo "🧹 TimeBid プロジェクト整理を開始します..."

# 1. バックアップ作成
echo "📦 バックアップ作成中..."
mkdir -p .backup/$(date +%Y%m%d_%H%M%S)
cp *.md .backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# 2. Claudeディレクトリ作成
echo "📁 ディレクトリ構造作成中..."
mkdir -p .claude/history
mkdir -p docs/{architecture,api,guides,decisions}
mkdir -p .windsurf/archives/{completed,old_docs}

# 3. ファイル移動
echo "📋 ドキュメント整理中..."

# Claude関連
mv CLAUDE_HANDOVER.md .claude/02_HANDOVER.md 2>/dev/null || true
mv CLAUDE_SESSION_HISTORY.md .claude/history/ 2>/dev/null || true
mv CLAUDE_SESSION_LOG.md .claude/history/ 2>/dev/null || true

# タスク関連をdocsへ
mv *TASK*.md docs/decisions/ 2>/dev/null || true
mv SPRINT_*.md docs/decisions/ 2>/dev/null || true
mv TEAM_*.md docs/decisions/ 2>/dev/null || true

# Windsurf指示書をアーカイブ
mv WINDSURF_*.md .windsurf/archives/old_docs/ 2>/dev/null || true

# その他の整理
mv DAY1_*.md .windsurf/archives/old_docs/ 2>/dev/null || true
mv ORGANIZE_*.md docs/decisions/ 2>/dev/null || true
mv PROJECT_DASHBOARD.md docs/architecture/ 2>/dev/null || true
mv add_order.md docs/architecture/ 2>/dev/null || true
mv change_log.md docs/architecture/ 2>/dev/null || true

# 4. ルール同期
echo "🔄 ルール同期中..."
if [ -f .windsurf/rules.md ]; then
    cp .windsurf/rules.md .claude/03_RULES.md
    echo "✅ ルールを同期しました"
fi

# 5. 整理状況確認
echo ""
echo "📊 整理結果:"
echo "- .claude/ ディレクトリ:"
ls -la .claude/
echo ""
echo "- ルートディレクトリ（残りのmdファイル）:"
ls -1 *.md 2>/dev/null | wc -l
echo ""
echo "✅ 整理完了！"
echo ""
echo "次のステップ:"
echo "1. cat > .claude/00_README.md  # マスター文書作成"
echo "2. cat > .claude/01_PROJECT_STATUS.md  # 現状まとめ作成"
echo "3. .claude/02_HANDOVER.md を確認・更新"
