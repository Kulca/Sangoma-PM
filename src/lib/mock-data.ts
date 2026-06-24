import { Market } from './types';

const MOCK_CTF_ADDRESS = '0xB81f3e0A187dFA8006b681056332d7f1b56F7c20';
const MOCK_COLLATERAL_ADDRESS = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';

export const mockMarkets: Market[] = [
  {
    id: 'f0d4f4ac2f4947ba5a947a2f1bd8f14bcd420bb430ef4da1253f54f6befe6b1d',
    title: 'Eskom Stage 0 Loadshedding Streak',
    description: 'Will South Africa achieve a streak of at least 7 consecutive days at Stage 0 (Loadshedding-free) during the month of June 2026?',
    category: 'Infrastructure',
    status: 'open',
    resolution_date: '2026-06-30T23:59:59Z',
    outcome_tokens: [
      { id: MOCK_CTF_ADDRESS, market_id: 'f0d4f4ac2f4947ba5a947a2f1bd8f14bcd420bb430ef4da1253f54f6befe6b1d', label: 'YES', symbol: 'LS0-YES' },
      { id: MOCK_COLLATERAL_ADDRESS, market_id: 'f0d4f4ac2f4947ba5a947a2f1bd8f14bcd420bb430ef4da1253f54f6befe6b1d', label: 'NO', symbol: 'LS0-NO' },
    ],
  },
  {
    id: '1f72a3789fb8b20d5633b71799dea851aea56b8a5d6ef3b441261aaf8fa7879c',
    title: 'SARB Repo Rate (July 2026)',
    description: 'Will the South African Reserve Bank (SARB) increase the repo rate at its Monetary Policy Committee (MPC) meeting in July 2026?',
    category: 'Economics',
    status: 'open',
    resolution_date: '2026-07-23T23:59:59Z',
    outcome_tokens: [
      { id: MOCK_CTF_ADDRESS, market_id: '1f72a3789fb8b20d5633b71799dea851aea56b8a5d6ef3b441261aaf8fa7879c', label: 'YES', symbol: 'REPO-YES' },
      { id: MOCK_COLLATERAL_ADDRESS, market_id: '1f72a3789fb8b20d5633b71799dea851aea56b8a5d6ef3b441261aaf8fa7879c', label: 'NO', symbol: 'REPO-NO' },
    ],
  },
  {
    id: 'a6a3192c7b78f35d4bd215b43aedd670298f5a26da9e0d62dce11381337424d3',
    title: 'ZAR/USD Exchange Rate (July 1, 2026)',
    description: 'Will the USD/ZAR mid-market exchange rate be 18.50 or higher at 12:00 PM SAST on July 1, 2026?',
    category: 'Finance',
    status: 'open',
    resolution_date: '2026-07-01T10:00:00Z',
    outcome_tokens: [
      { id: MOCK_CTF_ADDRESS, market_id: 'a6a3192c7b78f35d4bd215b43aedd670298f5a26da9e0d62dce11381337424d3', label: 'YES', symbol: 'ZAR-YES' },
      { id: MOCK_COLLATERAL_ADDRESS, market_id: 'a6a3192c7b78f35d4bd215b43aedd670298f5a26da9e0d62dce11381337424d3', label: 'NO', symbol: 'ZAR-NO' },
    ],
  },
  {
    id: 'e46e1a2799251b2233eea8d0e1f7a1675ee3b584f8e29395900d933f711e6146',
    title: 'South Africa CPI Inflation (May 2026)',
    description: 'Will South Africa\'s Year-on-Year CPI inflation rate for May 2026 be reported by StatsSA as strictly higher than 4.5%?',
    category: 'Economics',
    status: 'open',
    resolution_date: '2026-06-24T23:59:59Z',
    outcome_tokens: [
      { id: MOCK_CTF_ADDRESS, market_id: 'e46e1a2799251b2233eea8d0e1f7a1675ee3b584f8e29395900d933f711e6146', label: 'YES', symbol: 'CPI-YES' },
      { id: MOCK_COLLATERAL_ADDRESS, market_id: 'e46e1a2799251b2233eea8d0e1f7a1675ee3b584f8e29395900d933f711e6146', label: 'NO', symbol: 'CPI-NO' },
    ],
  },
  {
    id: '3e0a92411dafba760cd0cfa0e9d15d90528ada0ae969ecddf090bc5de1ceee4b',
    title: '2026 FIFA World Cup - Opening Match (Mexico)',
    description: 'Will Mexico win the opening match of the 2026 FIFA World Cup?',
    category: 'Sports',
    status: 'open',
    resolution_date: '2026-06-11T23:59:59Z',
    outcome_tokens: [
      { id: MOCK_CTF_ADDRESS, market_id: '3e0a92411dafba760cd0cfa0e9d15d90528ada0ae969ecddf090bc5de1ceee4b', label: 'YES', symbol: 'MEX-YES' },
      { id: MOCK_COLLATERAL_ADDRESS, market_id: '3e0a92411dafba760cd0cfa0e9d15d90528ada0ae969ecddf090bc5de1ceee4b', label: 'NO', symbol: 'MEX-NO' },
    ],
  },
  {
    id: 'uma-market-1',
    title: 'Eskom Maintenance Schedule Adherence',
    description: 'Will Eskom adhere to its publicized maintenance schedule for June 2026 without any unplanned breakdowns exceeding 5GW?',
    category: 'Infrastructure',
    status: 'uma_proposed',
    resolution_date: '2026-06-15T12:00:00Z',
    outcome_tokens: [
      { id: 't1', market_id: 'uma-market-1', label: 'YES', symbol: 'ESKM-YES' },
      { id: 't2', market_id: 'uma-market-1', label: 'NO', symbol: 'ESKM-NO' },
    ],
    uma_proposal_id: 'prop-123',
    uma_proposer: '0x123...abc',
    uma_proposed_outcome: 'YES',
    uma_liveness_ends: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
  },
  {
    id: 'uma-market-2',
    title: 'Johannesburg Water Supply Reliability',
    description: 'Will Rand Water report a continuous water supply to all Joburg Metro regions during the first week of June 2026?',
    category: 'Water',
    status: 'uma_challenged',
    resolution_date: '2026-06-08T12:00:00Z',
    outcome_tokens: [
      { id: 't3', market_id: 'uma-market-2', label: 'YES', symbol: 'WATR-YES' },
      { id: 't4', market_id: 'uma-market-2', label: 'NO', symbol: 'WATR-NO' },
    ],
    uma_proposal_id: 'prop-456',
    uma_proposer: '0x456...def',
    uma_proposed_outcome: 'NO',
    uma_challenger: '0x789...ghi',
    uma_liveness_ends: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Ended 2 hours ago
  },
];

