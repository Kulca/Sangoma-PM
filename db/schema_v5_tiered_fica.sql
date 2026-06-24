-- Sangoma Alpha: Tiered FICA Onboarding
-- 0: Unverified, 1: Tier 1 (ID check), 2: Tier 2 (Liveness + Document)

ALTER TABLE profiles ADD COLUMN kyc_tier INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN kyc_data JSONB DEFAULT '{}'; -- For storing provider specific metadata

-- Add more granular tracking
ALTER TABLE profiles ADD COLUMN identity_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN liveness_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN document_verified BOOLEAN DEFAULT FALSE;
