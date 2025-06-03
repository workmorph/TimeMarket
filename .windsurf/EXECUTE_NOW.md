# ⚠️ 修正版: Windsurf即時実行タスク

## 実行開始時刻: 2025-06-03 10:30 JST

### 🔍 確認済み事項
- `src/components/auction/auction-card.tsx` は詳細画面の実装（カードコンポーネントではない）
- `src/app/dashboard/page.tsx` は存在しない
- UIコンポーネントは既に`src/components/ui/`にshadcn/ui実装済み
- `src/app/page.tsx` はシンプルなランディングページ

---

### ✅ タスク1: オークション一覧カードコンポーネント作成 - 即座に実行せよ

**新規作成**: `src/components/auction/AuctionListCard.tsx`
**参考**: 作成済みの `AuctionCardTemplate.tsx`
**実装内容**:
1. オークション一覧用のカードコンポーネント作成
2. 既存の`src/components/ui/card.tsx`を活用
3. 以下の要素を含む:
   - タイトル
   - 現在価格
   - 残り時間（カウントダウン）
   - 入札数
   - 専門家情報（簡易版）
4. モバイル対応必須

**成功条件**:
- TypeScript型定義完備
- レスポンシブデザイン
- 再利用可能なコンポーネント

---

### ✅ タスク2: ダッシュボードページ新規作成 - 即座に実行せよ

**新規作成**: `src/app/dashboard/page.tsx`
**参考**: 作成済みの `DashboardLayoutTemplate.tsx`
**実装内容**:
1. 統計カード表示
   - 総売上（モックデータ）
   - アクティブオークション数
   - 総入札数
   - ユーザー数
2. 最近のアクティビティ
3. 簡易グラフ（オプション）

**使用コンポーネント**:
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- lucide-react アイコン

---

### ✅ タスク3: ランディングページ改善 - 即座に実行せよ

**ファイル**: `src/app/page.tsx`
**実装内容**:
1. ヒーローセクションの改善
2. 特徴セクション追加（3つの特徴）
3. 仕組み説明セクション
4. CTAセクション強化

**制約**:
- 既存のグラデーション背景維持
- モバイルファースト

---

### ✅ タスク4: 既存UIコンポーネント最適化 - 即座に実行せよ

**対象ファイル**:
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`

**実装内容**:
1. アクセシビリティ属性追加
   - aria-label
   - focus状態の改善
2. アニメーション追加（控えめ）
   - hover効果
   - 遷移効果

---

### ✅ タスク5: APIキー管理ページ改善 - 即座に実行せよ

**ファイル**: `src/app/dashboard/api-keys/page.tsx`
**実装内容**:
1. UIの改善（既存機能は維持）
2. テーブルレイアウト追加
3. コピーボタンの改善
4. 削除確認モーダル

---

## 📊 進捗報告方法

各タスク完了時に以下の形式で`.windsurf/execution-log.md`に記録:

```markdown
### タスク: [タスク名]
- 開始時刻: YYYY-MM-DD HH:MM
- 完了時刻: YYYY-MM-DD HH:MM  
- ステータス: ✅完了
- 作成/変更ファイル:
  - path/to/file.tsx (新規/変更)
- テスト結果: npm run build 成功
- 特記事項: （あれば）
```

## ⚠️ 確認事項

以下を必ず確認:
- `npm run build` が成功すること
- TypeScriptエラーがないこと
- 既存機能を破壊していないこと

## 🚫 実行禁止事項

- Supabaseスキーマの変更
- 環境変数の変更
- 既存APIの変更
- 認証フローの変更

---

## 優先順位
1. AuctionListCard.tsx作成（最重要）
2. dashboard/page.tsx作成
3. その他は順次実行
