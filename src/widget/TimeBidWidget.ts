/**
 * TimeBidWidget - 外部サイトに埋め込み可能なオークションウィジェット
 */

interface WidgetConfig {
  apiKey: string;
  containerId: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    darkMode?: boolean;
  };
  features?: {
    showBidHistory?: boolean;
    enableAutoRefresh?: boolean;
    refreshInterval?: number;
    showCountdown?: boolean;
    enableNotifications?: boolean;
  };
  layout?: {
    style?: 'card' | 'list' | 'compact' | 'detailed';
    columns?: number;
    maxHeight?: string;
  };
  locale?: 'ja' | 'en';
  baseUrl?: string;
  onBidPlaced?: (bid: any) => void;
  onAuctionEnd?: (auction: any) => void;
  onWidgetLoad?: () => void;
  onError?: (error: Error) => void;
}

interface WidgetMessage {
  type: string;
  height?: number;
  bid?: any;
  auction?: any;
  error?: string;
}

export class TimeBidWidget {
  private config: WidgetConfig;
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLElement | null = null;
  private isConnected: boolean = false;

  constructor(config: WidgetConfig) {
    this.config = {
      apiKey: config.apiKey,
      containerId: config.containerId,
      theme: config.theme || {},
      features: config.features || {
        showBidHistory: true,
        enableAutoRefresh: true,
        refreshInterval: 30,
        showCountdown: true,
        enableNotifications: true
      },
      layout: config.layout || {
        style: 'card',
        columns: 2
      },
      locale: config.locale || 'ja',
      baseUrl: config.baseUrl || 'https://api.timebid.com',
      onBidPlaced: config.onBidPlaced,
      onAuctionEnd: config.onAuctionEnd,
      onWidgetLoad: config.onWidgetLoad,
      onError: config.onError
    };
    this.init();
  }

  /**
   * ウィジェットの初期化
   */
  private init(): void {
    try {
      this.container = document.getElementById(this.config.containerId);
      if (!this.container) {
        throw new Error(`Container with ID '${this.config.containerId}' not found`);
      }
      
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error('TimeBid Widget initialization error:', error);
      this.renderError((error as Error).message);
    }
  }

  /**
   * ウィジェットのレンダリング
   */
  private render(): void {
    if (!this.container) return;

    // 既存のコンテンツをクリア
    this.container.innerHTML = '';
    
    // ウィジェットのスタイルを適用
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.minHeight = '400px';
    
    // ローディングインジケータ
    const loader = document.createElement('div');
    loader.style.position = 'absolute';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.backgroundColor = '#f9f9f9';
    loader.style.zIndex = '1';
    loader.innerHTML = '<div style="width: 40px; height: 40px; border: 3px solid #ddd; border-top-color: #3498db; border-radius: 50%; animation: timebid-spin 1s linear infinite;"></div>';
    
    // アニメーションのスタイルを追加
    const style = document.createElement('style');
    style.textContent = '@keyframes timebid-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    
    this.container.appendChild(loader);
    
    // iframeの作成
    const iframe = document.createElement('iframe');
    const configParams = new URLSearchParams({
      key: this.config.apiKey,
      theme: JSON.stringify(this.config.theme),
      features: JSON.stringify(this.config.features),
      layout: JSON.stringify(this.config.layout),
      locale: this.config.locale || 'ja'
    });
    iframe.src = `${this.config.baseUrl}/widget?${configParams.toString()}`;
    iframe.style.width = '100%';
    iframe.style.height = this.config.layout?.maxHeight || '400px';
    iframe.style.border = 'none';
    iframe.style.position = 'relative';
    iframe.style.zIndex = '2';
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.3s ease';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
    iframe.setAttribute('title', 'TimeBid Auction Widget');
    iframe.setAttribute('loading', 'lazy');
    
    this.container.appendChild(iframe);
    this.iframe = iframe;
    
    // iframeの読み込みが完了したらローディングを非表示
    iframe.onload = () => {
      iframe.style.opacity = '1';
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
        this.config.onWidgetLoad?.();
      }, 300);
    };
  }

  /**
   * イベントリスナーの設定
   */
  private setupEventListeners(): void {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * メッセージハンドラー
   */
  private handleMessage(event: MessageEvent): void {
    // オリジン検証
    if (event.origin !== this.config.baseUrl) return;
    
    const data = event.data as WidgetMessage;
    
    switch(data.type) {
      case 'TIMEBID_RESIZE':
        if (this.iframe && data.height) {
          this.iframe.style.height = `${data.height}px`;
        }
        break;
      case 'TIMEBID_BID_PLACED':
        if (data.bid) {
          this.config.onBidPlaced?.(data.bid);
        }
        break;
      case 'TIMEBID_AUCTION_END':
        if (data.auction) {
          this.config.onAuctionEnd?.(data.auction);
        }
        break;
      case 'TIMEBID_CONNECTED':
        this.isConnected = true;
        console.log('Widget connected to TimeBid server');
        break;
      case 'TIMEBID_ERROR':
        console.error('TimeBid Widget error:', data.error);
        this.config.onError?.(new Error(data.error || 'Unknown error'));
        break;
    }
  }

  /**
   * エラーメッセージの表示
   */
  private renderError(message: string): void {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    const errorElement = document.createElement('div');
    errorElement.style.padding = '20px';
    errorElement.style.color = '#721c24';
    errorElement.style.backgroundColor = '#f8d7da';
    errorElement.style.border = '1px solid #f5c6cb';
    errorElement.style.borderRadius = '4px';
    errorElement.style.textAlign = 'center';
    errorElement.innerHTML = `<strong>TimeBid Widget Error:</strong> ${message}`;
    
    this.container.appendChild(errorElement);
  }

  /**
   * ウィジェットの更新
   */
  public refresh(): void {
    this.init();
  }

  /**
   * ウィジェットの接続状態を確認
   */
  public isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * ウィジェットの破棄
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.iframe = null;
    this.isConnected = false;
  }
}
