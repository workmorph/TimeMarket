import { createClient } from "./client";
import type { Auction, Bid } from "./types";

// リアルタイム接続が許可されているかどうか
// 環境変数 REALTIME_CONN_OK=false の場合はポーリングを使用
const isRealtimeEnabled = process.env.NEXT_PUBLIC_REALTIME_CONN_OK !== "false";

// ポーリング間隔（ミリ秒）
const POLLING_INTERVAL = 3000; // 3秒

/**
 * オークションのリアルタイム更新をサブスクライブする
 * @param auctionId オークションID
 * @param onUpdate 更新時のコールバック関数
 * @returns クリーンアップ関数
 */
export function subscribeToAuctionUpdates(auctionId: string, onUpdate: (auction: Auction) => void) {
  const supabase = createClient();

  if (isRealtimeEnabled) {
    // リアルタイム接続を使用
    const channel = supabase
      .channel(`auction:${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        (payload) => {
          onUpdate(payload.new as Auction);
        }
      )
      .subscribe();

    // クリーンアップ関数を返す
    return () => {
      supabase.removeChannel(channel);
    };
  } else {
    // ポーリングを使用
    console.log(`Realtime disabled, using polling for auction ${auctionId}`);
    let isPolling = true;

    const pollAuction = async () => {
      if (!isPolling) return;

      try {
        const { data, error } = await supabase
          .from("auctions")
          .select("*")
          .eq("id", auctionId)
          .single();

        if (!error && data) {
          onUpdate(data);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      if (isPolling) {
        setTimeout(pollAuction, POLLING_INTERVAL);
      }
    };

    // 初回ポーリング開始
    pollAuction();

    // クリーンアップ関数を返す
    return () => {
      isPolling = false;
    };
  }
}

/**
 * オークションの入札リアルタイム更新をサブスクライブする
 * @param auctionId オークションID
 * @param onUpdate 更新時のコールバック関数
 * @returns クリーンアップ関数
 */
export function subscribeToBidUpdates(auctionId: string, onUpdate: (bids: Bid[]) => void) {
  const supabase = createClient();

  if (isRealtimeEnabled) {
    // リアルタイム接続を使用
    const channel = supabase
      .channel(`bids:${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE すべてのイベント
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        async () => {
          // 新しい入札があった場合、最新の入札リストを取得
          const { data } = await supabase
            .from("bids")
            .select("*, profiles(username, avatar_url)")
            .eq("auction_id", auctionId)
            .order("amount", { ascending: false });

          if (data) {
            onUpdate(data);
          }
        }
      )
      .subscribe();

    // クリーンアップ関数を返す
    return () => {
      supabase.removeChannel(channel);
    };
  } else {
    // ポーリングを使用
    console.log(`Realtime disabled, using polling for bids on auction ${auctionId}`);
    let isPolling = true;

    const pollBids = async () => {
      if (!isPolling) return;

      try {
        const { data, error } = await supabase
          .from("bids")
          .select("*, profiles(username, avatar_url)")
          .eq("auction_id", auctionId)
          .order("amount", { ascending: false });

        if (!error && data) {
          onUpdate(data);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      if (isPolling) {
        setTimeout(pollBids, POLLING_INTERVAL);
      }
    };

    // 初回ポーリング開始
    pollBids();

    // クリーンアップ関数を返す
    return () => {
      isPolling = false;
    };
  }
}
