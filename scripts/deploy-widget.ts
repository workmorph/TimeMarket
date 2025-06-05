#!/usr/bin/env node

/**
 * ウィジェットライブラリのCDNデプロイスクリプト
 *
 * このスクリプトは以下の処理を行います：
 * 1. ウィジェットライブラリのビルド
 * 2. バージョン番号の更新
 * 3. Cloudflare Pages/R2へのデプロイ
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

// 環境変数の読み込み
dotenv.config({ path: ".env.local" });

// 設定
const WIDGET_SRC_DIR = path.resolve(__dirname, "../src/widget");
const WIDGET_DIST_DIR = path.resolve(__dirname, "../dist/widget");
const PACKAGE_JSON_PATH = path.resolve(__dirname, "../package.json");

// バージョン管理
function updateVersion(type = "patch") {
  console.log("📦 バージョン更新中...");

  // package.jsonからバージョン情報を取得
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
  const currentVersion = packageJson.version;
  console.log(`現在のバージョン: ${currentVersion}`);

  // バージョンを分解
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  // バージョンの更新
  let newVersion;
  switch (type) {
    case "major":
      newVersion = `${major + 1}.0.0`;
      break;
    case "minor":
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case "patch":
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }

  // package.jsonの更新
  packageJson.version = newVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));

  // ウィジェットのバージョン更新
  const widgetIndexPath = path.join(WIDGET_SRC_DIR, "index.ts");
  let widgetIndex = fs.readFileSync(widgetIndexPath, "utf8");
  widgetIndex = widgetIndex.replace(/version: ['"].*?['"]/g, `version: '${newVersion}'`);
  fs.writeFileSync(widgetIndexPath, widgetIndex);

  console.log(`✅ バージョンを ${newVersion} に更新しました`);
  return newVersion;
}

// ビルド処理
function buildWidget() {
  console.log("🔨 ウィジェットをビルド中...");
  try {
    execSync("npm run build:widget", { stdio: "inherit" });
    console.log("✅ ビルド完了");
    return true;
  } catch (error: unknown) {
    console.error("❌ ビルド失敗:", error);
    return false;
  }
}

// CDNへのデプロイ
async function deployToCloudflare(version: string) {
  console.log("🚀 Cloudflareにデプロイ中...");

  // 環境変数からCloudflare認証情報を取得
  const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
    console.error(
      "❌ Cloudflare認証情報が設定されていません。.env.localファイルを確認してください。"
    );
    return false;
  }

  try {
    // wrangler CLIを使用してCloudflare R2にアップロード
    // 注: wranglerのインストールが必要 (npm install -g wrangler)
    console.log(`バージョン ${version} をデプロイ中...`);

    // バージョン付きディレクトリとlatestディレクトリの両方にデプロイ
    execSync(
      `wrangler r2 object put timebid-cdn/widget/${version}/ --path ${WIDGET_DIST_DIR}/* --recursive`,
      {
        stdio: "inherit",
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN: CF_API_TOKEN,
          CLOUDFLARE_ACCOUNT_ID: CF_ACCOUNT_ID,
        },
      }
    );

    execSync(
      `wrangler r2 object put timebid-cdn/widget/latest/ --path ${WIDGET_DIST_DIR}/* --recursive`,
      {
        stdio: "inherit",
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN: CF_API_TOKEN,
          CLOUDFLARE_ACCOUNT_ID: CF_ACCOUNT_ID,
        },
      }
    );

    console.log("✅ デプロイ完了");

    // CDN URLの表示
    console.log("\n📋 ウィジェット埋め込みコード:");
    console.log(`
<!-- 最新バージョンを使用 -->
<script src="https://cdn.timebid.com/widget/latest/timebid-widget.iife.js"></script>

<!-- 特定バージョンを使用 (推奨) -->
<script src="https://cdn.timebid.com/widget/${version}/timebid-widget.iife.js"></script>

<!-- 初期化 -->
<div id="timebid-container"></div>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const widget = TimeBid.createWidget({
      apiKey: 'YOUR_API_KEY',
      containerId: 'timebid-container',
      theme: {
        primaryColor: '#3498db',
        secondaryColor: '#2ecc71',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '8px'
      },
      onBidPlaced: function(bid) {
        console.log('New bid placed:', bid);
      }
    });
  });
</script>
`);

    return true;
  } catch (error: unknown) {
    console.error("❌ デプロイ失敗:", error);
    return false;
  }
}

// メイン処理
async function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || "patch";

  console.log("🚀 TimeBid ウィジェットデプロイツール");
  console.log("=====================================");

  // バージョン更新
  const newVersion = updateVersion(versionType);

  // ビルド
  const buildSuccess = buildWidget();
  if (!buildSuccess) {
    process.exit(1);
  }

  // デプロイ
  const deploySuccess = await deployToCloudflare(newVersion);
  if (!deploySuccess) {
    process.exit(1);
  }

  console.log("\n🎉 全ての処理が完了しました！");
  console.log(`ウィジェットバージョン ${newVersion} がデプロイされました。`);
}

main().catch((error: unknown) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});
