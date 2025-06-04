# 📋 TimeBid 5人体制 タスク管理シート

## 現在の稼働状況（2025-06-03 15:00時点）

### 🟢 稼働中
| 担当 | タスク | 開始時刻 | 予定完了 | 状態 |
|------|--------|----------|----------|------|
| Person 1 | Stripe決済系（Phase 1） | 実行中 | 17:00 | 🟢 進行中 |
| Person 2 | 静的ページ（Track A） | 実行中 | 16:00 | 🟢 進行中 |

### 🟡 待機中（優先順）
| 担当 | タスク | 開始条件 | 所要時間 |
|------|--------|----------|----------|
| Person 3 | テストスイート（Track D） | すぐ開始可 | 2時間 |
| Person 4 | シードデータ（Track F） | すぐ開始可 | 1時間 |
| Person 5 | SEO最適化（Track K） | すぐ開始可 | 1.5時間 |

---

## 🛠️ タスク管理方法

### 1. シンプルな進捗チェック（30分ごと）
```bash
# 各自の最新状態を1行で報告
echo "[$(date +%H:%M)] Person1: Stripe決済 70%完了" >> progress.log
echo "[$(date +%H:%M)] Person2: 利用規約ページ完成" >> progress.log
```

### 2. 競合回避ルール
```
- src/app/api/ → Person 1 専用（Stripe系）
- src/app/terms/, privacy/ → Person 2 専用（静的）
- src/__tests__/ → Person 3 専用（テスト）
- scripts/ → Person 4 専用（データ）
- public/, sitemap → Person 5 専用（SEO）
```

### 3. マージタイミング
```
16:00 - Person 2 の静的ページをマージ
17:00 - Person 1 の決済系をマージ
17:30 - Person 3,4,5 の作業をマージ
18:00 - 全体動作確認
```

---

## 📝 Person 3,4,5 への具体的指示

### Person 3: テストスイート構築
```
以下のテストを作成してください：
1. src/__tests__/payment.test.ts - Stripe決済のテスト
2. src/__tests__/auction.test.ts - オークション機能のテスト
3. src/__tests__/components/AuctionListCard.test.tsx
4. .github/workflows/test.yml - CI設定

他の人の作業と競合しないので、自由に進めてください。
```

### Person 4: 初期データ準備
```
scripts/ディレクトリで以下を作成：
1. seed-data.ts - デモ用データ投入スクリプト
2. src/data/categories.json - カテゴリマスタ
3. src/data/demo-auctions.json - サンプルオークション
4. package.jsonに "seed": "ts-node scripts/seed-data.ts" 追加

データ系なので独立作業可能です。
```

### Person 5: SEO最適化
```
以下のSEO対応を実施：
1. src/app/sitemap.ts - サイトマップ生成
2. src/app/robots.ts - robots.txt
3. public/favicon.ico, apple-touch-icon.png等
4. 各ページのmetadata設定確認

publicフォルダ中心なので競合なしです。
```

---

## ⚠️ 注意事項

1. **ブランチ運用**
   ```bash
   git checkout -b feature/payment     # Person 1
   git checkout -b feature/static      # Person 2
   git checkout -b feature/tests       # Person 3
   git checkout -b feature/seed-data   # Person 4
   git checkout -b feature/seo         # Person 5
   ```

2. **コミュニケーション**
   - 詰まったら即共有
   - 30分ごとに進捗報告
   - マージ前に必ず連絡

3. **品質基準**
   - 動けばOK（完璧を求めない）
   - エラーが出たら後回し
   - まずは完成を優先

---

## 📊 本日の目標（18:00時点）

- [ ] 決済フロー動作確認
- [ ] 静的ページ全て完成
- [ ] 基本的なテスト実行可能
- [ ] デモデータで動作確認
- [ ] SEO基本設定完了

これで**プロジェクト進捗60%**達成見込み！
