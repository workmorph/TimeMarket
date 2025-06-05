// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          email: string;
          avatar_url: string | null;
          expertise_areas: string[] | null;
          bio: string | null;
          hourly_rate: number | null;
          verification_status: string | null;
          average_rating: number | null;
          total_sessions: number | null;
          response_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          email: string;
          avatar_url?: string | null;
          expertise_areas?: string[] | null;
          bio?: string | null;
          hourly_rate?: number | null;
          verification_status?: string | null;
          average_rating?: number | null;
          total_sessions?: number | null;
          response_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          email?: string;
          avatar_url?: string | null;
          expertise_areas?: string[] | null;
          bio?: string | null;
          hourly_rate?: number | null;
          verification_status?: string | null;
          average_rating?: number | null;
          total_sessions?: number | null;
          response_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      auctions: {
        Row: {
          id: string;
          title: string;
          description: string;
          expert_id: string;
          start_time: string;
          end_time: string;
          starting_price: number;
          current_highest_bid: number;
          bid_count: number;
          status: "active" | "ended" | "cancelled";
          duration_minutes: number;
          service_type: string;
          delivery_method: string;
          ends_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          expert_id: string;
          start_time: string;
          end_time: string;
          starting_price: number;
          current_highest_bid?: number;
          bid_count?: number;
          status?: "active" | "ended" | "cancelled";
          duration_minutes?: number;
          service_type?: string;
          delivery_method?: string;
          ends_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          expert_id?: string;
          start_time?: string;
          end_time?: string;
          starting_price?: number;
          current_highest_bid?: number;
          bid_count?: number;
          status?: "active" | "ended" | "cancelled";
          duration_minutes?: number;
          service_type?: string;
          delivery_method?: string;
          ends_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bids: {
        Row: {
          id: string;
          auction_id: string;
          bidder_id: string;
          user_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          auction_id: string;
          bidder_id: string;
          user_id?: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          auction_id?: string;
          bidder_id?: string;
          user_id?: string;
          amount?: number;
          created_at?: string;
        };
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          key_hash: string;
          prefix: string;
          last_used_at: string | null;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          key_hash: string;
          prefix: string;
          last_used_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          key_hash?: string;
          prefix?: string;
          last_used_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          details: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Type aliases for easier use
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Auction = Database["public"]["Tables"]["auctions"]["Row"] & {
  expert?: Profile;
};
export type AuctionInsert = Database["public"]["Tables"]["auctions"]["Insert"];
export type AuctionUpdate = Database["public"]["Tables"]["auctions"]["Update"];

export type Bid = Database["public"]["Tables"]["bids"]["Row"] & {
  bidder?: Profile;
  bidder_name?: string;
};
export type BidInsert = Database["public"]["Tables"]["bids"]["Insert"];
export type BidUpdate = Database["public"]["Tables"]["bids"]["Update"];

export type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"];
export type ApiKeyInsert = Database["public"]["Tables"]["api_keys"]["Insert"];
export type ApiKeyUpdate = Database["public"]["Tables"]["api_keys"]["Update"];

export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
export type ActivityLogInsert = Database["public"]["Tables"]["activity_logs"]["Insert"];
export type ActivityLogUpdate = Database["public"]["Tables"]["activity_logs"]["Update"];
