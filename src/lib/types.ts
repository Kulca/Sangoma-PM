export type MarketStatus = 'open' | 'closed' | 'resolved' | 'disputed';

export interface Profile {
  id: string;
  username: string;
  email: string;
  balance_sngm: number;
  balance_zar?: number;
  kyc_status?: 'pending' | 'verified' | 'failed';
}

export interface OutcomeToken {
  id: string;
  market_id: string;
  label: string;
  symbol: string;
  probability?: number;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: 'Energy' | 'Politics' | 'Economics' | 'Water' | 'Logistics';
  status: MarketStatus;
  resolution_date: string;
  resolved_at?: string;
  outcome_tokens?: OutcomeToken[];
  disputed_at?: string;
  dispute_reason?: string;
  is_council_verified?: boolean;
}

export interface MarketProposal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Dispute {
  id: string;
  market_id: string;
  user_id: string;
  reason: string;
  evidence_url?: string;
  status: 'open' | 'resolved' | 'dismissed';
  council_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  market_id: string;
  outcome_token_id: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  remaining_quantity: number;
  status: 'open' | 'filled' | 'partial' | 'cancelled';
}

export interface Trade {
  id: string;
  market_id: string;
  outcome_token_id: string;
  buy_order_id: string;
  sell_order_id: string;
  price: number;
  quantity: number;
  executed_at: string;
}
