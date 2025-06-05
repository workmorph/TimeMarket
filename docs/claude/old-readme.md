# 🤖 CLAUDE_README.md

**TimeBidプロジェクト - Claude AI引き継ぎシステム**

---

## 📋 **最初に読むべきファイル順序**

### **Step 1: プロジェクト理解（必須）**

```bash
# 1. プロジェクトの本質理解
cat README.md
cat add_order.md  # 実装ロードマップ

# 2. 現在の状況確認
cat CLAUDE_SESSION_LOG.md  # 最新のセッション状況
cat CLAUDE_SESSION_HISTORY.md  # 全履歴
```

### **Step 2: 技術状況確認**

```bash
# 3. 技術的状況
cat change_log.md  # 実装変更履歴
cat docs/INTEGRATION_SUCCESS_REPORT.md  # 統合完了状況

# 4. 開発制約確認
cat .windsurf/rules.md  # Windsurf制御ルール
cat .windsurf/status-dashboard.md  # 現在のタスク状況
```

### **Step 3: 即座実行確認**

```bash
# 5. 実行待ちタスク確認
cat .windsurf/EXECUTE_NOW.md  # 今すぐ実行すべきタスク
cat .windsurf/CHECKLIST.md  # 実行前チェックリスト
```

---

## 🎯 **プロジェクトの本質（30秒で理解）**

### **TimeBid = 専門家時間の入札マーケットプレイス**

```
専門家の時間 → オークション形式 → 適正価格発見 → マッチング成立
    ↓                                              ↑
時間数×単価モデル                                15%手数料収益
```

### **技術構成**

- **メイン機能**: 時間入札システム（Next.js + Supabase + Stripe）
- **配布手段**: ウィジェット（CDN配布、マルチテナント）
- **補助機能**: AI要件定義（マッチング精度向上）

### **開発方針**

- **複雑な4エージェント並行 → シンプル統合型**
- **修正の連鎖 → 一発完成型**
- **Claude Code + 人間レビューの効率的組み合わせ**

---

## 📊 **現在のステータス Dashboard**

### **完成度**

| 機能                 | 実装 | 品質 | 状態     |
| -------------------- | ---- | ---- | -------- |
| オークションエンジン | ✅   | 85%  | 安定     |
| Stripe決済           | ✅   | 90%  | 完成     |
| ウィジェット         | ✅   | 80%  | 配布準備 |
| AI補助機能           | 🔄   | 60%  | 実装中   |
| UI/UX                | ⚠️   | 50%  | 改善必要 |

### **緊急度別タスク**

```
🚨 緊急（今日）: UI改善、TypeScript修正
⚡ 重要（今週）: AI統合、ウィジェット配布
📅 計画（来週）: Google Calendar統合
💡 将来（来月）: UX改善（オンライン/対面選択等）
```

---

## 🔧 **開発環境・制約**

### **技術スタック**

```yaml
Frontend: Next.js 15.3.3 + TypeScript 5.8.3
UI: shadcn/ui + TailwindCSS
Backend: Supabase (認証・DB・リアルタイム)
決済: Stripe
配布: CDN + ウィジェット
AI: OpenAI API (要件定義・マッチング)
```

### **開発制約（重要）**

```yaml
絶対禁止:
  - Supabaseスキーマ変更
  - 環境変数変更
  - 認証フロー変更
  - 15%手数料構造変更

必須維持:
  - TypeScript strict mode
  - 既存機能の動作
  - セキュリティ要件
  - モバイル対応
```

---

## 📝 **ログ管理ルール**

### **ファイル構成**

```
プロジェクト状況管理/
├── CLAUDE_README.md          # このファイル（エントリーポイント）
├── CLAUDE_SESSION_LOG.md     # 最新セッション詳細
├── CLAUDE_SESSION_HISTORY.md # 全セッション履歴
├── change_log.md             # 技術変更履歴
├── FUTURE_ISSUES.md          # 将来課題管理
└── .windsurf/
    ├── status-dashboard.md   # 開発状況
    ├── execution-log.md      # 実行ログ
    └── EXECUTE_NOW.md        # 緊急タスク
```

### **更新ルール**

#### **セッション開始時（5分以内）**

```bash
# 1. 必須確認コマンド
cd /Users/kentanonaka/workmorph/time-bid
cat CLAUDE_README.md  # このファイル
cat CLAUDE_SESSION_LOG.md  # 最新状況
cat .windsurf/EXECUTE_NOW.md  # 緊急タスク

# 2. ファイル構造確認（必須）
directory_tree src  # 思い込み防止

# 3. エラー確認
npm run type-check  # TypeScriptエラー確認
```

#### **セッション終了時（10分）**

```bash
# 1. CLAUDE_SESSION_LOG.md更新
# - 実施作業
# - 発見した問題
# - 次回アクション
# - 修正必要箇所

# 2. CLAUDE_SESSION_HISTORY.md追記
# - セッション番号
# - 作業時間
# - 成果物リスト
# - 学習事項

# 3. .windsurf/EXECUTE_NOW.md更新
# - 完了タスク削除
# - 新規タスク追加
# - 優先度調整
```

### **重要事項記録ルール**

