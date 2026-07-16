import { Market, OutcomeToken } from './types';
import { mockMarkets } from './mock-data';
import { ethers } from 'ethers';

// ---- Configuration ----
const AMOY_RPC_URL = 'https://rpc-amoy.polygon.technology/';
const CTF_ADDRESS = '0xB81f3e0A187dFA8006b681056332d7f1b56F7c20';
const COLLATERAL_ADDRESS = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';
const FACTORY_ADDRESS = '0x529da260602643B4895CcDBCD82DB0FCE369577a';
const ORACLE_ADDRESS = '0x1Dcecf7Ad853e4aFb6fb06cE36985AE5d7ab9B1c';

// Minimal ABI for reading market info
const FACTORY_ABI = [
  'function getMarket(uint256 index) view returns (address)',
  'function marketCount() view returns (uint256)',
  'function markets(uint256) view returns (address)',
];

const ORACLE_ABI = [
  'function getRegistration(uint256 questionId) view returns (tuple(address oracle, uint256 reward, uint256 proposalBond, uint256 resolutionTime, bytes ancillaryData))',
];

// ---- On-chain Market Metadata ----
// Maps condition IDs from phase6_market_deployments.json to market metadata
// This will eventually be fetched from a contract, but for now we use a static map
const ONCHAIN_METADATA: Record<string, Partial<Market>> = {
  '0x674fab2004061ec5f2eb390551b6c38e37313622b56c0db74a3b93f03656c656': {
    id: 'f0d4f4ac2f4947ba5a947a2f1bd8f14bcd420bb430ef4da1253f54f6befe6b1d',
    title: 'Eskom Stage 0 Loadshedding Streak',
    description: 'Will South Africa achieve a streak of at least 7 consecutive days at Stage 0 (Loadshedding-free) during the month of June 2026?',
    category: 'Infrastructure',
    resolution_date: '2026-06-30T23:59:59Z',
  },
  '0x2b2e6c243577e19318d5fbf514350fef807eaae2398e0a5de7db76f418eb1fa4': {
    id: '1f72a3789fb8b20d5633b71799dea851aea56b8a5d6ef3b441261aaf8fa7879c',
    title: 'SARB Repo Rate (July 2026)',
    description: 'Will the South African Reserve Bank (SARB) increase the repo rate at its Monetary Policy Committee (MPC) meeting in July 2026?',
    category: 'Economics',
    resolution_date: '2026-07-23T23:59:59Z',
  },
  '0x0c81b5afbd27c2c081adcfec849b5f4dce81e47d6deaf9d7f489178001aeb2bd': {
    id: 'prop-1',
    title: '95 Unleaded Petrol Price (August 2026)',
    description: 'Will the price of 95 Unleaded petrol in South Africa increase by more than 50 cents per litre in August 2026?',
    category: 'Economics',
    resolution_date: '2026-08-01T23:59:59Z',
  },
};

// ---- Provider ----
let provider: ethers.JsonRpcProvider | null = null;

function getProvider(): ethers.JsonRpcProvider | null {
  if (provider) return provider;
  try {
    provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
    return provider;
  } catch {
    console.warn('[onchain] Failed to create provider, using mock data');
    return null;
  }
}

// ---- Helper: Build outcome tokens ----
function makeOutcomeTokens(marketId: string, label: string): OutcomeToken[] {
  const symbol = label.substring(0, 3).toUpperCase();
  return [
    { id: CTF_ADDRESS, market_id: marketId, label: 'YES', symbol: `${symbol}-YES` },
    { id: COLLATERAL_ADDRESS, market_id: marketId, label: 'NO', symbol: `${symbol}-NO` },
  ];
}

// ---- Public API ----

/**
 * Fetch all markets. Falls back to mock data if on-chain connection fails.
 * This is the main entry point for the markets pages.
 */
export async function getMarkets(): Promise<Market[]> {
  try {
    const p = getProvider();
    if (!p) return mockMarkets;

    // Try to get the on-chain market count
    const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, p);
    const count = await factory.marketCount().catch(() => null);

    // If we can't read on-chain, return mock data with on-chain metadata merged
    if (count === null || count === 0n) {
      return mergeWithOnchainMetadata(mockMarkets);
    }

    // For now, return mock data with on-chain metadata merged
    // Future: iterate over on-chain markets and build Market objects from contract data
    return mergeWithOnchainMetadata(mockMarkets);
  } catch (error) {
    console.warn('[onchain] getMarkets failed, using mock data:', error);
    return mockMarkets;
  }
}

/**
 * Get a single market by ID. Falls back to mock data.
 */
export async function getMarketById(id: string): Promise<Market | undefined> {
  const markets = await getMarkets();
  return markets.find((m) => m.id === id);
}

/**
 * Get market by condition ID (from on-chain deployments).
 */
export async function getMarketByConditionId(conditionId: string): Promise<Market | undefined> {
  const meta = ONCHAIN_METADATA[conditionId];
  if (!meta) return undefined;

  const markets = await getMarkets();
  return markets.find((m) => m.id === meta.id);
}

/**
 * Check if the on-chain provider is connected.
 */
export async function isOnChainConnected(): Promise<boolean> {
  try {
    const p = getProvider();
    if (!p) return false;
    const block = await p.getBlockNumber();
    return block > 0;
  } catch {
    return false;
  }
}

/**
 * Get the on-chain connection status info.
 */
export async function getChainStatus(): Promise<{
  connected: boolean;
  blockNumber: number | null;
  chainId: number | null;
  usingMockData: boolean;
}> {
  try {
    const p = getProvider();
    if (!p) return { connected: false, blockNumber: null, chainId: null, usingMockData: true };
    const [block, network] = await Promise.all([p.getBlockNumber(), p.getNetwork()]);
    return { connected: true, blockNumber: block, chainId: Number(network.chainId), usingMockData: false };
  } catch {
    return { connected: false, blockNumber: null, chainId: null, usingMockData: true };
  }
}

// ---- Internal: merge mock data with on-chain metadata ----
function mergeWithOnchainMetadata(markets: Market[]): Market[] {
  const conditionIds = Object.keys(ONCHAIN_METADATA);
  const onchainMarkets: Market[] = conditionIds.map((conditionId, index) => {
    const meta = ONCHAIN_METADATA[conditionId]!;
    return {
      id: meta.id || `onchain-${index}`,
      title: meta.title || `Market #${index + 1}`,
      description: meta.description || '',
      category: (meta.category as Market['category']) || 'Infrastructure',
      status: 'open',
      resolution_date: meta.resolution_date || new Date(Date.now() + 30 * 86400000).toISOString(),
      outcome_tokens: makeOutcomeTokens(meta.id || `onchain-${index}`, meta.title || 'Market'),
      // Add on-chain identifiers
      conditionId,
      is_council_verified: true,
    } as Market;
  });

  // Return on-chain markets first, then any remaining mock markets
  const mockIds = new Set(onchainMarkets.map((m) => m.id));
  const remainingMock = markets.filter((m) => !mockIds.has(m.id));
  return [...onchainMarkets, ...remainingMock];
}

// Extend the Market type to include conditionId
declare module './types' {
  interface Market {
    conditionId?: string;
  }
}