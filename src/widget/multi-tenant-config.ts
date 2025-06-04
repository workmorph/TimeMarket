/**
 * マルチテナント対応ウィジェット設定
 * 複数サイトでのウィジェット展開を管理
 */

import { WidgetConfig, TenantSettings, PLANS } from '@/config/widget-config';

// セキュリティ設定
export interface SecurityConfig {
  allowedOrigins: string[];
  csrfToken?: string;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  contentSecurityPolicy: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    connectSrc: string[];
    frameSrc: string[];
  };
}

// ウィジェット埋め込み設定
export interface EmbedConfig {
  tenantId: string;
  domain: string;
  apiKey: string;
  widgetConfig: WidgetConfig;
  security: SecurityConfig;
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  customization: {
    allowCustomCSS: boolean;
    allowCustomJS: boolean;
    customCSS?: string;
    customJS?: string;
  };
}

// ウィジェットのサイズ制限
export const WIDGET_SIZE_LIMITS = {
  maxSizeKB: 50,
  maxCustomCSSKB: 10,
  maxCustomJSKB: 20
};

// デフォルトのセキュリティ設定
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  allowedOrigins: ['*'], // 本番環境では具体的なドメインを指定
  rateLimit: {
    maxRequests: 60,
    windowMs: 60000 // 1分間
  },
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://widget.timebid.jp'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.timebid.jp', 'wss://realtime.timebid.jp'],
    frameSrc: ["'self'", 'https://widget.timebid.jp']
  }
};

// テナント固有の設定を生成
export function generateTenantConfig(tenant: TenantSettings): Partial<EmbedConfig> {
  const plan = PLANS[tenant.plan];
  
  return {
    security: {
      ...DEFAULT_SECURITY_CONFIG,
      rateLimit: {
        maxRequests: plan.limits.apiCallsPerMinute,
        windowMs: 60000
      }
    },
    analytics: {
      enabled: plan.features.analytics
    },
    customization: {
      allowCustomCSS: plan.features.customTheme,
      allowCustomJS: plan.features.whiteLabel
    }
  };
}

// ウィジェット設定の検証
export function validateWidgetConfig(config: WidgetConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // APIキーの検証
  if (!config.apiKey || config.apiKey.length < 20) {
    errors.push('APIキーが無効です');
  }

  // コンテナIDの検証
  if (!config.containerId) {
    errors.push('コンテナIDが指定されていません');
  }

  // テーマカラーの検証
  if (config.theme?.primaryColor && !isValidColor(config.theme.primaryColor)) {
    errors.push('プライマリカラーが無効です');
  }

  // リフレッシュ間隔の検証
  const refreshInterval = config.features?.refreshInterval;
  if (refreshInterval && (refreshInterval < 10 || refreshInterval > 300)) {
    errors.push('リフレッシュ間隔は10〜300秒の間で設定してください');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// CSPヘッダーの生成
export function generateCSPHeader(config: SecurityConfig): string {
  const policies = [];
  
  for (const [directive, sources] of Object.entries(config.contentSecurityPolicy)) {
    const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
    policies.push(`${directiveName} ${sources.join(' ')}`);
  }
  
  return policies.join('; ');
}

// オリジン検証
export function validateOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.includes('*')) {
    return true;
  }
  
  return allowedOrigins.some(allowed => {
    if (allowed.startsWith('*.')) {
      // ワイルドカードドメインの処理
      const domain = allowed.substring(2);
      return origin.endsWith(domain) || origin === `https://${domain}` || origin === `http://${domain}`;
    }
    return origin === allowed;
  });
}

// ウィジェットのサイズ計算
export function calculateWidgetSize(config: EmbedConfig): number {
  let totalSize = 45; // 基本ウィジェットのサイズ（KB）
  
  if (config.customization.customCSS) {
    totalSize += Buffer.byteLength(config.customization.customCSS, 'utf8') / 1024;
  }
  
  if (config.customization.customJS) {
    totalSize += Buffer.byteLength(config.customization.customJS, 'utf8') / 1024;
  }
  
  return Math.round(totalSize * 100) / 100;
}

// カラー検証ヘルパー
function isValidColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  
  return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
}

// ウィジェット設定のサニタイズ
export function sanitizeWidgetConfig(config: WidgetConfig): WidgetConfig {
  const sanitized = { ...config };
  
  // XSS対策: 危険な文字列を除去
  if (sanitized.theme?.fontFamily) {
    sanitized.theme.fontFamily = sanitized.theme.fontFamily.replace(/[<>]/g, '');
  }
  
  return sanitized;
}

// テナント間でのウィジェット設定共有を防ぐ
export function isolateTenantConfig(config: EmbedConfig, tenantId: string): EmbedConfig {
  if (config.tenantId !== tenantId) {
    throw new Error('Unauthorized access to tenant configuration');
  }
  
  return {
    ...config,
    tenantId, // 常に正しいテナントIDを保証
  };
}