```yaml
必ず記録:
  - ファイル構造の誤認識
  - 想定と異なる実装発見
  - 新しい制約・要件
  - パフォーマンス問題
  - セキュリティ懸念

記録場所:
  - 技術的発見 → change_log.md
  - 開発プロセス → CLAUDE_SESSION_LOG.md
  - 重要教訓 → CLAUDE_SESSION_HISTORY.md
  - 将来課題 → FUTURE_ISSUES.md
```

---

## ⚠️ **よくある誤解・注意点**

### **プロジェクト理解でのミス**

```
❌ 誤解: AI要件定義がメイン機能
✅ 正解: 時間入札システムがメイン、AI機能は補助

❌ 誤解: 複数エージェント並行開発継続
✅ 正解: シンプル統合型開発への移行

❌ 誤解: UI実装がゼロから
✅ 正解: shadcn/ui実装済み、品質向上が必要
```

### **技術実装でのミス**

```
❌ 危険: ファイル構造を確認せずに指示
✅ 安全: 必ずdirectory_tree確認後に作業

❌ 危険: 既存ファイルの内容を想定で判断
✅ 安全: read_fileで内容確認してから作業

❌ 危険: TypeScriptエラーを無視
✅ 安全: 必ずnpm run type-checkで確認
```

---

## 🎯 **典型的なセッションフロー**

### **パターンA: 新機能実装**

```
1. 要件確認 → CLAUDE_SESSION_LOG.md確認
2. 既存コード調査 → directory_tree + read_file
3. 実装計画 → .windsurf/EXECUTE_NOW.md更新
4. 実装実行 → Windsurf指示 or Claude Code
5. 品質確認 → TypeScript + 動作テスト
6. ログ更新 → 結果をセッションログに記録
```

### **パターンB: バグ修正・改善**

```
1. 問題調査 → エラーログ + ファイル確認
2. 原因特定 → 関連ファイル読み込み
3. 修正実行 → 最小限の変更で対応
4. 回帰テスト → 既存機能破壊チェック
5. 文書化 → change_log.mdに修正記録
```

### **パターンC: 戦略・方針決定**

```
1. 現状分析 → 複数ログファイル確認
2. 課題整理 → 優先度別に分類
3. 解決策検討 → 技術制約考慮
4. 計画策定 → 実装ロードマップ更新
5. 方針決定 → ドキュメント更新
```

---

## 🚀 **将来課題 Quick Reference**

### **UX改善課題（Issue #F001）**

```
時間提供方法の具体的導線設計:
- オンライン vs 対面の選択UI
- 対面の場合の場所設定（来るか行くか）
- 移動時間・交通費の扱い
- セッティング自動化の可能性

詳細: FUTURE_ISSUES.md参照
優先度: P2（基本機能完成後）
工数見積: 2-3週間
```

---

## 📞 **緊急時・問題発生時の対応**

### **よくある問題と対処法**

```yaml
TypeScriptエラー大量発生:
  確認: npm run type-check
  対処: typescript_check_script.sh実行

Windsurfが暴走:
  確認: .windsurf/rules.md
  対処: Windsurf停止 → ルール確認 → 再実行

既存機能が動かない:
  確認: npm run dev でエラー確認
  対処: change_log.mdで最近の変更確認

ファイルが見つからない:
  確認: directory_tree src
  対処: 正しいパス確認、ファイル存在確認
```

### **緊急連絡先・参考資料**

```
プロジェクト資料: add_order.md (実装計画詳細)
技術仕様: docs/DEVELOPMENT_SETUP.md
API仕様: Supabase Dashboard + Stripe Dashboard
UI参考: shadcn/ui公式ドキュメント
```

---

## 🎓 **セッション完了チェックリスト**

### **作業完了前チェック**

- [ ] TypeScriptエラー: 0件
- [ ] npm run build: 成功
- [ ] 既存機能: 動作確認
- [ ] 新機能: 基本動作確認
- [ ] セキュリティ: API KEYハードコードなし

### **文書更新チェック**

- [ ] CLAUDE_SESSION_LOG.md: 今回の作業記録
- [ ] CLAUDE_SESSION_HISTORY.md: セッション履歴追加
- [ ] .windsurf/EXECUTE_NOW.md: タスク状況更新
- [ ] change_log.md: 技術変更あれば記録
- [ ] FUTURE_ISSUES.md: 新規課題あれば記録

### **引き継ぎ準備チェック**

- [ ] 次回アクション明確化
- [ ] 未解決問題の整理
- [ ] 優先度の見直し
- [ ] 必要な資料の整備

---

**最終更新**: 2025-06-05 11:40 JST  
**次回更新**: セッション完了時（必須）  
**管理者**: プロジェクトリード

---

## 📚 **付録: 関連ファイル quick reference**

```bash
# プロジェクト理解
README.md                    # 基本情報
add_order.md                 # 実装ロードマップ詳細

# 現状把握
CLAUDE_SESSION_LOG.md        # 最新セッション
CLAUDE_SESSION_HISTORY.md    # 全履歴
change_log.md               # 技術変更履歴
FUTURE_ISSUES.md            # 将来課題管理

# 開発制約
.windsurf/rules.md          # Windsurf制御ルール
.windsurf/CHECKLIST.md      # 実行前チェック
docs/DEVELOPMENT_SETUP.md   # 開発環境

# 実行管理
.windsurf/EXECUTE_NOW.md    # 緊急タスク
.windsurf/status-dashboard.md # 開発状況
```
