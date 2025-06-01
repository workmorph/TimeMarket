-- profiles テーブル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- auctions テーブル
CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  starting_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  current_price NUMERIC(10, 2) DEFAULT NULL, -- オークション開始後に更新
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, active, ended, cancelled
  CONSTRAINT price_positive CHECK (starting_price >= 0)
);

ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auctions are viewable by everyone." ON auctions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own auctions." ON auctions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own auctions." ON auctions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own auctions." ON auctions FOR DELETE USING (auth.uid() = user_id);

-- bids テーブル
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  bid_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_winning_bid BOOLEAN DEFAULT FALSE,
  CONSTRAINT bid_amount_positive CHECK (amount > 0)
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bids are viewable by users involved in the auction." ON bids FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM auctions WHERE auctions.id = bids.auction_id AND auctions.user_id = auth.uid()));
CREATE POLICY "Users can insert bids on auctions." ON bids FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM auctions WHERE auctions.id = bids.auction_id AND auctions.status = 'active' AND auctions.end_time > NOW()));

-- RLS_SAFE=false (初期段階)
-- 必要に応じて、各ポリシーで auth.uid() を使用したアクセス制御を行っています。
-- 本番環境へ移行する前に、RLSポリシーを十分にテストし、RLS_SAFE=true に設定することを推奨します。 