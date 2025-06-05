import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Auction, Bid } from "@/lib/supabase/types";

interface AuctionState {
  auctions: Auction[];
  currentAuction: Auction | null;
  bids: Bid[];
  isLoading: boolean;
  error: string | null;

  // アクション
  fetchAuctions: () => Promise<void>;
  fetchAuctionById: (id: string) => Promise<void>;
  fetchBidsByAuctionId: (auctionId: string) => Promise<void>;
  createAuction: (auctionData: Partial<Auction>) => Promise<Auction | null>;
  updateAuction: (id: string, auctionData: Partial<Auction>) => Promise<Auction | null>;
  placeBid: (auctionId: string, amount: number, bidderId: string) => Promise<Bid | null>;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
  auctions: [],
  currentAuction: null,
  bids: [],
  isLoading: false,
  error: null,

  // すべてのオークションを取得
  fetchAuctions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("auctions")
        .select("*, expert:profiles(*)")
        .order("ends_at", { ascending: true });

      if (error) throw error;
      set({ auctions: data as Auction[], isLoading: false });
    } catch (error: unknown) {
      console.error("オークション取得エラー:", error);
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
    }
  },

  // IDによるオークション取得
  fetchAuctionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("auctions")
        .select("*, expert:profiles(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      set({ currentAuction: data as Auction, isLoading: false });
    } catch (error: unknown) {
      console.error("オークション詳細取得エラー:", error);
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
    }
  },

  // オークションの入札履歴を取得
  fetchBidsByAuctionId: async (auctionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("bids")
        .select("*, bidder:profiles(display_name)")
        .eq("auction_id", auctionId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // bidder_nameを追加
      const bidsWithNames = data.map((bid) => ({
        ...bid,
        bidder_name: bid.bidder?.display_name || "匿名ユーザー",
      }));

      set({ bids: bidsWithNames as Bid[], isLoading: false });
    } catch (error: unknown) {
      console.error("入札履歴取得エラー:", error);
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
    }
  },

  // オークション作成
  createAuction: async (auctionData: Partial<Auction>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("auctions")
        .insert({
          ...auctionData,
          bid_count: 0,
          current_highest_bid: auctionData.starting_price || auctionData.current_highest_bid || 0,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // 新しいオークションをリストに追加
      const newAuction = data as Auction;
      set((state) => ({
        auctions: [...state.auctions, newAuction],
        isLoading: false,
      }));

      return newAuction;
    } catch (error: unknown) {
      console.error("オークション作成エラー:", error);
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
      return null;
    }
  },

  // オークション更新
  updateAuction: async (id: string, auctionData: Partial<Auction>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("auctions")
        .update({
          ...auctionData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedAuction = data as Auction;

      // 現在のオークションが更新対象の場合、それも更新
      if (get().currentAuction?.id === id) {
        set({ currentAuction: updatedAuction });
      }

      // オークションリストも更新
      set((state) => ({
        auctions: state.auctions.map((auction) => (auction.id === id ? updatedAuction : auction)),
        isLoading: false,
      }));

      return updatedAuction;
    } catch (error: unknown) {
      console.error("オークション更新エラー:", error);
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
      return null;
    }
  },

  // 入札処理
  placeBid: async (auctionId: string, amount: number, bidderId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 現在のオークション情報を取得
      const { data: auctionData, error: auctionError } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", auctionId)
        .single();

      if (auctionError) throw auctionError;

      const auction = auctionData as Auction;

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
      const { data: updatedAuctionData, error: updateError } = await supabase
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

      // ストアの状態を更新
      const newBid = bidData as Bid;
      const updatedAuction = updatedAuctionData as Auction;

      set((state) => ({
        bids: [newBid, ...state.bids],
        currentAuction: updatedAuction,
        auctions: state.auctions.map((a) => (a.id === auctionId ? updatedAuction : a)),
        isLoading: false,
      }));

      return newBid;
    } catch (error: unknown) {
      console.error("入札処理エラー:", error);
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
      return null;
    }
  },
}));
