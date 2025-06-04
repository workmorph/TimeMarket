# 🎯 TimeBid 5人体制タスク管理システム

## 📊 タスク管理ダッシュボード

### 🚀 即時実行用コマンドセット

```bash
# 1. 管理用ディレクトリ作成
mkdir -p .windsurf/team/{person1,person2,person3,person4,person5}
mkdir -p .windsurf/team/status

# 2. 各人用タスクファイル生成
cat > .windsurf/team/TEAM_ASSIGNMENTS.md << 'EOF'
# チーム割り当て表 - 2025-06-03

## Person 1 (メイン開発者)
- 担当: コア機能実装
- ファイル: SPRINT_80_PERCENT.md
- 進捗ログ: .windsurf/team/person1/progress.md
- ステータス: 🔄 実行中

## Person 2 (ドキュメント・データ)
- 担当: Track A (静的ページ) + Track F (データ準備)
- ファイル: PARALLEL_TASKS.md
- 進捗ログ: .windsurf/team/person2/progress.md
- ステータス: ⏳ 待機中

## Person 3 (品質・テスト)
- 担当: Track D (テスト) + Track G (開発ツール)
- ファイル: PARALLEL_TASKS.md + PARALLEL_TASKS_EXTENDED.md
- 進捗ログ: .windsurf/team/person3/progress.md
- ステータス: ⏳ 待機中

## Person 4 (UI/UX・SEO)
- 担当: Track K (SEO) + Track Q (ダークモード)
- ファイル: PARALLEL_TASKS_EXTENDED.md + ULTRA_PARALLEL_TASKS.md
- 進捗ログ: .windsurf/team/person4/progress.md
- ステータス: ⏳ 待機中

## Person 5 (ユーザー機能)
- 担当: Track M (プロフィール) + Track P (レビュー)
- ファイル: ULTRA_PARALLEL_TASKS.md
- 進捗ログ: .windsurf/team/person5/progress.md
- ステータス: ⏳ 待機中
EOF
```

---

## 🎯 各メンバーへの明確な指示テンプレート

### Person 1への指示
```
あなたはPerson 1です。以下を実行してください：

1. SPRINT_80_PERCENT.md を開く
2. Phase 1から順番に実装
3. 30分ごとに以下を実行：
   echo "[$(date '+%H:%M')] Phase X: [進捗内容]" >> .windsurf/team/person1/progress.md
4. ブロッカーがあれば：
   echo "🚨 BLOCKED: [問題内容]" >> .windsurf/team/status/blockers.md
5. 完了したら：
   echo "✅ Phase X 完了" >> .windsurf/team/person1/progress.md
```

### Person 2への指示
```
あなたはPerson 2です。以下を実行してください：

1. PARALLEL_TASKS.md の Track A を実装
   - 利用規約ページ (src/app/terms/page.tsx)
   - プライバシーポリシー (src/app/privacy/page.tsx)
   - ヘルプページ (src/app/help/page.tsx)
   - About (src/app/about/page.tsx)

2. 完了後、PARALLEL_TASKS_EXTENDED.md の Track F を実装
   - シードデータ作成 (scripts/seed-data.ts)
   - カテゴリ定義 (src/data/categories.json)

3. 進捗記録：
   echo "[$(date '+%H:%M')] [ファイル名] 完了" >> .windsurf/team/person2/progress.md
```

### Person 3への指示
```
あなたはPerson 3です。以下を実行してください：

1. PARALLEL_TASKS.md の Track D (テスト) を実装
2. テスト環境のセットアップ
3. 基本的なユニットテスト作成
4. PARALLEL_TASKS_EXTENDED.md の Track G (開発ツール) を実装
5. 進捗を .windsurf/team/person3/progress.md に記録
```

### Person 4への指示
```
あなたはPerson 4です。以下を実行してください：

1. PARALLEL_TASKS_EXTENDED.md の Track K (SEO) を実装
2. サイトマップ、robots.txt、メタデータ最適化
3. ULTRA_PARALLEL_TASKS.md の Track Q (ダークモード) を実装
4. 進捗を .windsurf/team/person4/progress.md に記録
```

### Person 5への指示
```
あなたはPerson 5です。以下を実行してください：

1. ULTRA_PARALLEL_TASKS.md の Track M (プロフィール機能) を実装
2. Track P (レビューシステム) を実装
3. UIコンポーネントを作成
4. 進捗を .windsurf/team/person5/progress.md に記録
```

---

## 📊 リアルタイム進捗管理スクリプト

