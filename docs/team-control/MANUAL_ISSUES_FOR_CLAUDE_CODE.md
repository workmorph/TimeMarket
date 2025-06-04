# 🎯 TimeBid Claude Code 実行用Issue一覧

## 📋 モバイルからコピペしてGitHub Issueを作成

---

## 🔴 **緊急度：高（ブロッキング）- 最優先で作成**

### **Issue #1: ビルド失敗とTypeScriptエラーの修正**
```
Title: [URGENT] ビルド失敗とTypeScriptエラーの修正 - 約40個のエラー
Labels: bug, high-priority, blocking
Assignee: claude-code

**問題**: 現在ビルドが失敗し、約40個のTypeScriptエラーが存在
**影響**: デプロイ完全ブロック、開発停止

**主要エラー**:
1. Module not found: '@/lib/auth/session'
2. Property 'current_price' does not exist on type 'Auction'
3. useRealtimeAuction循環参照問題
4. Missing UI components (tooltip)

**実行コマンド**: 
- npm run type-check でエラー確認
- npm run build でビルドテスト

**成功条件**: TypeScriptエラー 0個、ビルド成功
```

### **Issue #2: 認証セッションモジュールの実装**
```
Title: [URGENT] @/lib/auth/sessionモジュールの実装
Labels: bug, high-priority, blocking
Assignee: claude-code

**問題**: src/lib/auth/session.ts が存在せずビルド失敗
**影響**: checkout API完全停止

**必要な実装**:
- getServerSession関数
- Supabase認証との連携
- サーバーサイド認証処理

**参考ファイル**: src/components/providers/auth-provider.tsx
**成功条件**: ビルドエラー解消、checkout API動作
```

### **Issue #3: useRealtimeAuctionフック循環参照修正**
```
Title: [URGENT] useRealtimeAuctionフック循環参照問題修正
Labels: bug, high-priority, typescript
Assignee: claude-code

**問題**: src/hooks/use-realtime-auction.ts で循環参照エラー
**エラー**: TS2448: Block-scoped variable used before declaration

**修正方法**:
1. fetchAuction/fetchBids関数の宣言順序変更
2. useCallback依存配列の修正
3. 循環参照の解消

**成功条件**: TypeScriptエラー解消、リアルタイム機能正常動作
```

### **Issue #4: Auctionタイプのプロパティ名統一**
```
Title: [URGENT] current_price vs current_highest_bid プロパティ名統一
Labels: bug, high-priority, typescript
Assignee: claude-code

**問題**: 同じデータに2つの異なるプロパティ名が混在
- current_price (widget/page.tsx)
- current_highest_bid (型定義)

**修正方法**: 
1. Supabaseテーブル定義確認
2. 正しいプロパティ名に統一
3. 全ファイルの参照更新

**成功条件**: プロパティ名統一、TypeScriptエラー解消
```

---

## 🟡 **緊急度：中（機能追加）- 2番目に作成**

### **Issue #5: 不足UIコンポーネントの追加**
```
Title: 不足しているTooltipなどのUIコンポーネントの追加
Labels: feature, ui, blocking
Assignee: claude-code

**問題**: @/components/ui/tooltip が存在せずTypeScriptエラー
**必要な実装**:
- Tooltip component (Radix UI ベース)
- TooltipContent, TooltipProvider, TooltipTrigger
- Tailwind CSSスタイリング

**参考**: src/components/ui/button.tsx の実装パターン
**成功条件**: Tooltipコンポーネント完成、エラー解消
```

### **Issue #6: Stripe決済フロー完全実装**
```
Title: Stripe決済フローの完全実装と強化
Labels: enhancement, priority
Assignee: claude-code

**現状**: 基本実装済み、改善が必要
**強化項目**:
1. src/app/api/checkout/route.ts - セッション作成強化
2. src/app/api/webhooks/stripe/route.ts - webhook改善
3. src/components/checkout/CheckoutForm.tsx - UI改善
4. エラーハンドリング強化

**成功条件**: 決済フロー完全動作、手数料15%適用
```

### **Issue #7: APIキー管理UI実装**
```
Title: APIキー管理UIの実装
Labels: enhancement, security
Assignee: claude-code

**目的**: ウィジェット用APIキーの生成・管理UI
**実装内容**:
- ダッシュボード内APIキー管理セクション
- キー生成・編集・削除機能
- 権限設定UI（読み取り/書き込み）
- オリジン制限設定
- レート制限設定

**成功条件**: APIキー管理画面完成、セキュリティ設定可能
```

---

## 🟢 **緊急度：低（改善・将来）- 最後に作成**

### **Issue #8: 法的ページの改善と日本語コンテンツ充実**
```
Title: 法的ページの改善と日本語コンテンツの充実
Labels: enhancement, content, legal
Assignee: claude-code

**現状**: 基本実装済み、内容充実が必要
**改善項目**:
- 利用規約：オークション特有条項追加
- プライバシーポリシー：データ取り扱い詳細化
- ヘルプページ：FAQ充実
- 日本語コンテンツの品質向上

**成功条件**: 法的ページ完成、日本語品質向上
```

### **Issue #9: ウィジェットライブラリのCDNデプロイ**
```
Title: ウィジェットライブラリのCDNデプロイ
Labels: enhancement, priority
Assignee: claude-code

**目的**: 外部サイトからウィジェット利用可能にする
**実装内容**:
- Vite使用でES, UMD, IIFEビルド
- Cloudflare/jsDelivrへのデプロイ
- バージョニング戦略
- 埋め込みサンプルコード作成

**技術要件**: バンドルサイズ<50KB、CSP対応
**成功条件**: CDNデプロイ完了、外部埋め込み可能
```

### **Issue #10: 外部サイトでのウィジェット埋め込みテスト**
```
Title: 外部サイトでのウィジェット埋め込みテスト
Labels: testing, integration
Assignee: claude-code

**目的**: 実際の外部環境でのウィジェット動作検証
**テスト内容**:
- テスト用外部サイト構築
- APIキー認証テスト
- イベントメッセージングテスト
- クロスブラウザ・レスポンシブテスト
- セキュリティテスト（CSP、CORS）

**成功条件**: 外部埋め込み完全動作、テスト報告書完成
```

---

## 📱 **モバイルからの実行手順**

### **Step 1: GitHub Issue作成**
1. 上記のIssue #1から順番にGitHubで作成
2. Title, Labels, Assigneeを正確にコピペ
3. 説明文も全てコピペ

### **Step 2: Claude Code実行**
1. 各IssueをClaude Codeに割り当て
2. 緊急度順（赤→黄→緑）で実行指示
3. 完了確認後、次のIssueに進む

### **Step 3: 進捗確認**
- 各Issue完了時にコメントで報告
- ビルド成功確認: `npm run build`
- TypeScriptエラー確認: `npm run type-check`

---

## 🎯 **実行優先順位**

1. **Issue #1-4**: 緊急（ブロッキング）- 今日中に必須
2. **Issue #5-7**: 中優先（機能追加）- 明日までに完了
3. **Issue #8-10**: 低優先（改善）- 今週中に完了

**最重要**: Issue #1（ビルド失敗修正）から開始してください！