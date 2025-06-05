"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Auction, Bid } from "@/lib/supabase/types";

export function useRealtimeAuction(auctionId: string) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // オークション情報を取得
  const fetchAuction = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("auctions")
        .select("*, expert:profiles(*)")
        .eq("id", auctionId)
        .single();

      if (error) throw error;
      setAuction(data as Auction);
    } catch (err: unknown) {
      console.error("オークション取得エラー:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [auctionId]);

  // 入札履歴を取得
  const fetchBids = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bids")
        .select("*, bidder:profiles(display_name)")
        .eq("auction_id", auctionId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // bidder_nameを追加
      const bidsWithNames = (data || []).map((bid) => ({
        ...bid,
        bidder_name: bid.bidder?.display_name || "匿名ユーザー",
      }));

      setBids(bidsWithNames as Bid[]);
    } catch (err: unknown) {
      console.error("入札履歴取得エラー:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [auctionId]);

  useEffect(() => {
    // オークション情報と入札履歴を取得
    fetchAuction();
    fetchBids();

    // リアルタイム更新のサブスクリプション設定
    const auctionSubscription = supabase
      .channel("auction-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        (payload) => {
          setAuction(payload.new as Auction);
        }
      )
      .subscribe();

    const bidSubscription = supabase
      .channel("bid-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        (payload) => {
          // 新しい入札を追加
          setBids((prev) => [payload.new as Bid, ...prev]);

          // オークション情報も更新（最新の入札額を反映）
          fetchAuction();
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      supabase.removeChannel(auctionSubscription);
      supabase.removeChannel(bidSubscription);
    };
  }, [auctionId, fetchAuction, fetchBids]);

  // 入札を行う関数
  async function placeBid(amount: number, bidderId: string) {
    if (!auction) {
      setError("オークション情報が取得できていません");
      return null;
    }

    try {
      // 入札額のバリデーション
      if (amount <= auction.current_highest_bid) {
        throw new Error(
          `入札額は現在の最高額（${auction.current_highest_bid}円）より高くなければなりません`
        );
      }

      // 入札を記録
      const { data: bidData, error: bidError } = await supabase
        .from("bids")
        .insert({
          auction_id: auctionId,
          bidder_id: bidderId,
          amount: amount,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (bidError) throw bidError;

      // オークション情報を更新
      const { error: updateError } = await supabase
        .from("auctions")
        .update({
          current_highest_bid: amount,
          bid_count: auction.bid_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", auctionId)
        .select()
        .single();

      if (updateError) throw updateError;

      return bidData as Bid;
    } catch (err: unknown) {
      console.error("入札処理エラー:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  }

  return {
    auction,
    bids,
    isLoading,
    error,
    placeBid,
    refreshAuction: fetchAuction,
    refreshBids: fetchBids,
  };
}
