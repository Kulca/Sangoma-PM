-- Sangoma Alpha: Schema Update for Governance & Community
-- Update Markets table
ALTER TABLE markets ADD COLUMN disputed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE markets ADD COLUMN dispute_reason TEXT;
ALTER TABLE markets ADD COLUMN is_council_verified BOOLEAN DEFAULT FALSE;

-- Market Proposals Table
CREATE TABLE market_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes Table
CREATE TABLE disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES markets(id),
  user_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  evidence_url TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'resolved', 'dismissed'
  council_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Real-time Subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE market_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE disputes;
