-- Sangoma Alpha: PostgreSQL Schema (Supabase)

-- Users Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  balance_zar DECIMAL(12, 2) DEFAULT 1000.00, -- Alpha start balance
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
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  result_outcome_id UUID, -- References outcomes(id) after resolution
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outcomes Table
CREATE TABLE outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  probability DECIMAL(5, 4), -- Current probability based on market price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table (Central Limit Order Book)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  market_id UUID REFERENCES markets(id),
  outcome_id UUID REFERENCES outcomes(id),
  side TEXT NOT NULL, -- 'buy', 'sell'
  price DECIMAL(5, 4) NOT NULL, -- 0.01 to 0.99 (cents per share)
  quantity INTEGER NOT NULL,
  remaining_quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'filled', 'partial', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades Table
CREATE TABLE trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES markets(id),
  outcome_id UUID REFERENCES outcomes(id),
  buy_order_id UUID REFERENCES orders(id),
  sell_order_id UUID REFERENCES orders(id),
  price DECIMAL(5, 4) NOT NULL,
  quantity INTEGER NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Subscriptions (Supabase specific)
-- Enable realtime for markets and orders
ALTER PUBLICATION supabase_realtime ADD TABLE markets;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE outcomes;
