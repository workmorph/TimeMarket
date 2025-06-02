// Order model for Supabase
export type Order = {
  id?: string;
  auction_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  payment_intent_id?: string;
  scheduled_time?: string;
  duration_minutes: number;
  meeting_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type OrderWithDetails = Order & {
  auction?: {
    title: string;
    description: string;
    service_type: string;
    delivery_method: string;
  };
  buyer?: {
    display_name: string;
    email: string;
    avatar_url?: string;
  };
  seller?: {
    display_name: string;
    email: string;
    avatar_url?: string;
  };
}

// Helper functions for order status
export const isOrderActive = (order: Order): boolean => {
  return ['pending', 'paid'].includes(order.status);
};

export const canScheduleOrder = (order: Order): boolean => {
  return order.status === 'paid' && !order.scheduled_time;
};

export const isOrderCompleted = (order: Order): boolean => {
  return order.status === 'completed';
};