### status-monitor.sh
```bash
#!/bin/bash
# 全員の進捗をリアルタイム監視

cat > .windsurf/team/status-monitor.sh << 'SCRIPT'
#!/bin/bash

while true; do
    clear
    echo "🎯 TimeBid チーム進捗ダッシュボード - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=================================================="
    
    # 各メンバーの最新状態を表示
    for i in {1..5}; do
        echo ""
        echo "👤 Person $i:"
        if [ -f ".windsurf/team/person$i/progress.md" ]; then
            tail -3 ".windsurf/team/person$i/progress.md" | sed 's/^/  /'
        else
            echo "  ⏳ 未開始"
        fi
    done
    
    # ブロッカー表示
    echo ""
    echo "🚨 ブロッカー:"
    if [ -f ".windsurf/team/status/blockers.md" ]; then
        tail -5 ".windsurf/team/status/blockers.md" | sed 's/^/  /'
    else
        echo "  ✅ なし"
    fi
    
    # 全体進捗計算
    echo ""
    echo "📊 全体進捗:"
    completed=$(grep -c "✅" .windsurf/team/*/progress.md 2>/dev/null || echo 0)
    echo "  完了タスク: $completed"
    
    sleep 30
done
SCRIPT

chmod +x .windsurf/team/status-monitor.sh
```

---

## 🔄 コンフリクト回避ルール

### 1. ディレクトリ分離
```
Person 1: src/app/, src/hooks/, src/lib/
Person 2: src/app/terms/, src/app/privacy/, scripts/
Person 3: src/__tests__/, cypress/, .github/
Person 4: src/app/sitemap.ts, public/, src/lib/seo/
Person 5: src/app/profile/, src/app/reviews/, src/components/user/
```

### 2. ブランチ戦略
```bash
# 各自別ブランチで作業
Person 1: feature/core-sprint
Person 2: feature/docs-data
Person 3: feature/tests-tools
Person 4: feature/seo-darkmode
Person 5: feature/user-features

# 定期的にmainから更新
git checkout main && git pull
git checkout feature/xxx && git merge main
```

### 3. コミュニケーションルール
```markdown
## Slackチャンネル構成（例）
#timebid-general    - 全体連絡
#timebid-blockers   - ブロッカー報告
#timebid-progress   - 進捗自動通知
#timebid-merge      - マージ調整
```

---

## 🎮 管理者用コントロールパネル

### control.sh
```bash
#!/bin/bash

cat > .windsurf/team/control.sh << 'CONTROL'
#!/bin/bash

echo "TimeBid Team Control Panel"
echo "========================="
echo "1. 全員の進捗確認"
echo "2. ブロッカー一覧"
echo "3. タスク再割り当て"
echo "4. 緊急停止"
echo "5. 進捗レポート生成"

read -p "選択してください: " choice

case $choice in
    1)
        for i in {1..5}; do
            echo "Person $i:"
            tail -5 .windsurf/team/person$i/progress.md 2>/dev/null || echo "No progress"
            echo "---"
        done
        ;;
    2)
        cat .windsurf/team/status/blockers.md 2>/dev/null || echo "No blockers"
        ;;
    3)
        echo "タスク再割り当て機能（実装予定）"
        ;;
    4)
        echo "🛑 全員に停止指示を送信..."
        echo "STOP IMMEDIATELY" > .windsurf/team/status/STOP
        ;;
    5)
        echo "📊 進捗レポート生成中..."
        # レポート生成ロジック
        ;;
esac
CONTROL

chmod +x .windsurf/team/control.sh
```

---

## 🚀 開始手順

### 1. 初期セットアップ（1回だけ）
```bash
# ディレクトリとファイル作成
bash -c "$(cat << 'EOF'
mkdir -p .windsurf/team/{person1,person2,person3,person4,person5}/
mkdir -p .windsurf/team/status/
touch .windsurf/team/status/blockers.md
EOF
)"
```

### 2. 各メンバーに指示を配布
```bash
# 各自のタスクファイルを生成
for i in {1..5}; do
    cp [対応する指示] .windsurf/team/person$i/TASK.md
done
```

### 3. 監視開始
```bash
# 別ターミナルで実行
./.windsurf/team/status-monitor.sh
```

### 4. 定期確認（30分ごと）
```bash
./.windsurf/team/control.sh
```

---

## 💡 成功のポイント

1. **明確な役割分担** - 重複なし
2. **リアルタイム可視化** - 常に状況把握
3. **自動化** - 手動管理を最小化
4. **ブロッカー即座対応** - 停滞防止

これで5人体制を効率的に管理できます！
