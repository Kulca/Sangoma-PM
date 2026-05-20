-- Sangoma Alpha: PostgreSQL Schema v2 (Supabase)

-- Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  balance_sngm DECIMAL(12, 2) DEFAULT 1000.00, -- Alpha start balance in SNGM (Play Money)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Markets Table
CREATE TABLE markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'Energy', 'Politics', 'Economics', etc.
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'resolved'
  resolution_date TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  winning_outcome_token_id UUID REFERENCES outcome_tokens(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outcome Tokens Table
CREATE TABLE outcome_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- 'Yes', 'No', 'Stage 1', etc.
  symbol TEXT, -- e.g., 'SNGM-YES-1'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table (Central Limit Order Book)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  market_id UUID REFERENCES markets(id),
  outcome_token_id UUID REFERENCES outcome_tokens(id),
  side TEXT NOT NULL, -- 'buy', 'sell'
  price DECIMAL(5, 4) NOT NULL, -- 0.01 to 0.99 (SNGM per share)
  quantity INTEGER NOT NULL,
  remaining_quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'filled', 'partial', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades Table
CREATE TABLE trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES markets(id),
  outcome_token_id UUID REFERENCES outcome_tokens(id),
  buy_order_id UUID REFERENCES orders(id),
  sell_order_id UUID REFERENCES orders(id),
  price DECIMAL(5, 4) NOT NULL,
  quantity INTEGER NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Subscriptions (Supabase specific)
ALTER PUBLICATION supabase_realtime ADD TABLE markets;
ALTER PUBLICATION supabase_realtime ADD TABLE outcome_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
