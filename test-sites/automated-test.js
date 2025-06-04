// Playwright使用の自動テスト
const { test, expect } = require('@playwright/test');
const { chromium, firefox, webkit } = require('playwright');

// テスト設定
const TEST_CONFIG = {
  baseURL: 'http://localhost:3000/test-sites',
  apiKey: 'test_api_key_12345',
  timeout: 30000,
  browsers: ['chromium', 'firefox', 'webkit']
};

// ビューポート設定
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

// テストスイート: 基本機能
test.describe('TimeBidウィジェット - 基本機能テスト', () => {
  test('ウィジェットの読み込みと初期化', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/basic-html/index.html`);
    
    // ウィジェットスクリプトの読み込み確認
    await page.waitForFunction(() => window.TimeBid !== undefined, { timeout: 10000 });
    
    // ウィジェットコンテナの存在確認
    const container = await page.locator('#timebid-container');
    await expect(container).toBeVisible();
    
    // ウィジェットの初期化確認
    const widgetInitialized = await page.evaluate(() => {
      return document.querySelector('#timebid-container').children.length > 0;
    });
    expect(widgetInitialized).toBeTruthy();
  });

  test('APIキー認証', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/basic-functionality.html`);
    
    // APIキー認証の結果を待つ
    await page.waitForSelector('.success', { timeout: 15000 });
    
    // 認証成功の確認
    const authStatus = await page.locator('#api-auth .success').textContent();
    expect(authStatus).toContain('APIキー認証成功');
  });

  test('オークション一覧の表示', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/basic-html/index.html`);
    
    // オークション一覧の読み込みを待つ
    await page.waitForSelector('.auction-list', { timeout: 20000 });
    
    // オークションアイテムの存在確認
    const auctionItems = await page.locator('.auction-item').count();
    expect(auctionItems).toBeGreaterThan(0);
  });
});

// テストスイート: レスポンシブデザイン
test.describe('TimeBidウィジェット - レスポンシブテスト', () => {
  Object.entries(VIEWPORTS).forEach(([device, viewport]) => {
    test(`${device}表示での動作確認`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: viewport
      });
      const page = await context.newPage();
      
      await page.goto(`${TEST_CONFIG.baseURL}/test-cases/responsive.html`);
      
      // ウィジェットの読み込み
      await page.waitForFunction(() => window.TimeBid !== undefined);
      
      // ビューポート切り替えボタンをクリック
      await page.click(`button[onclick="setViewport('${device}')"]`);
      
      // レイアウトの確認
      const containerWidth = await page.evaluate(() => {
        return document.querySelector('#timebid-container').offsetWidth;
      });
      
      // コンテナ幅が適切に調整されているか確認
      if (device === 'mobile') {
        expect(containerWidth).toBeLessThanOrEqual(375);
      } else if (device === 'tablet') {
        expect(containerWidth).toBeLessThanOrEqual(768);
      }
      
      await context.close();
    });
  });
});

// テストスイート: ブラウザ互換性
test.describe('TimeBidウィジェット - ブラウザ互換性テスト', () => {
  const browsers = {
    chromium: chromium,
    firefox: firefox,
    webkit: webkit
  };

  Object.entries(browsers).forEach(([browserName, browserType]) => {
    test(`${browserName}での動作確認`, async () => {
      const browser = await browserType.launch();
      const page = await browser.newPage();
      
      await page.goto(`${TEST_CONFIG.baseURL}/basic-html/index.html`);
      
      // ウィジェットの読み込み確認
      const widgetLoaded = await page.waitForFunction(
        () => window.TimeBid !== undefined,
        { timeout: 10000 }
      ).then(() => true).catch(() => false);
      
      expect(widgetLoaded).toBeTruthy();
      
      // 基本的な機能の確認
      const widgetContainer = await page.locator('#timebid-container');
      await expect(widgetContainer).toBeVisible();
      
      await browser.close();
    });
  });
});

// テストスイート: セキュリティ
test.describe('TimeBidウィジェット - セキュリティテスト', () => {
  test('XSS攻撃への耐性', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/security.html`);
    
    // XSSテストボタンをクリック
    await page.click('button[onclick="testXSS()"]');
    
    // XSS攻撃がブロックされたことを確認
    await page.waitForSelector('.test-result.success');
    const results = await page.locator('.test-result.success').count();
    expect(results).toBeGreaterThan(0);
    
    // アラートが表示されていないことを確認
    let alertShown = false;
    page.on('dialog', () => {
      alertShown = true;
    });
    
    await page.waitForTimeout(2000);
    expect(alertShown).toBeFalsy();
  });

  test('無効なAPIキーの処理', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/security.html`);
    
    // 無効APIキーテストボタンをクリック
    await page.click('button[onclick="testInvalidAPI()"]');
    
    // エラーが適切に処理されたことを確認
    await page.waitForSelector('.test-result.success');
    const invalidKeyResults = await page.locator('#invalid-api-test .test-result.success').count();
    expect(invalidKeyResults).toBeGreaterThan(0);
  });

  test('Content Security Policy準拠', async ({ page }) => {
    // CSPエラーの監視
    const cspViolations = [];
    page.on('console', msg => {
      if (msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/security.html`);
    
    // CSPテストボタンをクリック
    await page.click('button[onclick="testCSP()"]');
    
    // CSPが適切に機能していることを確認
    await page.waitForSelector('.test-result');
    
    // 重大なCSP違反がないことを確認
    const criticalViolations = cspViolations.filter(v => 
      v.includes('script-src') && !v.includes('unsafe-inline')
    );
    expect(criticalViolations.length).toBe(0);
  });
});

