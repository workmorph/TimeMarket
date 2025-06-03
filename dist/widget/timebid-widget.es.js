class TimeBidWidget {
  constructor(config) {
    this.iframe = null;
    this.container = null;
    this.isConnected = false;
    this.config = {
      apiKey: config.apiKey,
      containerId: config.containerId,
      theme: config.theme || {},
      baseUrl: config.baseUrl || "https://api.timebid.com",
      onBidPlaced: config.onBidPlaced,
      onAuctionEnd: config.onAuctionEnd,
      onWidgetLoad: config.onWidgetLoad
    };
    this.init();
  }
  /**
   * ウィジェットの初期化
   */
  init() {
    try {
      this.container = document.getElementById(this.config.containerId);
      if (!this.container) {
        throw new Error(`Container with ID '${this.config.containerId}' not found`);
      }
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error("TimeBid Widget initialization error:", error);
      this.renderError(error.message);
    }
  }
  /**
   * ウィジェットのレンダリング
   */
  render() {
    if (!this.container) return;
    this.container.innerHTML = "";
    this.container.style.position = "relative";
    this.container.style.overflow = "hidden";
    this.container.style.minHeight = "400px";
    const loader = document.createElement("div");
    loader.style.position = "absolute";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.backgroundColor = "#f9f9f9";
    loader.style.zIndex = "1";
    loader.innerHTML = '<div style="width: 40px; height: 40px; border: 3px solid #ddd; border-top-color: #3498db; border-radius: 50%; animation: timebid-spin 1s linear infinite;"></div>';
    const style = document.createElement("style");
    style.textContent = "@keyframes timebid-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
    document.head.appendChild(style);
    this.container.appendChild(loader);
    const iframe = document.createElement("iframe");
    iframe.src = `${this.config.baseUrl}/widget?key=${this.config.apiKey}&theme=${encodeURIComponent(JSON.stringify(this.config.theme))}`;
    iframe.style.width = "100%";
    iframe.style.height = "400px";
    iframe.style.border = "none";
    iframe.style.position = "relative";
    iframe.style.zIndex = "2";
    iframe.style.opacity = "0";
    iframe.style.transition = "opacity 0.3s ease";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
    iframe.setAttribute("title", "TimeBid Auction Widget");
    this.container.appendChild(iframe);
    this.iframe = iframe;
    iframe.onload = () => {
      iframe.style.opacity = "1";
      setTimeout(() => {
        var _a, _b;
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
        (_b = (_a = this.config).onWidgetLoad) == null ? void 0 : _b.call(_a);
      }, 300);
    };
  }
  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    window.addEventListener("message", this.handleMessage.bind(this));
  }
  /**
   * メッセージハンドラー
   */
  handleMessage(event) {
    var _a, _b, _c, _d;
    if (event.origin !== this.config.baseUrl) return;
    const data = event.data;
    switch (data.type) {
      case "TIMEBID_RESIZE":
        if (this.iframe && data.height) {
          this.iframe.style.height = `${data.height}px`;
        }
        break;
      case "TIMEBID_BID_PLACED":
        if (data.bid) {
          (_b = (_a = this.config).onBidPlaced) == null ? void 0 : _b.call(_a, data.bid);
        }
        break;
      case "TIMEBID_AUCTION_END":
        if (data.auction) {
          (_d = (_c = this.config).onAuctionEnd) == null ? void 0 : _d.call(_c, data.auction);
        }
        break;
      case "TIMEBID_CONNECTED":
        this.isConnected = true;
        console.log("Widget connected to TimeBid server");
        break;
      case "TIMEBID_ERROR":
        console.error("TimeBid Widget error:", data.error);
        break;
    }
  }
  /**
   * エラーメッセージの表示
   */
  renderError(message) {
    if (!this.container) return;
    this.container.innerHTML = "";
    const errorElement = document.createElement("div");
    errorElement.style.padding = "20px";
    errorElement.style.color = "#721c24";
    errorElement.style.backgroundColor = "#f8d7da";
    errorElement.style.border = "1px solid #f5c6cb";
    errorElement.style.borderRadius = "4px";
    errorElement.style.textAlign = "center";
    errorElement.innerHTML = `<strong>TimeBid Widget Error:</strong> ${message}`;
    this.container.appendChild(errorElement);
  }
  /**
   * ウィジェットの更新
   */
  refresh() {
    this.init();
  }
  /**
   * ウィジェットの接続状態を確認
   */
  isConnectedToServer() {
    return this.isConnected;
  }
  /**
   * ウィジェットの破棄
   */
  destroy() {
    window.removeEventListener("message", this.handleMessage.bind(this));
    if (this.container) {
      this.container.innerHTML = "";
    }
    this.iframe = null;
    this.isConnected = false;
  }
}
const TimeBid = {
  createWidget: (config) => new TimeBidWidget(config),
  version: "1.0.0"
};
if (typeof window !== "undefined") {
  window.TimeBid = TimeBid;
}
export {
  TimeBidWidget,
  TimeBid as default
};
//# sourceMappingURL=timebid-widget.es.js.map
