-- Sangoma Alpha: Schema Update for FICA & Payments
-- Update Profiles table
ALTER TABLE profiles ADD COLUMN balance_zar DECIMAL(12, 2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN kyc_status TEXT DEFAULT 'pending'; -- 'pending', 'verified', 'failed'
ALTER TABLE profiles ADD COLUMN full_name TEXT;
ALTER TABLE profiles ADD COLUMN id_number TEXT; -- Masked or hashed
ALTER TABLE profiles ADD COLUMN bank_account_number TEXT;
ALTER TABLE profiles ADD COLUMN bank_name TEXT;
ALTER TABLE profiles ADD COLUMN kyc_verified_at TIMESTAMP WITH TIME ZONE;

-- Transactions Table for Audit Trail
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'payout'
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  external_reference TEXT, -- Stitch PaymentRequest ID or Payout ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
