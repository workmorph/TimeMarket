# 🚀 Windsurf即時実行タスク - 人間確認不要

## 実行開始時刻: 2025-06-03 10:00 JST

### ✅ タスク1: UI改善 - 即座に実行せよ

**ファイル**: `src/components/auction/auction-card.tsx`
**実行内容**:
1. `/scripts/integrate-ui-templates.sh` を実行
2. `AuctionCardTemplate.tsx` の内容を参考に `auction-card.tsx` を完全リファクタ
3. 以下の要件を満たす:
   - Windmill Card コンポーネントベース
   - 青色テーマ (#3B82F6)
   - モバイル完全対応
   - TypeScript strict mode
   - アクセシビリティ WCAG 2.1 AA

**完了後アクション**:
- `npm run test` 実行
- `npm run build` 成功確認
- 完了ログを `.windsurf/execution-log.md` に記録

---

### ✅ タスク2: ダッシュボード改善 - 即座に実行せよ

**ファイル**: `src/app/dashboard/page.tsx`
**実行内容**:
1. `DashboardLayoutTemplate.tsx` を参考に完全リファクタ
2. 統計カード実装（Windmill Card使用）
3. Tremor でグラフ追加
4. レスポンシブデザイン確保

**制約**:
- 既存のデータ取得ロジックは維持
- ローディング状態必須
- エラーハンドリング完備

---

### ✅ タスク3: コード品質改善 - 即座に実行せよ

**対象**: 全TypeScriptファイル
**実行内容**:
1. console.log を適切なロガーに置換
2. 未使用importの削除
3. any型の排除
4. エラーハンドリング追加

```bash
# 実行コマンド
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "console.log"
# 各ファイルで console.log を logger.debug() に置換
```

---

### ✅ タスク4: アクセシビリティ改善 - 即座に実行せよ

**対象**: 全コンポーネント
**実行内容**:
1. ボタンに aria-label 追加
2. 画像に alt 属性追加
3. フォームに label 追加
4. キーボードナビゲーション確保

---

## 📊 進捗報告方法

各タスク完了時に以下の形式で記録:

```markdown
## タスク完了報告 - [タスク名]
- 完了時刻: YYYY-MM-DD HH:MM
- 変更ファイル数: X
- テスト結果: PASS/FAIL
- ビルド結果: SUCCESS/FAIL
- 特記事項: （あれば）
```

## ⚠️ エスカレーション条件

以下の場合は実行を停止し、`.windsurf/escalation-required.md` に記録:
- ビルドエラー
- テスト失敗率 > 20%
- TypeScriptエラー
- 既存機能の破壊

## 🔄 次回確認予定
- 2時間後に進捗確認
- 完了タスクの品質チェック
- 次バッチのタスク準備
