-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'completed', 'cancelled', 'refunded')),
  payment_intent_id TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER NOT NULL,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own orders (as buyer or seller)
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Allow users to insert their own orders (as buyer)
CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- Allow users to update their own orders (as buyer or seller)
CREATE POLICY "Users can update their own orders" 
  ON orders FOR UPDATE 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create trigger for orders table to update updated_at column
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
