# 🎯 TimeBid Issueテンプレート集

この文書はClaude AIがプロジェクトの状況を確認してGitHub
Issueを作成する際の参考テンプレートです。

## 📚 使用方法

1. **機能追加時**: Template 1-4から最適なものを選択
2. **バグ修正時**: Template 5を使用
3. **UI改善時**: Template 6を使用
4. **制約確認**: 各テンプレートの制約セクションを厳守

---

## Template 1: Google Calendar統合

```markdown
# Google Calendar統合実装

## 🎯 目的

オークション勝利後の専門家とのセッション予約をスムーズにする

## 📋 具体的タスク

- [ ] `src/lib/google-calendar.ts` - Google Calendar API統合
- [ ] `src/components/calendar/CalendarPicker.tsx` - 空き時間選択UI
- [ ] `src/app/api/calendar/auth/route.ts` - OAuth認証
- [ ] `src/app/api/calendar/events/route.ts` - イベント作成API
- [ ] 環境変数設定: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

## 🚫 制約

- TypeScriptエラー 0
- 依存関係追加: google-auth-library@^9.0.0 のみ
- 既存のSupabase認証システムと連携
- エラーハンドリング必須（日本語メッセージ）

## ✅ 成功条件

- npm run build 成功
- カレンダー認証フローが動作
- セッション予約がGoogleカレンダーに反映
- モバイル対応

## 🎯 優先度

high-priority

## 📁 参考ファイル

- `src/lib/supabase/client.ts` - 既存認証パターン
- `src/hooks/use-auth.ts` - 認証フック参考
```

## Template 2: リアルタイム入札通知

```markdown
# オークション入札リアルタイム通知システム

## 🎯 目的

他ユーザーの入札をリアルタイムで通知してエンゲージメント向上

## 📋 具体的タスク

- [ ] `src/components/auction/BidNotification.tsx` - 通知コンポーネント
- [ ] `src/hooks/use-auction-realtime.ts` - リアルタイム監視フック
- [ ] `src/lib/supabase/realtime.ts` - WebSocket接続強化
- [ ] 音声通知機能（設定で有効/無効切り替え可能）

## 🚫 制約

- Supabaseリアルタイム機能のみ使用
- 外部WebSocketライブラリ禁止
- 通知は非侵入的デザイン
- モバイル対応必須

## ✅ 成功条件

- 他ユーザー入札が1秒以内に反映
- 通知表示が適切
- パフォーマンス劣化なし（60fps維持）
- 設定保存機能

## 🎯 優先度

high-priority

## 📁 参考ファイル

- `src/hooks/use-realtime-auction.ts` - 既存リアルタイム実装
- `src/components/ui/alert.tsx` - 通知UI参考
```

## Template 3: A/Bテスト価格表示

```markdown
# 価格表示A/Bテストシステム

## 🎯 目的

最適な価格表示方法をデータドリブンで発見

## 📋 具体的タスク

- [ ] `src/components/auction/PriceDisplayVariants.tsx` - 価格表示バリエーション
- [ ] パターンA: 現在価格のみ
- [ ] パターンB: 価格 + 上昇率表示
- [ ] パターンC: 価格 + 推定最終価格
- [ ] `src/lib/experiments/price-ab-test.ts` - テスト管理

## 🚫 制約

- 既存 `src/services/experiments/ABTestingFramework.ts` を活用
- ユーザーにテストを悟らせない
- データ収集は匿名化
- パフォーマンス影響ゼロ

## ✅ 成功条件

- 3パターンが正常に分岐
- クリック率データ収集
- 管理画面で結果確認可能

## 🎯 優先度

medium

## 📁 参考ファイル

- `src/services/experiments/ABTestingFramework.ts` - 既存フレームワーク
- `src/components/auction/AuctionListCard.tsx` - 価格表示箇所
```

## Template 4: ウィジェット埋め込み機能強化

```markdown
# TimeBidウィジェット多サイト展開機能

## 🎯 目的

他サイトへの埋め込みウィジェット機能を拡張してSaaS展開

## 📋 具体的タスク

- [ ] `src/widget/multi-tenant-config.ts` - マルチテナント設定
- [ ] `src/components/widget/WidgetCustomizer.tsx` - カスタマイズUI
- [ ] `src/app/api/widget/config/route.ts` - ウィジェット設定API
- [ ] CDN配信設定（CloudFlare）

## 🚫 制約

- 既存 `src/widget/TimeBidWidget.ts` を破壊しない
- セキュリティ: XSS対策必須
- パフォーマンス: 軽量化（<50KB）
- 既存のマルチテナント設計活用

## ✅ 成功条件

- 複数サイトでウィジェット動作
- カスタマイズ設定が反映
- セキュリティテスト通過

## 🎯 優先度

medium

## 📁 参考ファイル

- `src/widget/TimeBidWidget.ts` - 既存ウィジェット
- `src/config/widget-config.ts` - 設定システム
```

## Template 5: バグ修正

```markdown
# [BUG] バグタイトル

## 🐛 問題の詳細

<!-- 何が起きているか、期待される動作との差分 -->

## 🔄 再現手順

1.
2.
3.

## 📱 環境

- ブラウザ:
- デバイス:
- バージョン:

## 📋 修正タスク

- [ ] `src/path/to/buggy-file.ts` - 問題箇所の特定と修正
- [ ] テストケース追加
- [ ] 関連する他機能への影響確認

## 🚫 制約

- 既存機能を壊さない
- TypeScriptエラー解消
- 根本原因の修正（対症療法禁止）

## ✅ 成功条件

- バグ再現せず
- 関連機能正常動作
- テスト追加済み

## 🎯 優先度

high-priority
```

## Template 6: UI/UX改善

```markdown
# [UI] UI改善タイトル

## 🎨 改善目的

<!-- ユーザーエクスペリエンス向上の具体的目標 -->

## 📋 改善タスク

- [ ] `src/components/target/Component.tsx` - UI改善
- [ ] レスポンシブ対応確認
- [ ] アクセシビリティ改善
- [ ] アニメーション追加（必要に応じて）

## 🚫 制約

- Tailwind CSS クラスのみ使用
- JavaScript animation 禁止
- アクセシビリティ: prefers-reduced-motion 対応
- 既存デザインシステム準拠

## ✅ 成功条件

- デザイン意図通りの表示
- モバイル対応完了
- アクセシビリティテスト通過
- パフォーマンス維持

## 🎯 優先度

low

## 📁 参考ファイル

- `src/components/ui/` - デザインシステム
- `tailwind.config.js` - 既存スタイル設定
```

---

## 📋 Issue作成時のチェックリスト

### ✅ 必須項目

- [ ] 明確な目的設定
- [ ] 具体的なファイルパス指定
- [ ] 技術制約の明記
- [ ] 測定可能な成功条件
- [ ] 適切な優先度設定

### 🎯 Claude Code成功率を上げるコツ

1. **ファイルパスは既存ファイルを確認してから指定**
2. **制約は技術的に具体的に**
3. **成功条件は客観的に測定可能に**
4. **参考ファイルを積極的に指示**

### 📊 優先度ガイドライン

- **high-priority**: 今日中、事業に直接影響
- **medium**: 今週中、ユーザー体験改善
- **low**: 来週以降、品質向上

---

## 🔄 定期更新

このテンプレート集は以下のタイミングで更新：

- 新機能追加時
- 成功パターンの発見時
- 技術スタック変更時

最終更新: 2025-06-04
