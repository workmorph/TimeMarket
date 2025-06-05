import TimeBidWidget from "./TimeBidWidget";

interface WidgetConfig {
  theme: "light" | "dark";
  primaryColor: string;
  borderRadius: string;
  showLogo: boolean;
  customCSS: string;
}

interface WidgetOptions {
  container: string | HTMLElement;
  config: WidgetConfig;
}

// グローバルに公開するためのインターフェース
interface TimeBidGlobal {
  createWidget: (options: WidgetOptions) => TimeBidWidget;
  version: string;
}

// グローバルオブジェクトの作成
const TimeBid: TimeBidGlobal = {
  createWidget: (options) => new TimeBidWidget(options),
  version: "1.0.0",
};

// グローバルスコープに追加
declare global {
  interface Window {
    TimeBid: TimeBidGlobal;
  }
}

// ブラウザ環境の場合はグローバルに公開
if (typeof window !== "undefined") {
  window.TimeBid = TimeBid;
}

export default TimeBid;
export { TimeBidWidget };
