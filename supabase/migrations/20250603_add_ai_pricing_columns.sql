-- Add AI pricing suggestion columns to auctions table
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS ai_suggested_reserve DECIMAL(10,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(3,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS ai_reasoning TEXT;

-- Create packages table if it doesn't exist
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  package_type TEXT NOT NULL CHECK (package_type IN ('BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM')),
  time_slots JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for packages table
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own packages and all active packages
CREATE POLICY "Users can view their own packages" 
  ON packages FOR SELECT 
  USING (auth.uid() = seller_id OR is_active = TRUE);

-- Allow users to insert their own packages
CREATE POLICY "Users can insert their own packages" 
  ON packages FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

-- Allow users to update their own packages
CREATE POLICY "Users can update their own packages" 
  ON packages FOR UPDATE 
  USING (auth.uid() = seller_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for packages table
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
