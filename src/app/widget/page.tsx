"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Auction, Bid } from "@/lib/supabase/types";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, AlertCircle } from "lucide-react";

interface WidgetTheme {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: string;
}

function WidgetContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("key");
  const themeParam = searchParams.get("theme");

  const [theme, setTheme] = useState<WidgetTheme>({});
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const supabase = createClientComponentClient();

  // APIキーの検証とオークションデータの取得
  useEffect(() => {
    async function validateAndFetchData() {
      try {
        if (!apiKey) {
          throw new Error("APIキーが指定されていません");
        }

        // APIキーの検証（実際の実装ではここでAPIキーを検証）
        // const { data: keyData, error: keyError } = await supabase
        //   .from('api_keys')
        //   .select('*')
        //   .eq('key', apiKey)
        //   .single()

        // if (keyError || !keyData) {
        //   throw new Error('無効なAPIキーです')
        // }

        // テスト用に最新のオークションを取得
        const { data: auctionData, error: auctionError } = await supabase
          .from("auctions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (auctionError) {
          throw new Error("オークションの取得に失敗しました");
        }

        setAuction(auctionData);

        // 入札履歴の取得
        const { data: bidData, error: bidError } = await supabase
          .from("bids")
          .select("*")
          .eq("auction_id", auctionData.id)
          .order("amount", { ascending: false });

        if (!bidError && bidData) {
          setBids(bidData);
        }

        // リアルタイム購読の設定
        const auctionSubscription = supabase
          .channel("auction-updates")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "auctions",
              filter: `id=eq.${auctionData.id}`,
            },
            (payload) => {
              if (payload.new && typeof payload.new === "object") {
                setAuction(payload.new as Auction);
              }
            }
          )
          .subscribe();

        const bidSubscription = supabase
          .channel("bid-updates")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "bids",
              filter: `auction_id=eq.${auctionData.id}`,
            },
            (payload) => {
              if (payload.new && typeof payload.new === "object") {
                setBids((prev) =>
                  [payload.new as Bid, ...prev].sort((a, b) => b.amount - a.amount)
                );
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(auctionSubscription);
          supabase.removeChannel(bidSubscription);
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
        return undefined; // エラー時にも戳っている値を返す
      } finally {
        setIsLoading(false);
      }
    }

    // テーマの設定
    if (themeParam) {
      try {
        setTheme(JSON.parse(themeParam));
      } catch (e) {
        console.error("テーマの解析に失敗しました:", e);
      }
    }

    validateAndFetchData();
  }, [apiKey, themeParam, supabase]);

  // 残り時間の更新
  useEffect(() => {
    if (!auction) return;

    const updateTimeLeft = () => {
      const remaining = getTimeRemaining(
        auction.ends_at || new Date(Date.now() + 1000 * 60 * 60).toISOString()
      );
      // getTimeRemainingがオブジェクトを返す場合、文字列に変換
      if (typeof remaining === "object" && "hours" in remaining) {
        const hours = remaining.hours.toString().padStart(2, "0");
        const minutes = remaining.minutes.toString().padStart(2, "0");
        const seconds = remaining.seconds.toString().padStart(2, "0");
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      } else {
        setTimeLeft(String(remaining));
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // 高さの調整
  useEffect(() => {
    const updateHeight = () => {
      const container = document.getElementById("widget-container");
      if (container) {
        const newHeight = container.scrollHeight;

        // 親ウィンドウに高さを通知
        window.parent.postMessage(
          {
            type: "TIMEBID_RESIZE",
            height: newHeight,
          },
          "*"
        );
      }
    };

    updateHeight();

    // リサイズ監視
    const resizeObserver = new ResizeObserver(updateHeight);
    const container = document.getElementById("widget-container");
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, [auction, bids, isLoading, error]);

  // 入札処理
  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auction || !bidAmount) return;

    const amount = parseInt(bidAmount);

    // 入札額のバリデーション
    if (isNaN(amount) || amount < auction.current_highest_bid + 1000) {
      setError("入札額は現在価格より1,000円以上高く設定してください");
      return;
    }

    try {
      // ここではモックの入札処理
      alert(`${formatCurrency(amount)}で入札しました！`);

      // 実際の実装では以下のようなコードになります
      // const { data, error } = await supabase
      //   .from('bids')
      //   .insert({
      //     auction_id: auction.id,
      //     user_id: 'widget-user-id',
      //     amount: amount,
      //     created_at: new Date().toISOString()
      //   })

      // if (error) throw error

      setBidAmount("");

      // 親ウィンドウに入札イベントを通知
      window.parent.postMessage(
        {
          type: "TIMEBID_BID_PLACED",
          bid: {
            auction_id: auction.id,
            amount: amount,
            timestamp: new Date().toISOString(),
          },
        },
        "*"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "入札に失敗しました");
    }
  };

  // スタイル設定
  const styles = {
    primaryColor: theme.primaryColor || "#3498db",
    secondaryColor: theme.secondaryColor || "#f0f9ff",
    fontFamily: theme.fontFamily || "system-ui, sans-serif",
    borderRadius: theme.borderRadius || "0.5rem",
  };

  if (isLoading) {
    return (
      <div
        id="widget-container"
        className="p-4 flex justify-center items-center h-[400px]"
        style={{ fontFamily: styles.fontFamily }}
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: styles.primaryColor }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="widget-container" className="p-4" style={{ fontFamily: styles.fontFamily }}>
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div id="widget-container" className="p-4" style={{ fontFamily: styles.fontFamily }}>
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
          オークションが見つかりませんでした
        </div>
      </div>
    );
  }

  return (
    <div id="widget-container" className="p-4" style={{ fontFamily: styles.fontFamily }}>
      <Card className="border" style={{ borderRadius: styles.borderRadius }}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{auction.title}</CardTitle>
            <Badge style={{ backgroundColor: styles.primaryColor, color: "white" }}>
              {timeLeft}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">現在価格</span>
            <span className="text-xl font-bold" style={{ color: styles.primaryColor }}>
              {formatCurrency(auction.current_highest_bid)}
            </span>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{auction.duration_minutes || 60}分のセッション</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>
                開始価格: {formatCurrency(auction.starting_price || auction.current_highest_bid)}
              </span>
            </div>
          </div>

          <form onSubmit={handleBid} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`${auction.current_highest_bid + 1000}円以上`}
                min={auction.current_highest_bid + 1000}
                step={1000}
                className="flex-1"
              />
              <Button type="submit" style={{ backgroundColor: styles.primaryColor }}>
                入札する
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              ※現在価格より1,000円以上高い金額で入札してください
            </p>
          </form>

          {bids.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">入札履歴</h3>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {bids.slice(0, 5).map((bid, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>入札者{bid.user_id?.substring(0, 4) || "xxxx"}...</span>
                      <span className="font-medium">{formatCurrency(bid.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="text-xs text-center text-muted-foreground pt-2">
            Powered by{" "}
            <a
              href="https://timebid.jp"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: styles.primaryColor }}
            >
              TimeBid
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense
      fallback={
        <div
          id="widget-container"
          className="p-4 flex justify-center items-center h-[400px]"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <WidgetContent />
    </Suspense>
  );
}
