# Sangoma Developer Handbook

## Architecture Overview
Sangoma is a decentralized prediction market for the South African context. It uses a hybrid model:
1.  **Phase 1 (Alpha)**: Centralized matching engine (Go/Node.js) and database-backed settlement for low latency.
2.  **Phase 2**: Transition to Account Abstraction (Gnosis Safe) for user funds.
3.  **Phase 3**: Full on-chain settlement using the Conditional Tokens Framework (CTF) on Polygon.

### Core Components
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React.
- **Backend**: Next.js API Routes.
- **Database**: 
    - **SQLite**: Local persistence for market proposals and metadata (Path: `/home/team/.data/agent-team-ef814b89.db`).
    - **JSON Files**: User profiles (`user_profiles.json`) and Pioneer registrations (`pioneer_registrations.json`) are stored in `/home/team/shared/`.
- **Matching Engine (SME)**: Standalone Bun-based service running on port 8080.
    - **Implementation**: The engine runs `engine.ts` using Bun. The source code is located in `/home/team/shared/sangoma-matching-engine/`.
    - **Persistence**: Matches and orders are logged to `trades.jsonl` and `orders.jsonl` in the engine directory.
    - **Source Code Note**: While the lead mentioned a Go/Node hybrid, the active version is the Bun/TypeScript implementation. The original Go source code is not present in the current sandbox environment; only a legacy `sme` binary exists. Rebuilding the matching engine from source requires `engine.ts`.
- **Oracle/Resolution**:
    - **UMA Optimistic Oracle**: Decentralized resolution via `SangomaUMAOracle` (Amoy: `0x3a299F96E0dD8B767Ddc1BC8e3199FF32F203235`).
    - **Data Feeds**: EskomSePush for automated loadshedding market resolution.

## Core Technologies
- **Next.js 15+**: App router, Server Components, Route Handlers.
- **TypeScript**: Shared types in `src/lib/types.ts`.
- **Tailwind CSS**: Custom 'African-tech' aesthetic (Cream, Green, Gold, Earth tones).
- **Ethers.js v6**: EIP-712 order signing and blockchain interaction.
- **SQLite**: Accessed via `sqlite3` CLI in `src/lib/db.ts`.

## Integration Details
### Sangoma Matching Engine (SME)
Accessed via WebSocket (`sme-client.ts`).
- **Standard**: Orders follow EIP-712 for cryptographic signatures.
- **Flow**: `place_order` -> SME matches -> Event emitted to frontend.

### UMA Resolution Flow
1.  **Request**: Council calls `requestResolution` on `SangomaUMAOracle`.
2.  **Liveness**: 2-hour period for disputes.
3.  **Settlement**: `assertionResolvedCallback` triggers `resolveMarket` on core oracle.

### Data Feeds (EskomSePush)
- **API**: `https://developer.sepush.co.za/business/2.0`.
- **Utility**: `getESPStatus` in `eskom-se-push.ts` polls status and stage.

## Recovery Guide
### System Solidification & Reverse Engineering
1.  **Database Recovery**: If the SQLite database is lost:
    - Re-run `db/schema_v4_governance.sql`.
    - Note that `/home/team/.data/agent-team-ef814b89.db` is the shared file.
2.  **User Profiles**: `/home/team/shared/user_profiles.json` is the source of truth for user balances and KYC status during Alpha. Ensure this file is backed up.
3.  **Matching Engine**:
    - **Rebuild**: If the `sme` binary is lost, use the Bun implementation in `engine.ts`.
    - **Startup**: `cd /home/team/shared/sangoma-matching-engine && nohup bun run engine.ts > engine.log 2>&1 &`.
    - **Check**: `sudo lsof -i :8080` to verify it's listening.
4.  **Frontend**:
    - Re-install dependencies with `bun install`.
    - Check `.env.local` for Supabase and SME WebSocket URLs.

## Operational Workflows
### Code Delivery
- Follow `WORKFLOW.md`: Feature branches -> PR -> Lead Review.
- Commit strategic docs (architecture, regulatory) to `docs/` in `Sangoma-PM`.

### Market Lifecycle
1.  **Proposal**: User submits via `/proposals` (saved to SQLite).
2.  **Approval**: Sangoma Council reviews and updates status.
3.  **Trading**: Open for trading via SME.
4.  **Resolution**: Automated (ESP) or Optimistic (UMA).
