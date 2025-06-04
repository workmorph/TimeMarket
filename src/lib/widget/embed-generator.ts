/**
 * ウィジェット埋め込みコード生成ユーティリティ
 * 複数サイトへの展開用の埋め込みコードを生成
 */

import { WidgetConfig } from '@/config/widget-config'
import { EmbedConfig } from '@/widget/multi-tenant-config'

// 埋め込みオプション
export interface EmbedOptions {
  async?: boolean
  defer?: boolean
  lazyLoad?: boolean
  nonce?: string
  integrity?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  customAttributes?: Record<string, string>
}

// CDN設定
export const CDN_CONFIG = {
  production: 'https://widget.timebid.jp',
  staging: 'https://staging-widget.timebid.jp',
  development: 'http://localhost:3000'
}

// ウィジェットバージョン
export const WIDGET_VERSION = 'v1'

/**
 * 基本的な埋め込みコードを生成
 */
export function generateBasicEmbedCode(
  apiKey: string,
  containerId: string = 'timebid-widget',
  options?: EmbedOptions
): string {
  const scriptAttributes = buildScriptAttributes(options)
  
  return `<!-- TimeBid ウィジェット -->
<div id="${containerId}"></div>
<script${scriptAttributes}>
  (function(w,d,s,o,f,js,fjs){
    w['TimeBid']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','tb','${CDN_CONFIG.production}/${WIDGET_VERSION}/widget.js'));
  
  tb('init', {
    apiKey: '${apiKey}',
    containerId: '${containerId}'
  });
</script>`
}

/**
 * 高度な埋め込みコードを生成（カスタマイズ付き）
 */
export function generateAdvancedEmbedCode(
  config: WidgetConfig,
  options?: EmbedOptions
): string {
  const scriptAttributes = buildScriptAttributes(options)
  const configJson = JSON.stringify(config, null, 2)
  
  return `<!-- TimeBid ウィジェット（カスタマイズ版） -->
<div id="${config.containerId}"></div>
<script${scriptAttributes}>
  (function(w,d,s,o,f,js,fjs){
    w['TimeBid']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','tb','${CDN_CONFIG.production}/${WIDGET_VERSION}/widget.js'));
  
  tb('init', ${configJson});
</script>`
}

/**
 * React/Next.js用のコンポーネントコードを生成
 */
export function generateReactComponent(config: WidgetConfig): string {
  return `import { useEffect } from 'react';

export function TimeBidWidget() {
  useEffect(() => {
    // ウィジェットスクリプトの動的読み込み
    const script = document.createElement('script');
    script.src = '${CDN_CONFIG.production}/${WIDGET_VERSION}/widget.js';
    script.async = true;
    script.onload = () => {
      if (window.TimeBid) {
        window.TimeBid('init', ${JSON.stringify(config, null, 4)});
      }
    };
    document.body.appendChild(script);
    
    return () => {
      // クリーンアップ
      if (window.TimeBid) {
        window.TimeBid('destroy');
      }
      document.body.removeChild(script);
    };
  }, []);
  
  return <div id="${config.containerId}" />;
}`
}

/**
 * Vue.js用のコンポーネントコードを生成
 */
export function generateVueComponent(config: WidgetConfig): string {
  return `<template>
  <div :id="containerId"></div>
</template>

<script>
export default {
  name: 'TimeBidWidget',
  data() {
    return {
      containerId: '${config.containerId}'
    };
  },
  mounted() {
    // ウィジェットスクリプトの動的読み込み
    const script = document.createElement('script');
    script.src = '${CDN_CONFIG.production}/${WIDGET_VERSION}/widget.js';
    script.async = true;
    script.onload = () => {
      if (window.TimeBid) {
        window.TimeBid('init', ${JSON.stringify(config, null, 4)});
      }
    };
    document.body.appendChild(script);
  },
  beforeDestroy() {
    // クリーンアップ
    if (window.TimeBid) {
      window.TimeBid('destroy');
    }
  }
};
</script>`
}

/**
 * WordPress用のショートコードを生成
 */
export function generateWordPressShortcode(apiKey: string): string {
  return `// functions.php に追加
function timebid_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'container_id' => 'timebid-widget',
        'theme' => 'default'
    ), $atts);
    
    $output = '<div id="' . esc_attr($atts['container_id']) . '"></div>';
    $output .= '<script>
        (function(w,d,s,o,f,js,fjs){
            w["TimeBid"]=o;w[o]=w[o]||function(){
            (w[o].q=w[o].q||[]).push(arguments)};
            js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
            js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
        }(window,document,"script","tb","${CDN_CONFIG.production}/${WIDGET_VERSION}/widget.js"));
        
        tb("init", {
            apiKey: "${apiKey}",
            containerId: "' . esc_js($atts['container_id']) . '"
        });
    </script>';
    
    return $output;
}
add_shortcode('timebid', 'timebid_widget_shortcode');

// 使用方法: [timebid container_id="my-widget"]`
}

