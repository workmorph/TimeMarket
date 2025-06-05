# 🤖 AI Agent 指示管理システム

**TimeBidプロジェクト - 段階的実装指示書管理**

---

## 📋 **システム概要**

### **設計思想**

- **段階的実行**: フェーズごとに分割された明確な指示
- **自動継続**: 各指示の完了時に次の指示への自動移行
- **品質保証**: 成功条件とGitHubコミットによる進捗管理
- **トレーサビリティ**: 全ての変更が追跡可能

### **進行フロー**

```
指示1 → 実装 → テスト → GitCommit → 指示2 → 実装 → ...
```

---

## 🎯 **現在の実行指示**

### **⚡ 現在実行中**

```yaml
フェーズ: Phase 1 - マルチテナントシステム構築
指示: instruction-1-1-database.md
開始日: 2025-06-05
担当: AI Agent
次回レビュー: 指示完了時
```

### **📊 全体進捗**

```
Phase 1: マルチテナントシステム構築     [ ⚪⚪⚪⚫⚫ ] 0/5
Phase 2: ウィジェット高度化             [ ⚫⚫⚫⚫⚫ ] 0/3
Phase 3: SaaS課金システム               [ ⚫⚫⚫⚫⚫ ] 0/2
Phase 4: セッション管理統合             [ ⚫⚫⚫⚫⚫ ] 0/4
```

---

## 📁 **指示書構造**

### **Phase 1: マルチテナントシステム構築**

```
phase-1-tenant-system/
├── instruction-1-1-database.md      ← 【現在実行中】
├── instruction-1-2-tenant-api.md
├── instruction-1-3-tenant-ui.md
├── instruction-1-4-expert-mgmt.md
└── instruction-1-5-integration.md
```

### **Phase 2: ウィジェット高度化**

```
phase-2-widget-enhancement/
├── instruction-2-1-tenant-filtering.md
├── instruction-2-2-whitelabel.md
└── instruction-2-3-widget-testing.md
```

### **Phase 3: SaaS課金システム**

```
phase-3-saas-billing/
├── instruction-3-1-billing-core.md
└── instruction-3-2-usage-tracking.md
```

### **Phase 4: セッション管理統合**

```
phase-4-session-integration/
├── instruction-4-1-calendar-api.md
├── instruction-4-2-session-mgmt.md
├── instruction-4-3-video-integration.md
└── instruction-4-4-end-to-end.md
```

---

## 🔄 **実行プロトコル**

### **AI Agent実行手順**

1. **指示書確認**: 現在の指示書を完全に理解
2. **前提条件チェック**: 依存関係・環境確認
3. **実装実行**: 指示通りの実装
4. **テスト実行**: 成功条件の検証
5. **GitHubコミット**: 指定されたコミットメッセージ
6. **次の指示移行**: 自動的に次の指示書を開始

### **Claude監督手順**

1. **週次レビュー**: 進捗確認・品質チェック
2. **指示書更新**: 必要に応じて指示書修正
3. **優先順位調整**: ビジネス要件に応じた調整
4. **問題解決**: エラー・ブロッカー対応

---

## 📊 **品質保証システム**

### **各指示の品質基準**

- ✅ **TypeScript エラー 0件**
- ✅ **npm run build 成功**
- ✅ **テストケース全パス**
- ✅ **セキュリティチェック完了**
- ✅ **パフォーマンス基準クリア**

### **GitHubコミット規則**

```
feat(phase-N): [指示番号] 機能追加内容

- 具体的な変更内容
- テスト結果
- 次の指示への準備完了

Refs: instruction-N-M-filename.md
```

---

## 🚨 **緊急時プロトコル**

### **エラー発生時**

1. **エラー分析**: ログ・原因特定
2. **Claude通知**: 即座に問題報告
3. **回復手順**: 前の安定状態への復旧
4. **指示書修正**: 問題を回避する指示書更新

### **ブロッカー発生時**

1. **依存関係確認**: 外部API・サービス状況
2. **代替案検討**: 別実装方法の提案
3. **スキップ判断**: 後回し可能かの判断
4. **優先順位変更**: フェーズ順序の調整

---

## 📈 **成功指標（KPI）**

### **開発効率**

- **指示完了率**: 95%以上
- **GitHub コミット頻度**: 1日1回以上
- **エラー率**: 10%以下
- **手戻り率**: 5%以下

### **品質指標**

- **TypeScriptエラー**: 常に0件維持
- **ビルド成功率**: 100%
- **テストカバレッジ**: 80%以上
- **パフォーマンス**: Lighthouse 90+

---

## 🔗 **関連ドキュメント**

- **技術仕様書**: `/docs/technical/`
- **API設計書**: `/docs/api/`
- **データベース設計**: `/docs/database/`
- **セキュリティ要件**: `/docs/security/`

---

## 📞 **AI Agent へのメッセージ**

**現在の指示**:
`docs/ai-agent-instructions/phase-1-tenant-system/instruction-1-1-database.md`

**重要**:

- 指示書の内容を正確に実行してください
- 成功条件を全て満たしてからコミットしてください
- 次の指示への移行を自動的に行ってください
- 問題があれば即座にClaude に報告してください

**開始コマンド**: 上記指示書を開いて実行開始

---

**最終更新**: 2025-06-05 15:00 JST  
**管理者**: Claude (Project Manager)  
**次回レビュー**: Phase 1 完了時
