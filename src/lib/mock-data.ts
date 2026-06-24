import { Market } from './types';

export const mockMarkets: Market[] = [
  {
    id: '1',
    title: 'National Loadshedding Stage by Friday Night',
    description: 'What will be the national loadshedding stage at 22:00 SAST on Friday, May 10th?',
    category: 'Energy',
    status: 'open',
    resolution_date: '2024-05-10T20:00:00Z',
    outcome_tokens: [
      { id: 't1', market_id: '1', label: 'Stage 0', symbol: 'SNGM-LS-0', probability: 0.1 },
      { id: 't2', market_id: '1', label: 'Stage 2', symbol: 'SNGM-LS-2', probability: 0.4 },
      { id: 't3', market_id: '1', label: 'Stage 4', symbol: 'SNGM-LS-4', probability: 0.35 },
      { id: 't4', market_id: '1', label: 'Stage 6+', symbol: 'SNGM-LS-6', probability: 0.15 },
    ],
  },
  {
    id: '2',
    title: '2024 Election: Will there be a National Grand Coalition?',
    description: 'Will the ANC and DA form a national-level coalition government after the 2024 elections?',
    category: 'Politics',
    status: 'open',
    resolution_date: '2024-06-02T12:00:00Z',
    outcome_tokens: [
      { id: 't5', market_id: '2', label: 'Yes', symbol: 'SNGM-EL-YES', probability: 0.25 },
      { id: 't6', market_id: '2', label: 'No', symbol: 'SNGM-EL-NO', probability: 0.75 },
    ],
  },
  {
    id: '3',
    title: 'ZAR/USD Exchange Rate at End of Month',
    description: 'Will the ZAR/USD exchange rate be above R19.00 on May 31st?',
    category: 'Economics',
    status: 'open',
    resolution_date: '2024-05-31T15:00:00Z',
    outcome_tokens: [
      { id: 't7', market_id: '3', label: 'Above R19.00', symbol: 'SNGM-FX-UP', probability: 0.62 },
      { id: 't8', market_id: '3', label: 'Below R19.00', symbol: 'SNGM-FX-DOWN', probability: 0.38 },
    ],
  },
];

export async function getMarketById(id: string): Promise<Market | undefined> {
  return mockMarkets.find((m) => m.id === id);
}

export const mockHoldings = [
  {
    id: 'h1',
    market_id: '1',
    market_title: 'National Loadshedding Stage by Friday Night',
    outcome_label: 'Stage 4',
    shares: 500,
    avg_price: 0.30,
    current_price: 0.75,
  },
  {
    id: 'h2',
    market_id: '2',
    market_title: '2024 Election: Will there be a National Grand Coalition?',
    outcome_label: 'No',
    shares: 300,
    avg_price: 0.60,
    current_price: 0.85,
  },
];

export const mockTrades = [
  {
    id: 'tr1',
    market_title: 'National Loadshedding Stage by Friday Night',
    outcome_label: 'Stage 4',
    side: 'buy',
    shares: 500,
    price: 0.30,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'tr2',
    market_title: '2024 Election: Will there be a National...',
    outcome_label: 'No',
    side: 'buy',
    shares: 300,
    price: 0.60,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'tr3',
    market_title: 'ZAR/USD Exchange Rate at End of Month',
    outcome_label: 'Below R19.00',
    side: 'sell',
    shares: 200,
    price: 0.55,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export const mockUserProfile = {
  id: 'u1',
  username: 'sangoma_trader',
  full_name: 'Thabo Mbeki',
  email: 'thabo@example.com',
  balance_sngm: 1250.00,
  balance_zar: 500.00,
  kyc_status: 'verified', // 'pending', 'verified', 'failed'
  id_number: '9001015000081',
  bank_account_number: '123456789',
  bank_name: 'Standard Bank',
  kyc_verified_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
};

export const mockTransactions = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 750.00,
    currency: 'ZAR',
    status: 'completed',
    external_reference: 'stitch_req_123',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'tx2',
    type: 'withdrawal',
    amount: 250.00,
    currency: 'ZAR',
    status: 'completed',
    external_reference: 'stitch_payout_456',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

export const mockProposals = [
  {
    id: 'p1',
    user_id: 'u1',
    title: 'Cape Town Dam Levels below 50%',
    description: 'Will the combined dam levels in Cape Town fall below 50% by December 2024?',
    category: 'Water',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'p2',
    user_id: 'u2',
    title: 'Petrol Price under R20/L',
    description: 'Will the 95 Unleaded petrol price in Gauteng be under R20.00/L in July 2024?',
    category: 'Logistics',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

export const mockDisputes = [
  {
    id: 'd1',
    market_id: '1',
    user_id: 'u3',
    reason: 'Official ESP stage was Stage 3 at the time of resolution, not Stage 4.',
    evidence_url: 'https://twitter.com/Eskom_SA/status/12345',
    status: 'open',
    council_notes: 'Council is reviewing Eskom official press releases.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
];