export async function getMarketById(id: string): Promise<Market | undefined> {
  return mockMarkets.find((m) => m.id === id);
}

export const mockHoldings = [];
export const mockTrades = [];
export const mockUserProfile = {
  id: 'u1',
  username: 'sangoma_trader',
  full_name: 'Thabo Mbeki',
  email: 'thabo@example.com',
  balance_sngm: 1250.00,
  balance_zar: 500.00,
  kyc_status: 'verified',
  id_number: '9001015000081',
  bank_account_number: '123456789',
  bank_name: 'Standard Bank',
  kyc_verified_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
};
export const mockTransactions = [];
export const mockProposals: any[] = [
  {
    id: 'prop-eskom-rehearsal',
    user_id: 'u1',
    title: 'Eskom Stage 0 Loadshedding Streak',
    description: 'Will South Africa achieve a streak of at least 7 consecutive days at Stage 0 (Loadshedding-free) during the month of June 2026?',
    category: 'Infrastructure',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prop-1',
    user_id: 'u1',
    title: 'Next Petrol Price Adjustment',
    description: 'Will the petrol price (95 ULP) increase by more than 50 cents in July 2026?',
    category: 'Economics',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'prop-2',
    user_id: 'u2',
    title: 'Cape Town Dam Levels',
    description: 'Will the total dam levels in the Western Cape exceed 85% by the end of August 2026?',
    category: 'Water',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  }
];
export const mockDisputes = [];
