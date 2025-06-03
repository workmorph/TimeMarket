#!/bin/bash

# TimeBid UIテンプレート統合スクリプト
# 実行前に: chmod +x scripts/integrate-ui-templates.sh

echo "🎨 TimeBid UI統合を開始します..."

# 1. Windmill Dashboard統合
echo "📦 Windmill Dashboardを統合中..."
if [ ! -d "src/components/windmill" ]; then
  git clone https://github.com/estevanmaito/windmill-dashboard.git temp-windmill
  mkdir -p src/components/windmill
  cp -r temp-windmill/src/components/* src/components/windmill/
  
  # 不要なファイル削除
  rm -rf temp-windmill
  
  # カラーテーマをTimeBid仕様に変更
  find src/components/windmill -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec sed -i '' 's/purple/blue/g' {} \;
  find src/components/windmill -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec sed -i '' 's/indigo/blue/g' {} \;
  
  echo "✅ Windmill Dashboard統合完了"
else
  echo "⚠️  Windmill Dashboardは既に統合済みです"
fi

# 2. Tremor統合
echo "📊 Tremorを統合中..."
npm install @tremor/react

# 3. 基本的なオークションカードコンポーネント作成
echo "🎯 オークションカードテンプレートを作成中..."
cat > src/components/auction/AuctionCardTemplate.tsx << 'EOF'
import React from 'react';
import { Card } from '@/components/windmill/Cards';
import { Badge } from '@/components/windmill/Badge';
import { Button } from '@/components/windmill/Button';

interface AuctionCardProps {
  title: string;
  currentBid: number;
  endTime: Date;
  bidCount: number;
  imageUrl?: string;
}

export const AuctionCardTemplate: React.FC<AuctionCardProps> = ({
  title,
  currentBid,
  endTime,
  bidCount,
  imageUrl
}) => {
  const timeRemaining = Math.max(0, endTime.getTime() - Date.now());
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img src={imageUrl} alt={title} className="object-cover rounded-t-lg" />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <Badge type={timeRemaining > 0 ? "success" : "danger"}>
            {timeRemaining > 0 ? "ライブ" : "終了"}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">現在価格</span>
            <span className="text-xl font-bold text-blue-600">
              ¥{currentBid.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">入札数</span>
            <span>{bidCount}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">残り時間</span>
            <span className="font-medium">
              {timeRemaining > 0 ? `${hours}時間 ${minutes}分` : "終了しました"}
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full"
          disabled={timeRemaining <= 0}
        >
          {timeRemaining > 0 ? "入札する" : "結果を見る"}
        </Button>
      </div>
    </Card>
  );
};
EOF

echo "✅ オークションカードテンプレート作成完了"

# 4. ダッシュボードレイアウトテンプレート作成
echo "📐 ダッシュボードレイアウトを作成中..."
cat > src/components/dashboard/DashboardLayoutTemplate.tsx << 'EOF'
import React from 'react';
import { Card, CardBody } from '@/components/windmill/Cards';
import { 
  ChartBarIcon, 
  CurrencyYenIcon, 
  ClockIcon, 
  UsersIcon 
} from '@heroicons/react/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <Card>
    <CardBody className="flex items-center">
      <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
        {icon}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {value}
        </p>
        {trend !== undefined && (
          <p className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </CardBody>
  </Card>
);

export const DashboardLayoutTemplate: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="総売上"
          value="¥1,234,567"
          icon={<CurrencyYenIcon className="w-5 h-5" />}
          trend={12.5}
        />
        <StatCard
          title="アクティブオークション"
          value="24"
          icon={<ClockIcon className="w-5 h-5" />}
          trend={8.3}
        />
        <StatCard
          title="総入札数"
          value="156"
          icon={<ChartBarIcon className="w-5 h-5" />}
          trend={-2.1}
        />
        <StatCard
          title="ユーザー数"
          value="892"
          icon={<UsersIcon className="w-5 h-5" />}
          trend={15.7}
        />
      </div>
      
      {/* メインコンテンツエリア */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">最近のアクティビティ</h3>
            {/* アクティビティリスト */}
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">売上推移</h3>
            {/* Tremorチャート */}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
EOF

echo "✅ ダッシュボードレイアウト作成完了"

# 5. package.json更新の確認
echo "📝 必要な依存関係を確認中..."
if ! grep -q "@tremor/react" package.json; then
  npm install @tremor/react
fi

if ! grep -q "@heroicons/react" package.json; then
  npm install @heroicons/react
fi

# 6. TailwindCSS設定更新
echo "🎨 TailwindCSS設定を更新中..."
if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
  echo "⚠️  tailwind.config を手動で更新してください:"
  echo "  - colorsにblue系の色を追加"
  echo "  - Tremor用の設定を追加"
else
  echo "⚠️  TailwindCSS設定ファイルが見つかりません"
fi

echo ""
echo "✨ UI統合が完了しました！"
echo ""
echo "次のステップ:"
echo "1. TailwindUIを購入 ($149): https://tailwindui.com/"
echo "2. src/components/auction/auction-card.tsx を AuctionCardTemplate.tsx を参考に更新"
echo "3. src/app/dashboard/page.tsx を DashboardLayoutTemplate.tsx を参考に更新"
echo ""
echo "📚 作成されたテンプレート:"
echo "  - src/components/auction/AuctionCardTemplate.tsx"
echo "  - src/components/dashboard/DashboardLayoutTemplate.tsx"
echo "  - src/components/windmill/ (Windmillコンポーネント)"
