# 🎯 Windsurf Cascade 分割表示と管理方法

## Windsurfの画面分割方法

### 1. Cascade（複数AI）の分割表示

```
【方法1: タブ分割】
1. Windsurfで新しいタブを開く（Cmd+T / Ctrl+T）
2. 各タブで異なるCascadeを起動
3. タブをドラッグして分割表示

【方法2: ペイン分割】
1. View → Split Editor Right（または Cmd+\）
2. 各ペインで異なるチャットを開く
3. 各Cascadeに個別の指示を送信

【方法3: 複数ウィンドウ】
1. File → New Window
2. 各ウィンドウで異なるタスクを実行
3. Mission Control等で並べて表示
```

---

## 📝 Windsurf Rules 設定方法

### .windsurfディレクトリ構造
```
.windsurf/
├── rules.json          # 🆕 Windsurf専用ルール
├── cascade_1.md        # Cascade 1用指示
├── cascade_2.md        # Cascade 2用指示
├── cascade_3.md        # Cascade 3用指示
├── cascade_4.md        # Cascade 4用指示
└── cascade_5.md        # Cascade 5用指示
```

### rules.json の設定例
```json
{
  "version": "1.0",
  "cascades": {
    "cascade_1": {
      "name": "Stripe決済担当",
      "workingDirectory": "src/app/api",
      "allowedPaths": ["src/app/api/**", "src/lib/stripe/**"],
      "blockedPaths": ["src/app/terms/**", "src/__tests__/**"],
      "autoCommit": true,
      "branchName": "feature/payment"
    },
    "cascade_2": {
      "name": "静的ページ担当",
      "workingDirectory": "src/app",
      "allowedPaths": ["src/app/terms/**", "src/app/privacy/**"],
      "blockedPaths": ["src/app/api/**"],
      "autoCommit": true,
      "branchName": "feature/static-pages"
    },
    "cascade_3": {
      "name": "テスト担当",
      "workingDirectory": "src/__tests__",
      "allowedPaths": ["src/__tests__/**", ".github/workflows/**"],
      "blockedPaths": ["src/app/**"],
      "autoCommit": false,
      "branchName": "feature/tests"
    }
  },
  "globalRules": {
    "language": "typescript",
    "framework": "nextjs",
    "testOnSave": false,
    "formatOnSave": true
  }
}
```

---

## 🚀 5人体制のCascade個別指示

### Cascade 1: Stripe決済担当
```markdown
# Cascade 1 専用指示

あなたはStripe決済実装担当です。

## 作業範囲
- src/app/api/checkout/
- src/app/api/webhooks/stripe/
- src/lib/stripe/

## 現在のタスク
SPRINT_80_PERCENT.md の Phase 1 を実行

## 禁止事項
- 他のディレクトリには触らない
- 特に静的ページやテストは変更禁止

## 進捗報告
30分ごとに以下を実行：
echo "[$(date +%H:%M)] Cascade1: [進捗内容]" >> progress.log
```

### Cascade 2: 静的ページ担当
```markdown
# Cascade 2 専用指示

あなたは静的ページ実装担当です。

## 作業範囲
- src/app/terms/page.tsx
- src/app/privacy/page.tsx
- src/app/help/page.tsx
- src/app/about/page.tsx

## 現在のタスク
PARALLEL_TASKS.md の Track A を実行

## 進捗報告
完了ごとに報告
```

### Cascade 3-5 も同様に...

---

## 🎮 Windsurf操作のコツ

### 1. Cascade切り替えショートカット
```
Cmd+1〜5: 各Cascadeに切り替え
Cmd+`: Cascade一覧表示
```

### 2. 分割表示レイアウト
```
【おすすめ5人レイアウト】
┌─────────┬─────────┐
│ Cascade1 │ Cascade2 │
├─────────┼─────────┤
│ Cascade3 │ Cascade4 │
├─────────┴─────────┤
│     Cascade5        │
└───────────────────┘
```

### 3. 進捗確認ダッシュボード
```bash
# 別ターミナルで実行
watch -n 30 'clear && echo "=== TimeBid 進捗 ===" && tail -10 progress.log'
```

---

## 📋 Cursor → Windsurf 移行のポイント

### Cursorとの違い
| 機能 | Cursor | Windsurf |
|------|--------|----------|
| AI分割 | タブ | Cascade |
| ルール | .cursorrules | .windsurf/rules.json |
| 指示 | インライン | 専用ファイル |
| 並列実行 | 手動 | 自動管理 |

### Windsurfの利点
1. **Cascade**: 複数AIの並列実行
2. **自動ブランチ管理**: 競合回避
3. **パス制限**: 誤編集防止
4. **進捗追跡**: 自動ログ

---

## 🔧 今すぐ設定する手順

1. **rules.json作成**
```bash
mkdir -p .windsurf
cat > .windsurf/rules.json << 'EOF'
{
  "version": "1.0",
  "cascades": {
    // 上記の設定をコピペ
  }
}
EOF
```

2. **各Cascade用指示作成**
```bash
# 各担当用のマークダウン作成
echo "# Cascade 1 指示" > .windsurf/cascade_1.md
# ... 以下同様
```

3. **Windsurfで実行**
- 各Cascadeで対応するmdファイルを開く
- 指示を読み込ませる
- 並列実行開始

これでCascadeを使った5人体制の管理が可能になります！
