# 現在の最優先実装タスク - Windsurf実行指示

## 🚨 今日実行（最高優先度）

### Task 1: auction-card.tsx のプロフェッショナル化
**ファイル**: `src/components/auction/auction-card.tsx`
**目標**: 現在のシンプルなUIをプロフェッショナルなオークションカードに変更

**具体的実装**:
1. Windmill Dashboard のCard コンポーネントをベースにする
2. HyperUI の価格表示スタイルを統合
3. 青色テーマ（#3B82F6）で統一
4. モバイル完全対応

**制約**:
- 既存の props interface は維持
- TypeScript strict mode必須
- アクセシビリティ WCAG 2.1 AA準拠

**成功条件**:
- 見た目がプロフェッショナル
- 既存機能が全て動作
- モバイルで完璧に表示

---

### Task 2: dashboard/page.tsx のダッシュボード化
**ファイル**: `src/app/dashboard/page.tsx`
**目標**: 基本的な画面をSaaSレベルのダッシュボードに変更

**具体的実装**:
1. Windmill Dashboard の Layout を使用
2. 統計カード表示（総オークション数、売上、平均価格）
3. 最近のアクティビティ表示
4. ナビゲーション改善

**制約**:
- 既存のデータ取得ロジックは維持
- レスポンシブデザイン必須
- 読み込み状態の表示

---

## ⚡ 今週完了（高優先度）

### Task 3: AI価格提案UI実装
**ファイル**: 新規 `src/components/pricing/PriceSuggestion.tsx`
**目標**: 既存の PricingEngine にUIを追加

**具体的実装**:
1. `src/services/pricing/PricingEngine.ts` を活用
2. TailwindUI の Form コンポーネント使用
3. 価格提案ロジックの UI 化
4. エラーハンドリング完備

### Task 4: Google Calendar統合基盤
**ファイル**: 新規 `src/services/calendar/`
**目標**: 時間調整の自動化

**具体的実装**:
1. Google Calendar API 統合
2. 空き時間自動取得
3. オークション時間との照合
4. セキュリティ対応（OAuth2）

---

## 📋 実装しない範囲（重要）

### 現時点で実装禁止
- Supabase スキーマの変更
- 決済フローの変更
- 認証システムの変更
- 既存APIエンドポイントの破壊的変更

### 承認が必要な範囲
- 新しい外部ライブラリの追加
- 環境変数の追加・変更
- 本番環境への影響がある変更

---

## 🎯 Issue判別ガイド

### 即座に実装すべきIssue
1. **UI改善系**: プロフェッショナル化、ユーザビリティ向上
2. **既存機能の改善**: パフォーマンス、セキュリティ、安定性
3. **モバイル対応**: レスポンシブデザイン改善

### 慎重に検討すべきIssue  
1. **新機能追加**: 既存機能への影響を考慮
2. **外部統合**: セキュリティとパフォーマンス評価
3. **アーキテクチャ変更**: 事前承認必須

### 実装を避けるべきIssue
1. **破壊的変更**: 既存ユーザーへの影響
2. **実験的機能**: 安定性が不明
3. **過度な最適化**: ROIが不明

---

## 🔧 Windsurf 実行フロー

### 1. 作業開始前
```bash
# 現在のブランチ確認
git status
git branch

# 依存関係確認  
npm audit
npm outdated
```

### 2. 実装中
```bash
# 定期的なテスト実行
npm run test
npm run type-check
npm run lint

# ビルド確認
npm run build
```

### 3. 完了時
```bash
# 最終確認
npm run lighthouse
npm run test:e2e
git add .
git commit -m "feat: プロフェッショナルUI統合"
```

---

## 📞 質問・確認事項

### Windsurfが判断に迷った場合
1. **デザインの詳細**: セッションログの UI統合戦略を参照
2. **技術選択**: rules.md の制約に従う
3. **優先度**: current-priorities.md を確認
4. **不明点**: 実装を停止して確認を求める

### エラー対応
1. **ビルドエラー**: TypeScript設定を確認
2. **テストエラー**: 既存機能の破壊を疑う
3. **パフォーマンス劣化**: バンドルサイズを確認
4. **セキュリティ警告**: 即座に実装停止

---

**重要**: このファイルは現在の最優先事項を明確化するためのものです。Windsurfはこの指示に従って、効率的かつ安全に実装を進めてください。
