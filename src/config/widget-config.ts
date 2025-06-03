// TimeBid Widget Configuration for Multi-tenant SaaS

export interface WidgetConfig {
  // 必須設定
  apiKey: string;
  containerId: string;
  
  // テーマ設定
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: 'none' | 'sm' | 'md' | 'lg';
    darkMode?: boolean;
  };
  
  // 機能設定
  features?: {
    showBidHistory?: boolean;
    enableAutoRefresh?: boolean;
    refreshInterval?: number; // 秒
    showCountdown?: boolean;
    enableNotifications?: boolean;
  };
  
  // レイアウト設定
  layout?: {
    style: 'card' | 'list' | 'compact' | 'detailed';
    columns?: 1 | 2 | 3 | 4;
    maxHeight?: string;
  };
  
  // 言語設定
  locale?: 'ja' | 'en';
  
  // コールバック
  callbacks?: {
    onBidPlaced?: (bid: BidInfo) => void;
    onAuctionEnd?: (auction: AuctionInfo) => void;
    onError?: (error: Error) => void;
  };
}

// テナント設定
export interface TenantSettings {
  id: string;
  name: string;
  plan: 'starter' | 'pro' | 'enterprise';
  limits: {
    monthlyAuctions: number;
    apiCallsPerMinute: number;
    customDomains: number;
    dataRetentionDays: number;
  };
  features: {
    customTheme: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    whiteLabel: boolean;
    analytics: boolean;
  };
  billing: {
    plan: string;
    amount: number;
    currency: 'JPY';
    interval: 'month' | 'year';
    nextBillingDate: Date;
  };
}

// プラン定義
export const PLANS = {
  starter: {
    name: 'スターター',
    price: 9800,
    limits: {
      monthlyAuctions: 100,
      apiCallsPerMinute: 60,
      customDomains: 1,
      dataRetentionDays: 30
    },
    features: {
      customTheme: false,
      apiAccess: false,
      webhooks: false,
      whiteLabel: false,
      analytics: false
    }
  },
  pro: {
    name: 'プロ',
    price: 29800,
    limits: {
      monthlyAuctions: -1, // 無制限
      apiCallsPerMinute: 300,
      customDomains: 5,
      dataRetentionDays: 90
    },
    features: {
      customTheme: true,
      apiAccess: true,
      webhooks: true,
      whiteLabel: false,
      analytics: true
    }
  },
  enterprise: {
    name: 'エンタープライズ',
    price: -1, // カスタム価格
    limits: {
      monthlyAuctions: -1,
      apiCallsPerMinute: -1,
      customDomains: -1,
      dataRetentionDays: -1
    },
    features: {
      customTheme: true,
      apiAccess: true,
      webhooks: true,
      whiteLabel: true,
      analytics: true
    }
  }
};

// デフォルトウィジェット設定
export const DEFAULT_WIDGET_CONFIG: Partial<WidgetConfig> = {
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#60A5FA',
    fontFamily: 'Noto Sans JP, sans-serif',
    borderRadius: 'md',
    darkMode: false
  },
  features: {
    showBidHistory: true,
    enableAutoRefresh: true,
    refreshInterval: 30,
    showCountdown: true,
    enableNotifications: true
  },
  layout: {
    style: 'card',
    columns: 2
  },
  locale: 'ja'
};

// ウィジェット初期化コード生成
export function generateEmbedCode(config: { apiKey: string; domain: string }): string {
  return `<!-- TimeBid ウィジェット -->
<div id="timebid-widget"></div>
<script>
  (function(w,d,s,o,f,js,fjs){
    w['TimeBid']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','tb','https://widget.timebid.jp/v1/widget.js'));
  
  tb('init', {
    apiKey: '${config.apiKey}',
    containerId: 'timebid-widget'
  });
</script>`;
}

// 型定義（エクスポート用）
export interface BidInfo {
  id: string;
  auctionId: string;
  amount: number;
  bidderId: string;
  timestamp: Date;
}

export interface AuctionInfo {
  id: string;
  title: string;
  currentBid: number;
  bidCount: number;
  endTime: Date;
  status: 'active' | 'ended' | 'cancelled';
}
