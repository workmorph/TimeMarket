# TimeBidウィジェット テストサイト

このディレクトリには、TimeBidウィジェットの外部サイト埋め込みテスト用のファイルが含まれています。

## ディレクトリ構造

```
test-sites/
├── basic-html/          # 基本的なHTML環境でのテスト
│   └── index.html
├── react-app/          # React環境でのテスト
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       └── App.js
├── test-cases/         # 各種テストケース
│   ├── basic-functionality.html    # 基本機能テスト
│   ├── responsive.html            # レスポンシブテスト
│   ├── security.html              # セキュリティテスト
│   └── network-errors.html        # ネットワークエラーテスト
└── automated-test.js   # Playwright自動テストスクリプト
```

## テスト環境のセットアップ

### 1. 基本HTMLテスト

```bash
# ローカルサーバーを起動
cd test-sites
python3 -m http.server 8000
# または
npx http-server -p 8000
```

ブラウザで http://localhost:8000/basic-html/ にアクセス

### 2. Reactアプリテスト

```bash
cd test-sites/react-app
npm install
npm start
```

### 3. 自動テストの実行

```bash
# Playwrightのインストール
npm install -D @playwright/test

# テストの実行
cd test-sites
node automated-test.js

# またはPlaywrightコマンドで直接実行
npx playwright test automated-test.js
```

## テストケース詳細

### 基本機能テスト (`basic-functionality.html`)
- ウィジェットの読み込み
- 初期化エラーチェック
- APIキー認証
- オークション一覧表示
- 入札フォーム表示

### レスポンシブテスト (`responsive.html`)
- デスクトップ表示（1200px）
- タブレット表示（768px）
- モバイル表示（375px）
- 横向き表示（667px）

### セキュリティテスト (`security.html`)
- XSS攻撃への耐性
- 無効なAPIキーの処理
- Content Security Policy準拠
- オリジン制限
- CSRF対策

### ネットワークエラーテスト (`network-errors.html`)
- オフライン時の動作
- タイムアウト処理
- 再試行ロジック
- CDN/API接続失敗時の処理

## 手動テストチェックリスト

### ブラウザ互換性
- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)
- [ ] Chrome Mobile
- [ ] Safari Mobile

### パフォーマンス
- [ ] 初期読み込み時間 < 3秒
- [ ] スクリプト読み込み時間 < 1秒
- [ ] メモリリークなし
- [ ] スムーズなアニメーション

### アクセシビリティ
- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応
- [ ] 適切なARIA属性
- [ ] フォーカス管理

## トラブルシューティング

### ウィジェットが表示されない場合
1. ブラウザのコンソールでエラーを確認
2. ネットワークタブでCDNからの読み込みを確認
3. APIキーが正しいか確認
4. コンテナIDが正しいか確認

### テストが失敗する場合
1. ローカルサーバーが起動しているか確認
2. ポート番号が正しいか確認
3. Playwrightがインストールされているか確認
4. ブラウザドライバーが最新か確認

## 注意事項

- テスト用のAPIキー（`test_api_key_12345`）は実際の環境では使用しないでください
- セキュリティテストは必ず隔離された環境で実行してください
- 自動テストは CI/CD パイプラインに組み込むことを推奨します