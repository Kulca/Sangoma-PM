import { Market, OutcomeToken, Trade, Order, MarketStatus } from './types';
import { mockMarkets, mockHoldings, mockTrades, mockUserProfile } from './mock-data';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// Configuration — Actual Deployed Contracts (Polygon Amoy)
// ============================================================
const AMOY_RPC_URL = 'https://polygon-amoy-bor-rpc.publicnode.com';

const CONTRACTS = {
  MockCTF: '0xB81f3e0A187dFA8006b681056332d7f1b56F7c20',
  SangomaOracle: '0xeD86704a80bda5E118576f8746A1128d31A596E5',
  SangomaMarketFactory: '0x75Eb6a22e9D229C7Ada626DfEfFD4f5CCDA39b51',
  SangomaUMAOracle: '0x3a299F96E0dD8B767Ddc1BC8e3199FF32F203235',
  SangomaGenesisNFT: '0x75Eb6a22e9D229C7Ada626DfEfFD4f5CCDA39b51',
  MockUSDC: '0x9b4A302A548c7e313c2b74C461db7b84d3074A84',
  SangomaExchange: '0xe302CA1137bC0BEe3A1A615C485b8Bc54262D47f',
};

// ============================================================
// Contract ABIs (minimal read-only interfaces)
// ============================================================
const MOCK_CTF_ABI = [
  'function conditions(bytes32 questionId) view returns (address oracle, uint outcomeSlotCount, bool prepared, uint[] payouts)',
  'function getPayouts(bytes32 questionId) view returns (uint[])',
];

const SANGOMA_ORACLE_ABI = [
  'function ctf() view returns (address)',
  'function isAuthorizedResolver(address) view returns (bool)',
];

const SANGOMA_MARKET_FACTORY_ABI = [
  'function ctf() view returns (address)',
  'function sangomaOracle() view returns (address)',
];

// ============================================================
// Static Market Registry (from phase6_market_deployments.json)
// Maps conditionId → market metadata
// ============================================================
interface OnchainMarketMeta {
  id: string;
  title: string;
  description: string;
  category: Market['category'];
  resolution_date: string;
  questionId: string;
  outcomes: string[];
}

const ONCHAIN_METADATA: Record<string, OnchainMarketMeta> = {
  '0x674fab2004061ec5f2eb390551b6c38e37313622b56c0db74a3b93f03656c656': {
    id: 'f0d4f4ac2f4947ba5a947a2f1bd8f14bcd420bb430ef4da1253f54f6befe6b1d',
    title: 'Eskom Stage 0 Loadshedding Streak',
    description: 'Will South Africa achieve a streak of at least 7 consecutive days at Stage 0 (Loadshedding-free) during the month of July 2026?',
    category: 'Infrastructure',
    resolution_date: '2026-07-31T23:59:59Z',
    questionId: '0x3ad8f46b02256585f7c767ddfb4266ad011560a1966cb2604dfad214a661c425',
    outcomes: ['Yes (Stage 0 achieved)', 'No'],
  },
  '0x2b2e6c243577e19318d5fbf514350fef807eaae2398e0a5de7db76f418eb1fa4': {
    id: '1f72a3789fb8b20d5633b71799dea851aea56b8a5d6ef3b441261aaf8fa7879c',
    title: 'SARB Repo Rate (July 2026)',
    description: 'Will the South African Reserve Bank (SARB) cut the repo rate at its MPC meeting in July 2026?',
    category: 'Economics',
    resolution_date: '2026-07-23T23:59:59Z',
    questionId: '0x0a77b446ab417982354c334f40101a70df2af810285c1a7d0a31c81fd2c79342',
    outcomes: ['Rate Cut', 'No Change / Hike'],
  },
  '0x0c81b5afbd27c2c081adcfec849b5f4dce81e47d6deaf9d7f489178001aeb2bd': {
    id: 'a6a3192c7b78f35d4bd215b43aedd670298f5a26da9e0d62dce11381337424d3',
    title: '95 Unleaded Petrol Price (August 2026)',
    description: 'Will the price of 95 Unleaded petrol in South Africa be above R24.00 per litre in August 2026?',
    category: 'Economics',
    resolution_date: '2026-08-01T23:59:59Z',
    questionId: '0xf27b8b35cc739906b6849d563922f368f9a1965b75ab2bbb876bd7d5bcf6ad10',
    outcomes: ['Above R24/L', 'R24/L or Below'],
  },
};

// ============================================================
// Provider
// ============================================================
let provider: ethers.JsonRpcProvider | null = null;
let lastProviderAttempt = 0;

