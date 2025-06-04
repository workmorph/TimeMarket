#!/bin/bash
# 🔧 use-realtime-auction.ts 循環参照問題修正

echo "🔧 循環参照問題を修正中..."

# バックアップ作成
cp src/hooks/use-realtime-auction.ts src/hooks/use-realtime-auction.ts.backup

echo "📝 循環参照修正パッチを適用..."

# 135行目付近の依存配列から fetchAuction, fetchBids を削除
sed -i '' 's/}, \[isOnline, reconnectInterval, setupChannels, fetchAuction, fetchBids, toast\])/}, [isOnline, reconnectInterval, setupChannels, toast])/g' src/hooks/use-realtime-auction.ts

# 153行目付近の依存配列から fetchAuction, fetchBids を削除  
sed -i '' 's/}, \[auctionId, fetchAuction, fetchBids, setupChannels\])/}, [auctionId, setupChannels])/g' src/hooks/use-realtime-auction.ts

# disconnect イベントの引数修正
sed -i '' "s/.on('disconnect', (event) => {/.on('disconnect', () => {/g" src/hooks/use-realtime-auction.ts

# 重複プロパティ修正
sed -i '' 's/refreshBids: fetchBids,/\/\/ refreshBids: fetchBids, \/\/ 重複削除/g' src/hooks/use-realtime-auction.ts

echo "✅ 循環参照問題修正完了！"