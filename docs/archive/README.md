# 📁 アーカイブディレクトリ

このディレクトリには、開発過程で作成された一時的なファイルで、参考価値があるものを保管しています。

## 📂 config/

### claude.yml

- **用途**: GitHub ActionsでClaude Codeを実行するための設定
- **参考価値**: 将来のCI/CD設定時の参考
- **作成時期**: プロジェクト初期

### mcp-shell-server-v2.cjs / mcp-shell-server.cjs

- **用途**: MCP (Model Context Protocol) サーバー設定
- **参考価値**: Claude統合の詳細設定
- **作成時期**: 開発環境構築時

## 📂 scripts/

### check-status.sh

- **用途**: プロジェクト全体の状況確認スクリプト
- **参考価値**: デバッグ時の状況確認方法
- **機能**: 引き継ぎ文書、Windsurf状況、エラー、ビルド状態の一括確認

### handover_check.sh

- **用途**: TypeScript修正時の引き継ぎ確認スクリプト
- **参考価値**: エラー削減の進捗確認方法
- **機能**: TypeScriptエラー確認と修正優先度表示

### typescript_check_script.sh

- **用途**: TypeScriptエラーの詳細チェック
- **参考価値**: 型エラー解決の参考
- **機能**: tscコマンドとエラー分析

---

## 🗑️ 削除されたファイル

以下のファイルは一時的で参考価値が低いため削除されました：

- check_errors.sh - 簡易エラーチェック
- conflict-resolver.sh - マージ競合の一時解決
- emergency-fix.sh - 緊急修正用の一時スクリプト
- eslint-complete-fix.sh - ESLint修正の一時対応
- final_check.sh - 最終チェックの一時スクリプト
- handover-status-check.sh - 引き継ぎ状況の一時確認
- merge-branches.sh - ブランチマージの一時処理
- next-claude-setup.sh - Claude設定の一時スクリプト
- progress_check_script.sh - 進捗確認の一時処理
- quick_check.sh - クイックチェックの一時スクリプト
- recovery-script.sh - 復旧処理の一時スクリプト
- safe-merge-phase2.sh - マージフェーズ2の一時処理
- unify-project.sh - プロジェクト統合の一時処理

---

**アーカイブ作成日**: 2025-06-05  
**整理担当**: Claude AI (Session 3)  
**目的**: ルートディレクトリのクリーン化と参考価値のある資料保管
