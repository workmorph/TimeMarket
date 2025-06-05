# 📋 FUTURE_ISSUES.md - 将来UX課題管理

**TimeBidプロジェクト - 将来実装予定課題**

---

## 🎯 **Issue #F001: 時間提供方法の具体的導線設計**

### **概要**

現在のTimeBidは「専門家の時間を取引」するマーケットプレイスだが、実際の時間提供の具体的な方法・導線が未定義。ユーザーエクスペリエンスの根幹に関わる重要課題。

### **現状の課題**

```
オークション成立後のフロー:
入札成立 → ??? → 実際の時間提供 → 完了確認 → 決済確定
           ↑
        ここが未定義
```

### **検討必要項目**

#### **1. 提供方法の選択**

```
オンライン提供:
- Zoom/Google Meet/Teams等の選択
- 専用ルーム自動生成
- 録画・議事録の扱い
- 技術サポート（接続トラブル対応）

対面提供:
- 場所の決定方法（来るか行くか）
- 移動時間・交通費の扱い
- 会議室予約・手配
- 感染症対策・安全配慮
```

#### **2. セッティング自動化**

```
カレンダー統合:
- 空き時間の自動調整
- リマインダー自動送信
- 会議室予約連携
- タイムゾーン自動調整

コミュニケーション:
- 事前準備事項の共有
- 必要資料の交換
- 緊急連絡手段
- 変更・キャンセル対応
```

#### **3. 品質保証・評価**

```
サービス品質:
- 提供内容の事前確認
- 中間チェックポイント
- 成果物の確認方法
- 延長時間の扱い

評価システム:
- 双方向評価（専門家 ⇄ 依頼者）
- 時間厳守・内容満足度
- 継続利用意向
- 改善フィードバック
```

### **技術実装案**

#### **Phase 1: 基本選択UI（2週間）**

```javascript
// 提供方法選択コンポーネント
const DeliveryMethodSelector = () => {
  const [method, setMethod] = useState("online");
  const [location, setLocation] = useState("");

  return (
    <div className="delivery-method-selector">
      <RadioGroup value={method} onChange={setMethod}>
        <RadioButton value="online">
          オンライン提供
          <OnlineProviderConfig />
        </RadioButton>
        <RadioButton value="in-person-their-place">
          対面（依頼者の場所）
          <LocationInput placeholder="住所を入力" />
        </RadioButton>
        <RadioButton value="in-person-my-place">
          対面（専門家の場所）
          <MyLocationSelector />
        </RadioButton>
        <RadioButton value="in-person-neutral">
          対面（中立な場所）
          <NeutralLocationSelector />
        </RadioButton>
      </RadioGroup>

      <TravelTimeCalculator method={method} location={location} />
    </div>
  );
};
```

#### **Phase 2: カレンダー統合（3週間）**

```javascript
// 自動スケジューリング
const AutoScheduler = () => {
  const scheduleSession = async (auctionResult) => {
    // 1. 双方のカレンダー空き時間取得
    const expertAvailability = await getCalendarAvailability(
      auctionResult.expertId
    );
    const clientAvailability = await getCalendarAvailability(
      auctionResult.clientId
    );

    // 2. 重複時間の算出
    const commonSlots = findCommonTimeSlots(
      expertAvailability,
      clientAvailability
    );

    // 3. 移動時間考慮（対面の場合）
    if (auctionResult.deliveryMethod === "in-person") {
      const travelTime = await calculateTravelTime(
        auctionResult.locations.from,
        auctionResult.locations.to
      );
      adjustSlotsForTravel(commonSlots, travelTime);
    }

    // 4. 会議室自動予約（必要な場合）
    if (auctionResult.needsMeetingRoom) {
      const room = await bookMeetingRoom(
        commonSlots[0],
        auctionResult.requirements
      );
      auctionResult.meetingRoom = room;
    }

    // 5. カレンダーイベント作成
    await createCalendarEvents(auctionResult, commonSlots[0]);

    // 6. 事前準備通知
    await sendPreparationNotifications(auctionResult);
  };
};
```

#### **Phase 3: 高度な機能（4週間）**

```javascript
// 品質保証システム
const QualityAssurance = () => {
  const trackSessionQuality = async (sessionId) => {
    // 1. リアルタイム進捗tracking
    const progress = await trackProgress(sessionId);

    // 2. 中間チェックポイント
    if (progress.timeElapsed > progress.totalTime * 0.5) {
      await sendMidpointCheck(sessionId);
    }

    // 3. 成果物確認
    const deliverables = await checkDeliverables(sessionId);

    // 4. 双方向評価
    await initiateEvaluation(sessionId);

    // 5. 決済確定判断
    if (deliverables.approved && progress.completed) {
      await confirmPayment(sessionId);
    }
  };
};
```

