# 🤖 Windsurf 実行指示書

## 実行日時: 2025-06-03 11:15 JST

### 📋 開始前の必須確認
```bash
# まず以下のファイルを順番に確認してください
1. cat .windsurf/CHECKLIST.md          # 実行前チェックリスト
2. cat .windsurf/rules.md               # 絶対遵守ルール
3. cat .windsurf/EXECUTE_NOW.md        # 実行タスクリスト
```

---

## 🎯 本日の実行指示

### タスク1: AuctionListCard.tsx 作成
```
ファイル: src/components/auction/AuctionListCard.tsx
アクション: 新規作成

実装内容:
1. 既存の src/components/ui/card.tsx を import して使用
2. 以下のpropsを受け取る:
   - id, title, currentBid, startingPrice, endTime, bidCount, expertName, status
3. レスポンシブデザイン（モバイルファースト）
4. 残り時間のカウントダウン表示
5. 日本語表示（¥記号、「入札する」ボタン等）

成功基準:
- TypeScriptエラー 0
- npm run build 成功
- モバイル/デスクトップ両対応
```

### タスク2: ダッシュボードページ作成
```
ファイル: src/app/dashboard/page.tsx
アクション: 新規作成

実装内容:
1. 統計カード4つ（総売上、アクティブオークション、入札数、ユーザー数）
2. 既存UIコンポーネント活用（card.tsx, badge.tsx）
3. lucide-reactアイコン使用
4. モックデータで表示（後でAPI接続）

注意:
- src/app/dashboard/api-keys/ は既に存在するので影響しないように
```

### タスク3: 実行ログ記録
```
各タスク完了後、必ず以下を実行:

1. execution-log.md の先頭に追記（上が最新）:
   ### [2025-06-03 HH:MM] タスク: [タスク名]
   - ステータス: ✅完了
   - 作成ファイル: [パス]
   - ビルド結果: 成功
   
2. エラーが発生した場合:
   - escalation-required.md に詳細記録
   - 実行を停止
```

---

## ⚠️ 重要な制約

### 絶対にやってはいけないこと
- Supabaseスキーマの変更
- .env.local の編集
- 既存APIの破壊的変更
- node_modules の直接編集

### エラー時の対処
1. TypeScriptエラー → 型定義を確認
2. importエラー → パスとファイル存在確認
3. ビルドエラー → package.jsonの依存関係確認

---

## 📊 進捗報告

### 2時間後の報告内容
1. 完了タスク数
2. 作成/変更ファイル一覧
3. 発生した問題と解決方法
4. 次のタスクの準備状況

### 報告先ファイル
- .windsurf/status-dashboard.md を更新
- 統計情報を記録

---

## 💡 実行のコツ

1. **小さく始める**
   - 1ファイルずつ確実に
   - 都度ビルド確認

2. **ログを詳細に**
   - 何をしたか明確に記録
   - エラーメッセージは省略しない

3. **既存を壊さない**
   - 変更前にバックアップ
   - 既存機能のテスト

---

## 🚀 開始コマンド

```bash
# 実行開始
echo "Windsurf タスク実行開始: $(date)" >> .windsurf/execution-log.md

# タスク1から順番に実行
# 完了したら必ずログ更新
```

頑張ってください！不明点があれば escalation-required.md に記録して停止してください。