/**
 * Google Tag Manager用のコードを生成
 */
export function generateGTMCode(config: WidgetConfig): string {
  return `<!-- Google Tag Manager で使用するカスタムHTMLタグ -->
<script>
  (function() {
    // コンテナの作成
    var container = document.createElement('div');
    container.id = '${config.containerId}';
    document.body.appendChild(container);
    
    // ウィジェットスクリプトの読み込み
    var script = document.createElement('script');
    script.src = '${CDN_CONFIG.production}/${WIDGET_VERSION}/widget.js';
    script.async = true;
    script.onload = function() {
      if (window.TimeBid) {
        window.TimeBid('init', ${JSON.stringify(config, null, 4)});
      }
    };
    document.body.appendChild(script);
  })();
</script>`
}

/**
 * NPMパッケージとしてのインストール方法を生成
 */
export function generateNPMInstructions(config: WidgetConfig): string {
  return `# インストール
npm install @timebid/widget

# 使用方法
import { TimeBidWidget } from '@timebid/widget';

const widget = new TimeBidWidget(${JSON.stringify(config, null, 2)});

// ウィジェットの初期化
widget.init();

// イベントリスナーの追加
widget.on('bidPlaced', (bid) => {
  console.log('入札が行われました:', bid);
});

widget.on('auctionEnd', (auction) => {
  console.log('オークションが終了しました:', auction);
});

// ウィジェットの破棄
widget.destroy();`
}

/**
 * テスト用の埋め込みコードを生成
 */
export function generateTestEmbedCode(
  config: WidgetConfig,
  environment: 'development' | 'staging' = 'development'
): string {
  const baseUrl = CDN_CONFIG[environment]
  
  return `<!-- TimeBid ウィジェット（テスト環境） -->
<div id="${config.containerId}"></div>
<script>
  // テスト環境用の設定
  window.TIMEBID_DEBUG = true;
  window.TIMEBID_ENV = '${environment}';
  
  (function(w,d,s,o,f,js,fjs){
    w['TimeBid']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','tb','${baseUrl}/${WIDGET_VERSION}/widget.js'));
  
  tb('init', ${JSON.stringify(config, null, 2)});
  
  // デバッグ情報の出力
  tb('on', 'ready', function() {
    console.log('TimeBid Widget loaded in ${environment} mode');
  });
</script>`
}

/**
 * AMP対応の埋め込みコードを生成
 */
export function generateAMPEmbedCode(config: WidgetConfig): string {
  return `<!-- TimeBid ウィジェット（AMP版） -->
<amp-iframe
  width="600"
  height="400"
  sandbox="allow-scripts allow-same-origin allow-forms"
  layout="responsive"
  frameborder="0"
  src="${CDN_CONFIG.production}/amp/widget?apiKey=${config.apiKey}&config=${encodeURIComponent(JSON.stringify(config))}">
  <amp-img
    layout="fill"
    src="${CDN_CONFIG.production}/images/widget-placeholder.png"
    placeholder>
  </amp-img>
</amp-iframe>`
}

/**
 * スクリプト属性を構築
 */
function buildScriptAttributes(options?: EmbedOptions): string {
  if (!options) return ''
  
  const attributes: string[] = []
  
  if (options.async !== false) attributes.push(' async')
  if (options.defer) attributes.push(' defer')
  if (options.nonce) attributes.push(` nonce="${options.nonce}"`)
  if (options.integrity) attributes.push(` integrity="${options.integrity}"`)
  if (options.crossOrigin) attributes.push(` crossorigin="${options.crossOrigin}"`)
  
  if (options.customAttributes) {
    for (const [key, value] of Object.entries(options.customAttributes)) {
      attributes.push(` data-${key}="${value}"`)
    }
  }
  
  return attributes.join('')
}

/**
 * 埋め込みコードの検証
 */
export function validateEmbedCode(code: string): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // APIキーの存在確認
  if (!code.includes('apiKey')) {
    errors.push('APIキーが設定されていません')
  }
  
  // コンテナIDの確認
  if (!code.includes('containerId') && !code.includes('id=')) {
    warnings.push('コンテナIDが明示的に設定されていません')
  }
  
  // HTTPSの使用確認
  if (code.includes('http://') && !code.includes('localhost')) {
    errors.push('本番環境ではHTTPSを使用してください')
  }
  
  // 非推奨の機能の確認
  if (code.includes('document.write')) {
    warnings.push('document.writeの使用は推奨されません')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}