### **データベース設計**

#### **新規テーブル**

```sql
-- 提供方法設定
CREATE TABLE delivery_methods (
  id UUID PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id),
  method_type TEXT CHECK (method_type IN ('online', 'in-person-client', 'in-person-expert', 'in-person-neutral')),
  platform TEXT, -- Zoom, Meet, Teams等
  location JSONB, -- 住所、座標等
  travel_time INTEGER, -- 移動時間（分）
  travel_cost DECIMAL(10,2), -- 交通費
  special_requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- セッション管理
CREATE TABLE time_sessions (
  id UUID PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id),
  expert_id UUID REFERENCES users(id),
  client_id UUID REFERENCES users(id),
  scheduled_start TIMESTAMP,
  scheduled_end TIMESTAMP,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  session_url TEXT, -- オンライン会議URL
  meeting_room_id TEXT,
  status TEXT CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  deliverables JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 評価システム
CREATE TABLE session_evaluations (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES time_sessions(id),
  evaluator_id UUID REFERENCES users(id),
  evaluator_type TEXT CHECK (evaluator_type IN ('expert', 'client')),
  time_punctuality INTEGER CHECK (time_punctuality BETWEEN 1 AND 5),
  content_quality INTEGER CHECK (content_quality BETWEEN 1 AND 5),
  communication INTEGER CHECK (communication BETWEEN 1 AND 5),
  overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 5),
  would_recommend BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **優先度・工数見積**

| フェーズ | 機能           | 優先度 | 工数  | 前提条件            |
| -------- | -------------- | ------ | ----- | ------------------- |
| Phase 1  | 基本選択UI     | P2     | 2週間 | 基本機能完成        |
| Phase 2  | カレンダー統合 | P2     | 3週間 | Google Calendar API |
| Phase 3  | 品質保証       | P3     | 4週間 | 実運用データ収集    |

### **実装タイミング**

```
現在: 基本オークション機能完成 (85%)
↓
6月中: UI改善・AI統合 (95%)
↓
7月: Phase 1実装開始
8月: Phase 2実装
9月: Phase 3実装・テスト
10月: 本格運用開始
```

---

## 🎯 **Issue #F002: 高度な価格設定・入札戦略**

### **概要**

現在のシンプルな入札システムから、より柔軟で公平な価格設定システムへの進化。

### **検討項目**

```
動的価格調整:
- 需要・供給バランス考慮
- 専門家のスキルレベル連動
- 時間帯・曜日による変動
- 緊急度による割増

入札戦略:
- 最低価格保証
- 段階的入札
- パッケージ割引
- 長期契約優遇
```

---

## 🎯 **Issue #F003: エンタープライズ向け機能**

### **概要**

個人向けサービスから企業向けサービスへの拡張。

### **検討項目**

```
企業機能:
- チーム管理
- 予算管理・承認フロー
- 使用状況レポート
- SSO連携

請求・会計:
- 月次請求書
- 経費精算連携
- 税務対応
- 監査ログ
```

---

## 🎯 **Issue #F004: グローバル展開対応**

### **概要**

日本市場から海外市場への展開準備。

### **検討項目**

```
多言語対応:
- UI多言語化
- リアルタイム翻訳
- 法的文書翻訳
- カスタマーサポート

時差・文化対応:
- グローバルタイムゾーン
- 各国の労働法対応
- 決済手段多様化
- 文化的配慮
```

---

## 📊 **課題優先度マトリックス**

| 課題                 | ビジネスインパクト | 実装難易度 | 優先度 |
| -------------------- | ------------------ | ---------- | ------ |
| 時間提供導線設計     | 高                 | 中         | P1     |
| 高度な価格設定       | 中                 | 高         | P2     |
| エンタープライズ機能 | 高                 | 高         | P2     |
| グローバル展開       | 高                 | 最高       | P3     |

---

## 🔄 **課題管理ルール**

### **新規課題追加時**

```markdown
## Issue #F00X: 課題タイトル

### 概要

[課題の背景と重要性]

### 検討項目

[具体的に検討すべき事項]

### 技術実装案

[実装の方向性]

### 優先度・工数見積

[P1-P3、工数見積]

### 実装タイミング

[他の課題との依存関係]
```

### **課題ステータス管理**

```
📋 検討中: 要件整理・調査段階
🎯 計画中: 実装計画策定段階
🚧 実装中: 開発・テスト段階
✅ 完了: リリース済み
❌ 却下: 実装見送り
```

### **定期レビュー**

- **月次**: 優先度見直し
- **四半期**: 新規課題追加・削除
- **半年**: 全体戦略見直し

---

**最終更新**: 2025-06-05 11:40 JST  
**次回レビュー**: 2025-07-01  
**管理者**: プロジェクトリード
