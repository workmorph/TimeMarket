#!/bin/bash

# TimeBid Git統合スクリプト
echo "🚀 TimeBid Git統合を開始します..."

# 作業ディレクトリ確認
cd /Users/kentanonaka/workmorph/time-bid
echo "📂 作業ディレクトリ: $(pwd)"

# Step 1: 安全バックアップ
echo -e "\n📦 Step 1: 安全バックアップ作成"
BACKUP_TAG="backup-before-merge-$(date +%Y%m%d-%H%M%S)"
git tag $BACKUP_TAG
echo "✅ バックアップタグ作成: $BACKUP_TAG"

# Step 2: 変更状況確認
echo -e "\n🔍 Step 2: 現在の変更状況確認"
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️ 未コミットの変更があります:"
    git status --short
    echo "続行しますか? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ 統合を中止しました"
        exit 1
    fi
else
    echo "✅ 変更なし - 統合準備完了"
fi

# Step 3: mainブランチに切り替え
echo -e "\n🔄 Step 3: mainブランチに切り替え"
git checkout main
if [ $? -eq 0 ]; then
    echo "✅ mainブランチに切り替え完了"
else
    echo "❌ ブランチ切り替えに失敗"
    exit 1
fi

# Step 4: feature/claude-management-systemをマージ
echo -e "\n🔀 Step 4: feature/claude-management-systemをマージ"
git merge feature/claude-management-system --no-ff -m "Merge feature/claude-management-system with Claude Code improvements

- Claude Code自動化改善
- Windsurf制御システム
- UI コンポーネント統合
- GitHub Actions修正"

if [ $? -eq 0 ]; then
    echo "✅ マージ成功"
else
    echo "❌ マージでコンフリクト発生 - 手動解決が必要"
    echo "🔧 コンフリクト解決後、以下を実行:"
    echo "   git add ."
    echo "   git commit"
    echo "   ./merge-branches.sh continue"
    exit 1
fi

# Step 5: ビルドテスト
echo -e "\n🏗️ Step 5: ビルドテスト"
if npm run build; then
    echo "✅ ビルド成功"
else
    echo "⚠️ ビルドエラーあり - 確認が必要"
fi

# Step 6: ワークツリークリーンアップ
echo -e "\n🧹 Step 6: ワークツリークリーンアップ"
if [ -d "../time-bid-main" ]; then
    git worktree remove ../time-bid-main
    echo "✅ time-bid-mainワークツリーを削除"
else
    echo "ℹ️ time-bid-mainワークツリーは既に存在しません"
fi

# 完了報告
echo -e "\n🎉 統合完了!"
echo "📋 統合結果:"
echo "   現在のブランチ: $(git branch --show-current)"
echo "   最新コミット: $(git log --oneline -1)"
echo -e "\n📝 次のアクション:"
echo "1. cd /Users/kentanonaka/workmorph/time-bid"
echo "2. npm run dev で開発サーバー起動"
echo "3. 新機能開発開始 🚀"
echo -e "\n💡 今後は time-bid/ ディレクトリでのみ開発してください"