function getProvider(): ethers.JsonRpcProvider | null {
  const now = Date.now();
  // Only retry provider creation every 30 seconds to avoid thundering herd
  if (provider === null && now - lastProviderAttempt < 30000) return null;
  if (provider) return provider;
  
  lastProviderAttempt = now;
  try {
    provider = new ethers.JsonRpcProvider(AMOY_RPC_URL, {
      chainId: 80002, // Polygon Amoy
      name: 'polygon-amoy',
    });
    return provider;
  } catch {
    console.warn('[onchain] Failed to create provider, using mock data');
    return null;
  }
}

// ============================================================
// SME Data File Paths (for trade/order history)
// ============================================================
const SME_ORDERS_PATH = '/home/team/shared/sangoma-matching-engine/orders.jsonl';
const SME_TRADES_PATH = '/home/team/shared/sangoma-matching-engine/trades.jsonl';

function readSmeData(filePath: string): any[] {
  try {
    // Guard: only works server-side (Node.js fs)
    if (typeof process === 'undefined' || !process.versions?.node) return [];
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    if (!content) return [];
    return content.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

// ============================================================
// Helper: Build outcome tokens
// ============================================================
function makeOutcomeTokens(marketId: string, title: string, outcomes: string[]): OutcomeToken[] {
  return outcomes.map((outcome, i) => ({
    id: `${marketId}-${i}`,
    market_id: marketId,
    label: outcome,
    symbol: `${title.substring(0, 3).toUpperCase()}-${i === 0 ? 'YES' : 'NO'}`,
    probability: 0.5,
  }));
}

// ============================================================
// Helper: Determine market status from on-chain data
// ============================================================
function determineStatus(
  prepared: boolean,
  resolved: boolean,
  hasUmaAssertion: boolean
): MarketStatus {
  if (resolved) return 'resolved';
  if (hasUmaAssertion) return 'uma_proposed';
  if (!prepared) return 'open';
  return 'open';
}

// ============================================================
// Helper: Read condition data from MockCTF
// ============================================================
async function readCondition(questionId: string): Promise<{
  oracle: string;
  outcomeSlotCount: number;
  prepared: boolean;
  payouts: number[];
  resolved: boolean;
} | null> {
  try {
    const p = getProvider();
    if (!p) return null;

    const ctf = new ethers.Contract(CONTRACTS.MockCTF, MOCK_CTF_ABI, p);
    const qIdBytes = ethers.hexlify(ethers.getBytes(questionId));
    const result = await ctf.conditions(qIdBytes);
    
    const payouts: bigint[] = result.payouts;
    const hasPayouts = payouts.length > 0 && payouts.some((p) => p > 0n);

    return {
      oracle: result.oracle,
      outcomeSlotCount: Number(result.outcomeSlotCount),
      prepared: result.prepared,
      payouts: payouts.map((p) => Number(p)),
      resolved: hasPayouts,
    };
  } catch (error) {
    console.warn(`[onchain] Failed to read condition for ${questionId}:`, error);
    return null;
  }
}

// ============================================================
// Public API: Markets
// ============================================================

/**
 * Fetch all markets — reads on-chain conditions and merges with static metadata.
 * Falls back to mock data if on-chain connection fails.
 */
export async function getMarkets(): Promise<Market[]> {
  try {
    const p = getProvider();
    if (!p) return buildOnchainMarkets(null);

    // Read on-chain conditions for all registered markets
    const onchainMarkets = await buildOnchainMarkets(p);
    if (onchainMarkets.length > 0) {
      return onchainMarkets;
    }
    
    // Fallback to mock data with on-chain metadata merged
    return buildOnchainMarkets(null);
  } catch (error) {
    console.warn('[onchain] getMarkets failed, using mock data:', error);
    return buildOnchainMarkets(null);
  }
}

/**
 * Build market objects from on-chain data + static metadata.
 * If provider is null, returns markets with no on-chain condition data.
 */
async function buildOnchainMarkets(p: ethers.JsonRpcProvider | null): Promise<Market[]> {
  const conditionIds = Object.keys(ONCHAIN_METADATA);
  const markets: Market[] = [];

  for (const conditionId of conditionIds) {
    const meta = ONCHAIN_METADATA[conditionId]!;
    
    let condition = null;
    if (p) {
      condition = await readCondition(meta.questionId);
    }

    // Read UMA assertion status from SangomaUMAOracle
    let hasUmaAssertion = false;
    if (p) {
      try {
        const umaOracle = new ethers.Contract(
          CONTRACTS.SangomaUMAOracle,
          ['function marketToAssertion(bytes32) view returns (bytes32)'],
          p
        );
        const qIdBytes = ethers.hexlify(ethers.getBytes(meta.questionId));
        const assertionId = await umaOracle.marketToAssertion(qIdBytes);
        hasUmaAssertion = assertionId !== ethers.ZeroHash;
      } catch {
        // UMA identifier not registered on Amoy — expected
      }
    }

    const resolved = condition?.resolved ?? false;
    const status = determineStatus(
      condition?.prepared ?? false,
      resolved,
      hasUmaAssertion
    );

    const market: Market = {
      id: meta.id,
      title: meta.title,
      description: meta.description,
      category: meta.category,
      status,
      resolution_date: meta.resolution_date,
      resolved_at: resolved ? new Date().toISOString() : undefined,
      outcome_tokens: makeOutcomeTokens(meta.id, meta.title, meta.outcomes),
      is_council_verified: true,
      // On-chain data attached as extra fields
      ...(condition ? {
        conditionId,
        questionId: meta.questionId,
        oracle: condition.oracle,
        outcomeSlotCount: condition.outcomeSlotCount,
        prepared: condition.prepared,
        payouts: condition.payouts,
        resolved,
      } : { conditionId }),
    } as Market;

    markets.push(market);
  }

  return markets;
}

/**
 * Get a single market by ID.
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

// ============================================================
// Public API: Chain Status
// ============================================================

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
  contracts: Record<string, { address: string; connected: boolean }>;
}> {
  try {
    const p = getProvider();
    if (!p) {
      return {
        connected: false,
        blockNumber: null,
        chainId: null,
        usingMockData: true,
        contracts: Object.fromEntries(
          Object.entries(CONTRACTS).map(([k, v]) => [k, { address: v, connected: false }])
        ),
      };
    }
    const [block, network] = await Promise.all([p.getBlockNumber(), p.getNetwork()]);
    
    // Verify each contract has code
    const contractStatus: Record<string, { address: string; connected: boolean }> = {};
    for (const [key, address] of Object.entries(CONTRACTS)) {
      try {
        const code = await p.getCode(address);
        contractStatus[key] = { address, connected: code !== '0x' };
      } catch {
        contractStatus[key] = { address, connected: false };
      }
    }

    return {
      connected: true,
      blockNumber: block,
      chainId: Number(network.chainId),
      usingMockData: false,
      contracts: contractStatus,
    };
  } catch {
    return {
      connected: false,
      blockNumber: null,
      chainId: null,
      usingMockData: true,
      contracts: Object.fromEntries(
        Object.entries(CONTRACTS).map(([k, v]) => [k, { address: v, connected: false }])
      ),
    };
  }
}

// ============================================================
// Public API: User Positions (from SME data files)
// ============================================================

export interface UserPosition {
  marketId: string;
  outcomeTokenId: string;
  side: 'buy' | 'sell';
  quantity: number;
  filledQuantity: number;
  averagePrice: number;
  currentValue: number;
  pnl: number;
}

/**
 * Get user positions — reads from SME orders and trades data.
 * In a full implementation, this would also read on-chain balanceOf().
 */
export async function getUserPositions(userId: string): Promise<UserPosition[]> {
  try {
    // Read SME orders and trades for this user
    const orders = readSmeData(SME_ORDERS_PATH).filter((o) => o.user_id === userId);
    const trades = readSmeData(SME_TRADES_PATH);
    
    const positions: Map<string, UserPosition> = new Map();

    // Process open orders
    for (const order of orders) {
      const key = `${order.market_id}:${order.outcome_token_id}`;
      const existing = positions.get(key);
      const filledQty = (order.quantity || 0) - (order.remaining_quantity || order.quantity || 0);
      
      if (existing) {
        existing.quantity += order.quantity || 0;
        existing.filledQuantity += filledQty;
      } else {
        positions.set(key, {
          marketId: order.market_id,
          outcomeTokenId: order.outcome_token_id,
          side: order.side,
          quantity: order.quantity || 0,
          filledQuantity: filledQty,
          averagePrice: order.price || 0,
          currentValue: 0,
          pnl: 0,
        });
      }
    }

    return Array.from(positions.values());
  } catch {
    return [];
  }
}

// ============================================================
// Public API: User Trade History (from SME data files)
// ============================================================

/**
 * Get trade history for a user.
 * Reads from SME trades.jsonl and matches against user orders.
 */
export async function getUserTrades(userId: string): Promise<Trade[]> {
  try {
    // Get all trades
    const trades = readSmeData(SME_TRADES_PATH);
    const orders = readSmeData(SME_ORDERS_PATH).filter((o) => o.user_id === userId);
    const orderIds = new Set(orders.map((o) => o.id));

    // Filter trades that involve this user's orders
    return trades.filter(
      (t: any) => orderIds.has(t.buy_order_id) || orderIds.has(t.sell_order_id)
    ).map((t: any) => ({
      id: t.id,
      market_id: t.market_id,
      outcome_token_id: t.outcome_token_id,
      buy_order_id: t.buy_order_id,
      sell_order_id: t.sell_order_id,
      price: t.price,
      quantity: t.quantity,
      executed_at: new Date(t.timestamp || t.executed_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

/**
 * Get all trade history (no user filter).
 */
export async function getAllTrades(): Promise<Trade[]> {
  try {
    return readSmeData(SME_TRADES_PATH).map((t: any) => ({
      id: t.id,
      market_id: t.market_id,
      outcome_token_id: t.outcome_token_id,
      buy_order_id: t.buy_order_id,
      sell_order_id: t.sell_order_id,
      price: t.price,
      quantity: t.quantity,
      executed_at: new Date(t.timestamp || t.executed_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

/**
 * Get open orders from the SME.
 */
export async function getOpenOrders(marketId?: string): Promise<Order[]> {
  try {
    const orders = readSmeData(SME_ORDERS_PATH);
    let filtered = orders.filter((o: any) => o.status === 'open' || !o.status);
    if (marketId) {
      filtered = filtered.filter((o: any) => o.market_id === marketId);
    }
    return filtered.map((o: any) => ({
      id: o.id,
      user_id: o.user_id,
      market_id: o.market_id,
      outcome_token_id: o.outcome_token_id,
      side: o.side,
      price: o.price,
      quantity: o.quantity,
      remaining_quantity: o.remaining_quantity || o.quantity,
      status: o.status || 'open',
    }));
  } catch {
    return [];
  }
}

// ============================================================
// Public API: Resolution Data
// ============================================================

/**
 * Get resolution events from the SangomaOracle.
 * Reads from on-chain event logs.
 */
export async function getResolutions(): Promise<{
  questionId: string;
  marketName: string;
  payouts: number[];
  blockNumber: number;
}[]> {
  try {
    const p = getProvider();
    if (!p) return [];

    const oracle = new ethers.Contract(
      CONTRACTS.SangomaOracle,
      ['event OutcomeReported(bytes32 indexed questionId, uint[] payouts)'],
      p
    );

    const events = await oracle.queryFilter(oracle.filters.OutcomeReported(), 0);
    const marketByQuestionId = Object.fromEntries(
      Object.values(ONCHAIN_METADATA).map((m) => [m.questionId, m.title])
    );

    return events.map((event) => ({
      questionId: event.args.questionId as string,
      marketName: marketByQuestionId[event.args.questionId as string] || 'Unknown Market',
      payouts: (event.args.payouts as bigint[]).map((p) => Number(p)),
      blockNumber: event.log?.blockNumber ?? 0,
    }));
  } catch {
    return [];
  }
}

// ============================================================
// Public API: Authorized Resolvers
// ============================================================

export async function getAuthorizedResolvers(): Promise<{
  address: string;
  authorized: boolean;
  name: string;
}[]> {
  try {
    const p = getProvider();
    if (!p) return [];

    const oracle = new ethers.Contract(CONTRACTS.SangomaOracle, SANGOMA_ORACLE_ABI, p);
    
    const resolversToCheck = [
      { address: CONTRACTS.SangomaOracle, name: 'SangomaOracle' },
      { address: CONTRACTS.SangomaUMAOracle, name: 'SangomaUMAOracle' },
    ];

    const results = [];
    for (const r of resolversToCheck) {
      try {
        const status = await oracle.isAuthorizedResolver(r.address);
        results.push({ address: r.address, authorized: status, name: r.name });
      } catch {
        results.push({ address: r.address, authorized: false, name: r.name });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// ============================================================
// Public API: Static Data
// ============================================================

/**
 * Get the static market registry (no on-chain calls).
 */
export function getStaticMarkets() {
  return Object.entries(ONCHAIN_METADATA).map(([conditionId, meta]) => ({
    conditionId,
    ...meta,
  }));
}

/**
 * Get the contract registry.
 */
export function getContractRegistry() {
  return Object.entries(CONTRACTS).map(([key, address]) => ({
    key,
    address,
    name: key,
  }));
}

// ============================================================
// Extend Market type with on-chain fields
// ============================================================
declare module './types' {
  interface Market {
    conditionId?: string;
    questionId?: string;
    oracle?: string;
    outcomeSlotCount?: number;
    prepared?: boolean;
    payouts?: number[];
    resolved?: boolean;
  }
}