---
title: ウィジェットライブラリのCDNデプロイ
labels: enhancement, priority
assignees: ''
---

## 機能概要
ビルドしたウィジェットライブラリをCDNにデプロイし、外部サイトからの利用を可能にする。

## 解決する問題
- 現在、ウィジェットライブラリはローカル環境でのみ利用可能
- 外部サイトからTimeBidのオークション機能を利用するためのアクセス手段が必要
- バージョン管理と配布の仕組みが確立されていない

## 提案する実装方法
1. Viteを使用してES, UMD, IIFEフォーマットでビルド
2. CDNプロバイダー（Cloudflare, jsDelivr等）にデプロイ
3. バージョニング戦略を実装
4. 埋め込みスクリプトのサンプルコードを作成

## タスク
- [ ] ウィジェットライブラリのビルド設定確認
- [ ] CDNプロバイダーの選定と設定
- [ ] デプロイスクリプトの作成
- [ ] バージョニング戦略の実装
- [ ] 埋め込みサンプルコードの作成
- [ ] ドキュメントの更新

## 技術的詳細
- ビルド形式: ES, UMD, IIFE
- サポートするブラウザ: Chrome, Firefox, Safari, Edge
- バンドルサイズ制限: 50KB以下
- 依存関係の最小化
- CSP対応
- カスタマイズ可能なテーマオプション

## その他の情報
- 関連PR: #未定
- 参考: [Viteライブラリモード](https://vitejs.dev/guide/build.html#library-mode)
- 参考: [Cloudflare Pages](https://pages.cloudflare.com/)
