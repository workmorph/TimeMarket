// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          primary_color: string;
          secondary_color: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          subscription_plan: string;
          subscription_status: string;
          trial_ends_at: string | null;
          owner_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          subscription_plan?: string;
          subscription_status?: string;
          trial_ends_at?: string | null;
          owner_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          subscription_plan?: string;
          subscription_status?: string;
          trial_ends_at?: string | null;
          owner_id?: string | null;
        };
      };
      tenant_configs: {
        Row: {
          id: string;
          tenant_id: string;
          config_key: string;
          config_value: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          config_key: string;
          config_value?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          config_key?: string;
          config_value?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenant_experts: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          role?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          role?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenant_api_keys: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          api_key: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
          last_used_at: string | null;
          allowed_origins: string[] | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          api_key: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
          last_used_at?: string | null;
          allowed_origins?: string[] | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          api_key?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
          last_used_at?: string | null;
          allowed_origins?: string[] | null;
        };
      };
      tenant_usage: {
        Row: {
          id: string;
          tenant_id: string;
          month: string;
          api_calls: number;
          widget_views: number;
          auctions_created: number;
          bids_placed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          month: string;
          api_calls?: number;
          widget_views?: number;
          auctions_created?: number;
          bids_placed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          month?: string;
          api_calls?: number;
          widget_views?: number;
          auctions_created?: number;
          bids_placed?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenant_invoices: {
        Row: {
          id: string;
          tenant_id: string;
          invoice_number: string;
          amount: number;
          currency: string;
          status: string;
          billing_period_start: string;
          billing_period_end: string;
          due_date: string;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          invoice_number: string;
          amount: number;
          currency?: string;
          status?: string;
          billing_period_start: string;
          billing_period_end: string;
          due_date: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          invoice_number?: string;
          amount?: number;
          currency?: string;
          status?: string;
          billing_period_start?: string;
          billing_period_end?: string;
          due_date?: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
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

// テナント関連の型エイリアス
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"];
export type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];

export type TenantConfig = Database["public"]["Tables"]["tenant_configs"]["Row"];
export type TenantConfigInsert = Database["public"]["Tables"]["tenant_configs"]["Insert"];
export type TenantConfigUpdate = Database["public"]["Tables"]["tenant_configs"]["Update"];

export type TenantExpert = Database["public"]["Tables"]["tenant_experts"]["Row"] & {
  profile?: Profile;
};
export type TenantExpertInsert = Database["public"]["Tables"]["tenant_experts"]["Insert"];
export type TenantExpertUpdate = Database["public"]["Tables"]["tenant_experts"]["Update"];

export type TenantApiKey = Database["public"]["Tables"]["tenant_api_keys"]["Row"];
export type TenantApiKeyInsert = Database["public"]["Tables"]["tenant_api_keys"]["Insert"];
export type TenantApiKeyUpdate = Database["public"]["Tables"]["tenant_api_keys"]["Update"];

export type TenantUsage = Database["public"]["Tables"]["tenant_usage"]["Row"];
export type TenantUsageInsert = Database["public"]["Tables"]["tenant_usage"]["Insert"];
export type TenantUsageUpdate = Database["public"]["Tables"]["tenant_usage"]["Update"];

export type TenantInvoice = Database["public"]["Tables"]["tenant_invoices"]["Row"];
export type TenantInvoiceInsert = Database["public"]["Tables"]["tenant_invoices"]["Insert"];
export type TenantInvoiceUpdate = Database["public"]["Tables"]["tenant_invoices"]["Update"];
