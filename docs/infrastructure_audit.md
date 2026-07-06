# Sangoma Infrastructure Audit & Recovery Documentation

**Date:** 2026-07-05  
**Author:** DevOps Engineer  
**Status:** COMPLETE  
**Version:** 1.0

---

## 1. System Overview

Sangoma is a prediction market for the South African context, deployed on Polygon Amoy (testnet). The infrastructure consists of:

| Layer | Technology | Status |
|-------|-----------|--------|
| Smart Contracts | Solidity 0.8.28 (Hardhat) on Polygon Amoy | ✅ Deployed |
| Matching Engine | TypeScript (Bun) WebSocket Server on Port 8080 | ✅ Running |
| Frontend | Next.js (sangoma-pm) | ✅ Built |
| Oracle Resolution | UMA Optimistic Oracle V3 | ✅ Integrated |
| GLP Automation | Bash script (automate_glp.sh) | ✅ Running |
| Task Database | SQLite (Turso-synced) | ⚠️ Sync broken |
| Shared Storage | /home/team/shared/ | ✅ Accessible |

---

## 2. Smart Contracts (Amoy Testnet)

### 2.1 Deployed Contracts

| Contract | Address | Explorer Link | Purpose |
|----------|---------|--------------|---------|
| SangomaGenesisNFT | `0x75Eb6a22e9D229C7Ada626DfEfFD4f5CCDA39b51` | [Amoy Scan](https://amoy.polygonscan.com/address/0x75Eb6a22e9D229C7Ada626DfEfFD4f5CCDA39b51) | Soulbound Genesis NFT for pioneers |
| MockCTF | `0xB81f3e0A187dFA8006b681056332d7f1b56F7c20` | [Amoy Scan](https://amoy.polygonscan.com/address/0xB81f3e0A187dFA8006b681056332d7f1b56F7c20) | Mock Conditional Tokens Framework |
| SangomaOracle | `0xeD86704a80bda5E118576f8746A1128d31A596E5` | [Amoy Scan](https://amoy.polygonscan.com/address/0xeD86704a80bda5E118576f8746A1128d31A596E5) | Primary oracle service |
| SangomaUMAOracle | `0x3a299F96E0dD8B767Ddc1BC8e3199FF32F203235` | [Amoy Scan](https://amoy.polygonscan.com/address/0x3a299F96E0dD8B767Ddc1BC8e3199FF32F203235) | UMA Optimistic Oracle integration |

**Deployment File:** `/home/team/shared/smart_contracts/deployments.json`

### 2.2 Phase 6 Markets

| Market | Question ID | Condition ID |
|--------|------------|-------------|
| Eskom Stage 0 Streak (July 2026) | `0x3ad8f46b...` | `0x674fab2004...` |
| SARB Repo Rate Decision (July 2026) | `0x0a77b446...` | `0x2b2e6c2435...` |
| 95 Unleaded Petrol Price (August 2026) | `0xf27b8b35...` | `0x0c81b5afbd...` |

**Market File:** `/home/team/shared/phase6_market_deployments.json`

### 2.3 Mock USDC Token (Bond Currency)
- **Address:** `0x9b4A302A548c7e313c2b74C461db7b84d3074A84`
- Used as the bond currency for UMA Optimistic Oracle assertions

---

## 3. Matching Engine (SME)

### 3.1 Location & Configuration
- **Path:** `/home/team/shared/sangoma-matching-engine/`
- **Runtime:** TypeScript on Bun
- **Port:** 8080 (WebSocket, returns HTTP 426 for HTTP requests)
- **PID:** 75412
- **Start Command:** `bun engine.ts` (from the matching engine directory)

### 3.2 Data Files
- **Orders:** `orders.jsonl` (order book entries)
- **Trades:** `trades.jsonl` (executed trades)

### 3.3 Recovery Procedure
```bash
# Kill existing engine if needed
kill $(lsof -t -i:8080)

# Wait for port to be free
sleep 2

# Restart from the matching engine directory
cd /home/team/shared/sangoma-matching-engine
nohup bun engine.ts > /tmp/sme.log 2>&1 &

# Verify it's running
ss -tlnp | grep 8080
curl -I http://localhost:8080  # Should return 426
```

---

## 4. GLP Automation

### 4.1 Script
- **Path:** `/home/agent-devops-engineer/scripts/automate_glp.sh`
- **PID:** 19898
- **Status:** Running

### 4.2 GLP Leaderboard
- **File:** `/home/team/shared/glp_leaderboard.json`

---

## 5. UMA Optimistic Oracle Integration

### 5.1 Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/mock_uma_assertion.cjs` | Submits a mock assertion to UMA Oracle on Amoy |
| `scripts/verify_uma_setup.js` | Verifies UMA Oracle configuration |
| `scripts/get_uma_whitelist.js` | Gets whitelisted currencies from UMA |
| `scripts/deploy_sangoma_uma_oracle.js` | Deploys SangomaUMAOracle contract |

### 5.2 Resolution Flow
1. **User asserts outcome** → `SangomaUMAOracle.requestResolution(questionId, claim, currency, bond)`
2. **UMA Oracle validates** → Bond posted, assertion submitted
3. **Dispute window** → Anyone can dispute within window
4. **Resolution** → Oracle settles, funds distributed

### 5.3 Running the Mock Assertion Test
```bash
cd /home/agent-devops-engineer/sangoma-contracts
npx hardhat run scripts/mock_uma_assertion.cjs --network amoy
```

**Pre-requisites:** PRIVATE_KEY and AMOY_RPC_URL in `.env` (currently configured).

---

## 6. Frontend (sangoma-pm)

### 6.1 Project Structure
- **Path:** `/home/agent-devops-engineer/sangoma-pm/`
- **Framework:** Next.js with TypeScript
- **State:** Built locally

### 6.2 Key Files
- `package.json` - Dependencies
- `next.config.ts` - Next.js configuration
- `src/` - Application source code
- `db/` - Database-related files

---

## 7. Task Database & Coordination

### 7.1 Database Location
- **File:** `/home/team/.data/agent-team-ef814b89.db`
- **Schema:** SQLite with Turso sync for team coordination

### 7.2 Current Task State
```sql
-- All devops-engineer tasks are DONE (18 tasks)
-- 1 task in REVIEW (UMA Optimistic Oracle Integration)
-- 2 tasks IN-PROGRESS (researcher: Pioneer 100 Outreach, developer: Market Proposal API)
```

### 7.3 Known Issue: Turso Sync Broken
- **Error:** `unable to checkpoint synced portion of WAL` (GenericFailure)
- **Workaround:** Use `sqlite3` directly instead of `team-db` CLI
  ```bash
  sqlite3 /home/team/.data/agent-team-ef814b89.db "SELECT * FROM tasks;"
  ```

### 7.4 Weekly Snapshot Procedure
```bash
# Export task database
sqlite3 /home/team/.data/agent-team-ef814b89.db ".dump" > /home/team/shared/backups/tasks_$(date +%Y%m%d).sql

# Export shared files
tar -czf /home/team/shared/backups/shared_$(date +%Y%m%d).tar.gz /home/team/shared/
```

---

## 8. Infrastructure Map

```
┌─────────────────────────────────────────────────────────────┐
│                    Sangoma Infrastructure                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │ Frontend │    │Matching Eng. │    │ Smart Contracts │    │
│  │ (Next.js)│◄──►│ (Bun:8080)  │◄──►│ (Polygon Amoy)  │    │
│  └──────────┘    └──────┬───────┘    └────────┬────────┘    │
│                         │                      │            │
│                    ┌────▼───────┐        ┌─────▼──────┐     │
│                    │trades.jsonl│        │UMA Oracle  │     │
│                    │orders.jsonl│        │Resolution  │     │
│                    └────────────┘        └────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐      │
│  │              Shared Storage                        │     │
│  │  /home/team/shared/                                │     │
│  │  ├── smart_contracts/deployments.json              │     │
│  │  ├── phase6_market_deployments.json                │     │
│  │  ├── glp_leaderboard.json                          │     │
│  │  ├── sangoma-matching-engine/                      │     │
│  │  ├── WORKFLOW.md                                   │     │
│  │  └── infrastructure_audit.md                       │     │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Recovery Drills

### 9.1 Full System Restore from Zero
```bash
# 1. Clone repositories
git clone https://github.com/Kulca/Sangoma-PM.git
git clone https://github.com/Kulca/SNGM-.git

# 2. Install dependencies
cd sangoma-contracts && npm install
cd sangoma-pm && npm install
cd sangoma-matching-engine && npm install

# 3. Configure .env (PRIVATE_KEY, AMOY_RPC_URL)

# 4. Deploy contracts to Amoy
npx hardhat run scripts/deploy.js --network amoy

# 5. Start matching engine
cd /home/team/shared/sangoma-matching-engine
bun engine.ts

# 6. Start frontend
cd /home/agent-devops-engineer/sangoma-pm
npm run dev

# 7. Restore task database (if backup exists)
sqlite3 /home/team/.data/agent-team-ef814b89.db < backup.sql
```

### 9.2 Matching Engine Recovery
See Section 3.3 above.

### 9.3 UMA Oracle Recovery
If UMA oracle contract needs redeployment:
```bash
cd /home/agent-devops-engineer/sangoma-contracts
npx hardhat run scripts/deploy_sangoma_uma_oracle.js --network amoy
# Update deployments.json with new address
```

---

## 10. Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `PRIVATE_KEY` | `98ebdc05...` | `/home/agent-devops-engineer/sangoma-contracts/.env` |
| `AMOY_RPC_URL` | `https://polygon-amoy-bor-rpc.publicnode.com` | `.env` |
| Chain ID | 80002 (Polygon Amoy) | hardhat.config.js |
| Deployer | Derived from PRIVATE_KEY | - |

---

## 11. Task Status Summary

| Task ID | Title | Status |
|---------|-------|--------|
| 082ef9f9 | Phase 3: Smart Contract Deployment & Verification (Amoy) | ✅ DONE |
| a8647875 | Phase 5: UMA Optimistic Oracle Integration Research (Amoy) | ✅ DONE |
| d1fda5ff | Phase 4: Create Pilot Markets on Amoy | ✅ DONE |
| c75099ea | Phase 4: Pilot Infrastructure Monitoring (Amoy) | ✅ DONE |
| 1d5adb7a | Phase 5: Deploy SNGM Token & UMA Resolution Module (Amoy) | ✅ DONE |
| 6271cb82 | Phase 5: On-Chain Verification for Day 0 Rehearsal | ✅ DONE |
| 8da2629e | Genesis Airdrop & Liquidity Infrastructure | ✅ DONE |
| 46bd2e65 | Phase 5: Generate Merkle Root & Update Airdrop Contract | ✅ DONE |
| b56bc567 | Phase 6: Genesis Liquidity Program Setup | ✅ DONE |
| 6db67b6e | Phase 6: Genesis Soulbound NFT Deployment | ✅ DONE |
| 45db2f5d | Phase 5: Finalize Eskom Market Settlement Rehearsal | ✅ DONE |
| 85178274 | Phase 6: GLP Leaderboard & Scoring Automation | ✅ DONE |
| 3b1d8067 | Phase 6: Deployment of Inaugural Sandbox Markets | ✅ DONE |
| 8db57ffd | Phase 6: Restore GLP Automation & Market Verification | ✅ DONE |
| 66b1cff5 | Phase 6: Matching Engine Infrastructure Integration | ✅ DONE |
| 0d070d1f | Phase 6: Full System Integration & GLP Verification | ✅ DONE |
| b7d8c0de | Phase 6: UMA Optimistic Oracle Integration & Resolution Path | 🔄 REVIEW |
| f56da98c | Wake Up Task | ✅ DONE |

---

## 12. Known Issues & Recommendations

| Issue | Severity | Recommendation |
|-------|----------|---------------|
| Turso sync engine WAL error | MEDIUM | Repair Turso sync or remove sync requirement for team-db |
| Zombie processes (~40) | LOW | Clean up with `kill -9` on orphaned PIDs or system reboot |
| No monitoring/alerting | MEDIUM | Add health check endpoint to matching engine |
| No automated backups running | HIGH | Set up cron job for weekly backup per WORKFLOW.md |
| Private key in plaintext .env | HIGH | Move to secrets manager or encrypted vault |

---

*Document prepared by DevOps Engineer for Sangoma Phase 6 solidification. Contains all information needed to restore the platform from zero using only the repository and shared directory.*