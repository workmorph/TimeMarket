(function () {
  "use strict";

  class TimeBidWidget {
    constructor(options) {
      this.container =
        typeof options.container === "string"
          ? document.querySelector(options.container)
          : options.container;

      this.config = Object.assign(
        {
          theme: "light",
          primaryColor: "#0066cc",
          borderRadius: "8px",
          showLogo: true,
          customCSS: "",
        },
        options.config || {}
      );

      this.render();
    }

    render() {
      if (!this.container) {
        console.error("TimeBid Widget: Container not found");
        return;
      }

      const widgetHTML = `
        <div class="timebid-widget" style="
          --primary-color: ${this.config.primaryColor};
          --border-radius: ${this.config.borderRadius};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${this.config.theme === "dark" ? "#1a1a1a" : "#ffffff"};
          color: ${this.config.theme === "dark" ? "#ffffff" : "#333333"};
          border: 1px solid ${this.config.theme === "dark" ? "#333" : "#e5e5e5"};
          border-radius: var(--border-radius);
          padding: 24px;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        ">
          ${
            this.config.showLogo
              ? `
            <div style="
              font-size: 18px;
              font-weight: bold;
              color: var(--primary-color);
              margin-bottom: 16px;
              display: flex;
              align-items: center;
            ">
              <svg style="width: 24px; height: 24px; margin-right: 8px;" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              TimeBid
            </div>
          `
              : ""
          }
          
          <div class="widget-content">
            <h3 style="
              margin: 0 0 12px 0;
              font-size: 20px;
              font-weight: 600;
              color: inherit;
            ">専門家の時間をオークション</h3>
            
            <p style="
              margin: 0 0 20px 0;
              font-size: 14px;
              color: ${this.config.theme === "dark" ? "#cccccc" : "#666666"};
              line-height: 1.5;
            ">あなたに最適な専門家を見つけて、<br>価値ある時間を共有しましょう</p>
            
            <button class="widget-cta" style="
              background: var(--primary-color);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: var(--border-radius);
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              width: 100%;
              transition: all 0.2s ease;
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,102,204,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              今すぐ始める
            </button>
          </div>
          
          <style>
            ${this.config.customCSS}
          </style>
        </div>
      `;

      this.container.innerHTML = widgetHTML;
      this.attachEventListeners();
    }

    attachEventListeners() {
      const ctaButton = this.container.querySelector(".widget-cta");
      if (ctaButton) {
        ctaButton.addEventListener("click", () => {
          window.open("https://timebid.jp/auctions", "_blank");
        });
      }
    }

    static init(config) {
      const containers = document.querySelectorAll("[data-timebid-widget]");
      containers.forEach((container) => {
        new TimeBidWidget({ container, config });
      });
    }
  }

  // Global export
  window.TimeBidWidget = TimeBidWidget;

  // Auto-initialize if data attributes found
  document.addEventListener("DOMContentLoaded", () => {
    const autoWidgets = document.querySelectorAll("[data-timebid-widget]");
    if (autoWidgets.length > 0) {
      TimeBidWidget.init({});
    }
  });
})();
