import { TimeBidWidget } from './TimeBidWidget';

// グローバルに公開するためのインターフェース
interface TimeBidGlobal {
  createWidget: (config: any) => TimeBidWidget;
  version: string;
}

// グローバルオブジェクトの作成
const TimeBid: TimeBidGlobal = {
  createWidget: (config) => new TimeBidWidget(config),
  version: '1.0.0'
};

// グローバルスコープに追加
declare global {
  interface Window {
    TimeBid: TimeBidGlobal;
  }
}

// ブラウザ環境の場合はグローバルに公開
if (typeof window !== 'undefined') {
  window.TimeBid = TimeBid;
}

export default TimeBid;
export { TimeBidWidget };