// テストスイート: ネットワークエラー処理
test.describe('TimeBidウィジェット - ネットワークエラー処理', () => {
  test('オフライン時の動作', async ({ page, context }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/network-errors.html`);
    
    // ウィジェットの初期化を待つ
    await page.waitForTimeout(2000);
    
    // オフラインモードに切り替え
    await context.setOffline(true);
    await page.click('button[onclick="simulateOffline()"]');
    
    // オフライン状態の確認
    const statusText = await page.locator('#status-text').textContent();
    expect(statusText).toBe('オフライン');
    
    // エラーログの確認
    const errorLogs = await page.locator('.log-error, .log-warning').count();
    expect(errorLogs).toBeGreaterThan(0);
    
    // オンラインに復帰
    await context.setOffline(false);
    await page.click('button[onclick="simulateOnline()"]');
    
    // 復帰の確認
    await page.waitForSelector('.log-success');
  });

  test('タイムアウト処理', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/network-errors.html`);
    
    // タイムアウトテストを実行
    await page.click('button[onclick="testTimeout()"]');
    
    // タイムアウトエラーの発生を確認
    await page.waitForSelector('#timeout-test-result', { timeout: 10000 });
    const result = await page.locator('#timeout-test-result').textContent();
    expect(result).toContain('タイムアウト');
  });

  test('再試行ロジック', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/test-cases/network-errors.html`);
    
    // 再試行テストを実行
    await page.click('button[onclick="testRetryLogic()"]');
    
    // 再試行が成功することを確認
    await page.waitForSelector('#retry-test-result', { timeout: 15000 });
    const result = await page.locator('#retry-test-result').textContent();
    expect(result).toContain('成功');
    
    // 複数回の試行があったことを確認
    const retryLogs = await page.locator('.log-warning:has-text("再試行")').count();
    expect(retryLogs).toBeGreaterThan(0);
  });
});

// テストスイート: パフォーマンス
test.describe('TimeBidウィジェット - パフォーマンステスト', () => {
  test('初期読み込み時間', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${TEST_CONFIG.baseURL}/basic-html/index.html`);
    
    // ウィジェットの完全な読み込みを待つ
    await page.waitForFunction(() => {
      const container = document.querySelector('#timebid-container');
      return container && container.children.length > 0;
    }, { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // 初期読み込みが3秒以内に完了することを確認
    expect(loadTime).toBeLessThan(3000);
    
    // パフォーマンスメトリクスの取得
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      const widgetScript = resources.find(r => r.name.includes('timebid-widget'));
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        scriptLoadTime: widgetScript ? widgetScript.duration : 0,
        totalResources: resources.length
      };
    });
    
    // スクリプトの読み込みが1秒以内であることを確認
    expect(metrics.scriptLoadTime).toBeLessThan(1000);
  });

  test('メモリ使用量', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseURL}/basic-html/index.html`);
    
    // 初期メモリ使用量を記録
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // ウィジェットの操作をシミュレート
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        // ウィジェットのリフレッシュや操作をシミュレート
        if (window.TimeBid && window.TimeBid.refresh) {
          window.TimeBid.refresh();
        }
      });
      await page.waitForTimeout(500);
    }
    
    // 最終メモリ使用量を記録
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // メモリリークがないことを確認（10MB以上の増加がない）
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });
});

// テスト実行関数
async function runAllTests() {
  console.log('TimeBidウィジェット自動テストを開始します...');
  
  try {
    // Playwrightのテストランナーを使用
    const { execSync } = require('child_process');
    execSync('npx playwright test', { stdio: 'inherit' });
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スタンドアロン実行時
if (require.main === module) {
  runAllTests();
}

module.exports = {
  TEST_CONFIG,
  VIEWPORTS,
  runAllTests
};