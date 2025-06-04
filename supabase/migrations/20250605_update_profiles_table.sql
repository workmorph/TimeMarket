-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS expertise_areas TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate_min INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate_max INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS response_rate DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Tokyo';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'ja';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_push BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_sms BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_show_email BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_show_phone BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_show_location BOOLEAN DEFAULT true;

-- Add check constraints
ALTER TABLE profiles ADD CONSTRAINT check_hourly_rate_range 
  CHECK (hourly_rate_min IS NULL OR hourly_rate_max IS NULL OR hourly_rate_min <= hourly_rate_max);

ALTER TABLE profiles ADD CONSTRAINT check_years_of_experience 
  CHECK (years_of_experience >= 0);

ALTER TABLE profiles ADD CONSTRAINT check_average_rating 
  CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE profiles ADD CONSTRAINT check_response_rate 
  CHECK (response_rate >= 0 AND response_rate <= 100);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_expertise_areas ON profiles USING GIN (expertise_areas);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles (verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_hourly_rate ON profiles (hourly_rate_min, hourly_rate_max);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Add comment to table
COMMENT ON TABLE profiles IS 'User profile information including expertise, rates, and settings';