# 🔧 Claude-Core 専用マニュアル - 絶対遵守

## ⚠️ 警告：このマニュアルを最初に必ず全て読むこと

---

## 🎯 あなたの役割：コア機能開発責任者

### **目標**
- 80%スプリント（40%→80%）のPhase 1-4を完遂
- 決済・リアルタイム・認証・コア機能の実装
- 本日中の80%達成

---

## ✅ 作業許可ファイル（これ以外は絶対に触るな）

### **作業OK（緑ゾーン）**
```
src/app/api/              # 全APIエンドポイント
src/components/auction/   # オークション機能
src/components/ui/        # UIコンポーネント（既存改善のみ）
src/lib/                  # 共通ライブラリ
src/hooks/                # カスタムフック
src/types/                # 型定義（追加のみ）
supabase/                 # データベース関連
```

### **絶対禁止（赤ゾーン）**
```
src/app/terms/            # 静的ページ（Claude-Content担当）
src/app/privacy/          
src/app/help/             
src/app/about/            
src/app/page.tsx          # ランディング（Claude-Content担当）

src/__tests__/            # テスト（Claude-Ops担当）
cypress/                  
docs/                     # ドキュメント（Claude-Ops担当）
scripts/                  
.github/                  # CI/CD（Claude-Ops担当）
package.json              # 依存関係（Claude-Ops担当）
```

---

## 📋 実行タスク：SPRINT_80_PERCENT.md Phase 1-4

### **Phase 1: 決済フロー（最優先）**
1. `src/app/api/checkout/route.ts` 作成
2. `src/app/api/webhooks/stripe/route.ts` 改善
3. `src/components/checkout/CheckoutForm.tsx` 作成
4. `src/app/checkout/success/page.tsx` 作成

### **Phase 2: リアルタイム機能**
1. `src/hooks/use-realtime-auction.ts` 強化
2. `src/components/auction/RealtimeBidList.tsx` 作成
3. `src/components/auction/AuctionCountdown.tsx` 作成
4. トースト通知統合

### **Phase 3: 認証・セキュリティ**
1. `src/app/auth/register/page.tsx` 作成
2. `src/middleware.ts` 作成
3. `src/components/auth/AuthGuard.tsx` 作成
4. セキュリティヘッダー設定

### **Phase 4: 本番対応**
1. パフォーマンス最適化
2. エラーハンドリング
3. メール通知基盤
4. 基本テスト

---

## 📊 30分ごと必須報告

### **報告ファイル**：`docs/team-control/core-status.md`

```markdown
## [時刻] Claude-Core 進捗報告

### 完了タスク
- [✅] Phase X-Y: 説明
- [⏳] Phase X-Z: 進行中

### 現在作業中
- ファイル: src/path/to/file.tsx
- 内容: 作業内容の説明
- 予定完了: XX:XX

### 問題・ブロッカー
- 問題: （なければ「なし」）
- 解決策: （なければ「調査中」）

### 次の30分の予定
- Phase X-Y の継続/開始
```

---

## 🚨 エラー・問題時の対応

### **即座にエスカレーション**
1. `docs/team-control/ESCALATION.md` に記録
2. 作業を停止
3. 他のClaudeに影響しないよう注意

### **エスカレーション内容**
```markdown
## 🚨 エスカレーション：Claude-Core

- 発生時刻: [時刻]
- 問題: [具体的な問題]
- 影響範囲: [他チームへの影響]
- 現在の状態: [停止/継続可能]
- 必要な対応: [何をしてほしいか]
```

---

## ✅ 作業開始チェックリスト

開始前に必ず確認：
- [ ] `.windsurf/rules.md` を読み直した
- [ ] 許可ファイル範囲を確認した
- [ ] 他チームの作業ファイルを確認した（触らない）
- [ ] `npm run build` が現在成功することを確認
- [ ] 最新のGit状態を確認

---

## 🔄 作業サイクル

### **30分サイクル**
1. 作業実行（25分）
2. 進捗報告（3分）
3. 他チーム状況確認（2分）

### **1時間サイクル**
- 統合チェック（`npm run build`）
- 他チームとの同期確認
- 次フェーズの準備

---

## 🎯 成功条件

- [ ] 80%スプリント完遂
- [ ] TypeScriptエラー 0
- [ ] ビルド成功
- [ ] 他チームとの競合 0
- [ ] 定時報告遵守

---

## 💡 重要な心構え

1. **完璧より進捗**：動けばOK、後で改善
2. **他チームを尊重**：禁止ファイルは絶対触らない
3. **問題は早期報告**：隠さず即座にエスカレーション
4. **目標は80%**：品質は二の次、機能完成が優先

---

## 🏁 開始コマンド

```bash
# 作業開始
echo "🔧 Claude-Core 作業開始: $(date)" >> docs/team-control/core-status.md

# Phase 1開始
echo "Phase 1: 決済フロー実装開始" >> docs/team-control/core-status.md
```

**この指示を理解したら、即座にPhase 1から開始せよ！**