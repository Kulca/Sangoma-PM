# Mock Smart Contract Audit Report

**Engagement:** Sangoma Prediction Market — Phase 6 Protocol Review  
**Auditor:** BlockShield Security (Independent) — *Mock Report / Template*  
**Date:** 2026-07-06  
**Version:** 1.0 — DRAFT FOR REVIEW  
**Classification:** CONFIDENTIAL  

---

## Disclaimer

> ⚠️ **THIS IS A MOCK AUDIT REPORT.** It serves as a template to demonstrate the structure, format, and depth of analysis we will require from a real third-party audit firm (e.g., Trail of Bits, OpenZeppelin, Code4rena) before mainnet launch. Findings are based on an internal code review and do not constitute a formal security assessment. All severity ratings are provisional and subject to change by a qualified external auditor.

---

## 1. Executive Summary

Sangoma engaged BlockShield Security to perform a security review of 12 smart contracts comprising its prediction market protocol on Polygon Amoy (testnet). The protocol uses a hybrid architecture: off-chain order matching (SME) with on-chain settlement via an ERC-1155-like Conditional Tokens Framework (MockCTF), an oracle service (SangomaOracle), and an optimistic dispute layer (SangomaUMAOracle).

### Scope

| Contract | SLoC | Role |
|----------|------|------|
| SangomaGenesisNFT | 85 | Pioneer soulbound NFT |
| MockCTF | 32 | Mock conditional tokens |
| SangomaOracle | 44 | Primary market resolver |
| SangomaUMAOracle | 116 | UMA OOv3 resolution wrapper |
| UMAResolutionModule | 73 | Fallback UMA module |
| UMAInterfaces | 20 | UMA interface definitions |
| SangomaExchange | 94 | On-chain trade settlement |
| SangomaMarketFactory | 49 | Market creation factory |
| SangomaAirdrop | 62 | Merkle-based airdrop |
| SangomaGovernanceToken | 56 | SNGM ERC-20 token |
| SangomaStaking | 138 | Staking & rewards |
| SangomaGLPVesting | 102 | GLP liquidity vesting |

### Findings Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 1 |
| 🟡 Medium | 3 |
| 🔵 Low | 5 |
| ⚪ Informational | 7 |
| **Total** | **16** |

---

## 2. Detailed Findings

### 🟠 H-01: No Access Control on `reportPayouts` in MockCTF

**File:** `MockCTF.sol:22`  
**Severity:** High  
**Status:** **ACKNOWLEDGED — TESTNET MOCK**

```solidity
function reportPayouts(bytes32 questionId, uint[] calldata payouts) external {
    require(conditions[questionId].prepared, "Condition not prepared");
    require(msg.sender == conditions[questionId].oracle, "Only oracle can report");
    conditions[questionId].payouts = payouts;
}
```

**Description:** The MockCTF restricts `reportPayouts` to the oracle address set during `prepareCondition`, but on testnet this oracle is the SangomaOracle contract. If the SangomaOracle's `resolveMarket` is callable by any authorized resolver, and the deployer is authorized (as is the case for the trial), a compromised deployer key could report arbitrary payouts.

**Recommendation (Mainnet):** Replace MockCTF with a battle-tested Conditional Tokens Framework (e.g., the canonical CTF from Polymarket's Gnosis fork). Add a timelock or multisig requirement for payout reporting.

---

### 🟡 M-01: `requestResolution` Transfers Bond from `msg.sender` Without Balance Check

**File:** `SangomaUMAOracle.sol:73`  
**Severity:** Medium  
**Status:** **OPEN**

```solidity
IERC20(currency).transferFrom(msg.sender, address(this), bond);
```

**Description:** The function relies on an external `transferFrom` call without a prior balance check. If `msg.sender` has approved the contract but lacks sufficient tokens, the transaction will revert silently, wasting gas. Additionally, the approval happens immediately before the transfer, which is redundant for the same spender.

**Recommendation:** Add a `require(balanceOf(msg.sender) >= bond, "Insufficient bond")` check before `transferFrom`. Remove the redundant `approve` call after `transferFrom`.

---

### 🟡 M-02: No Zero-Address Validation for Constructor Parameters

**File:** Multiple contracts (`MarketFactory`, `Exchange`, `Oracle`, etc.)  
**Severity:** Medium  
**Status:** **PARTIALLY RESOLVED**

**Description:** Several constructors validate critical addresses but not all. `SangomaOracle` and `SangomaMarketFactory` have `require` checks for zero addresses, but `SangomaUMAOracle` and `UMAResolutionModule` do not:

```solidity
// SangomaUMAOracle.sol:41 — no zero-address check
constructor(address _umaOracle, address _sangomaOracle, address _council) Ownable(msg.sender) {
    umaOracle = IOptimisticOracleV3(_umaOracle);
    sangomaOracle = ISangomaOracle(_sangomaOracle);
    council = _council;
}
```

**Recommendation:** Add `require(address != address(0))` checks for all constructor address parameters across all contracts.

---

### 🟡 M-03: GovernanceToken `mint` Can Be Called by Any Admin Without Cap

**File:** `SangomaGovernanceToken.sol:43`  
**Severity:** Medium  
**Status:** **ACKNOWLEDGED — INTENDED DESIGN**

```solidity
function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
}
```

**Description:** The `MINTER_ROLE` can mint an unlimited supply of SNGM tokens. There is no cap, no inflation schedule, and no vesting enforced on-chain. A compromised admin key could inflate the supply.

**Recommendation:** Implement a supply cap, a time-based inflation schedule, or move minting to a timelock-governed contract.

---

### 🔵 L-01: `setLiveness` Not Capped to Minimum/Maximum

**File:** `SangomaUMAOracle.sol:53`  
**Severity:** Low  
**Status:** **OPEN**

```solidity
function setDefaultLiveness(uint64 _liveness) external onlyOwner {
    defaultLiveness = _liveness;
}
```

**Description:** The liveness period can be set to any value, including 0 (immediate settlement) or extremely long periods. This could be used to manipulate dispute windows.

**Recommendation:** Add bounds: `require(_liveness >= 3600 && _liveness <= 2592000, "Invalid liveness")`.

---

### 🔵 L-02: Event Not Emitted on `resolveMarket` Parameters

**File:** `SangomaOracle.sol:48`  
**Severity:** Low  
**Status:** **OPEN**

**Description:** The `OutcomeReported` event emits the questionId and payouts, but does not include the resolver address that called the function, making it harder to audit who triggered a resolution.

**Recommendation:** Add `indexed address resolver` to the `OutcomeReported` event.

---

### 🔵 L-03: Payouts Array Not Validated for Length

**File:** `SangomaOracle.sol:48`, `MockCTF.sol:22`  
**Severity:** Low  
**Status:** **OPEN**

```solidity
function resolveMarket(bytes32 questionId, uint[] calldata payouts) external {
    require(isAuthorizedResolver[msg.sender], "Not authorized");
    ctf.reportPayouts(questionId, payouts);
    emit OutcomeReported(questionId, payouts);
}
```

**Description:** The payouts array is not validated for length. An empty array or an array with only one element could be submitted, breaking the YES/NO outcome token assumption.

**Recommendation:** Add `require(payouts.length == outcomeSlotCount, "Invalid payouts length")` before calling `reportPayouts`.

---

### 🔵 L-04: `safeApprove` Deprecated in OpenZeppelin v5

**File:** `SangomaUMAOracle.sol:75`, `UMAResolutionModule.sol:49`  
**Severity:** Low  
**Status:** **OPEN**

```solidity
IERC20(currency).approve(address(umaOracle), bond);
```

**Description:** Using `approve` directly is deprecated in OpenZeppelin v5 in favor of `safeApprove` or `forceApprove`. Some non-standard ERC-20 tokens (e.g., USDT) revert on `approve`.

**Recommendation:** Use `SafeERC20.safeIncreaseAllowance` or `SafeERC20.forceApprove`.

---

### 🔵 L-05: No `_disableInitializers` in Constructor (Upgradeable Pattern)

**File:** N/A — Contracts are not using upgradeable pattern  
**Severity:** Low  
**Status:** **NOT APPLICABLE**

**Note:** Contracts use immutable storage and a straightforward constructor pattern. No upgradeability is planned for Phase 6. This is acceptable for the current scope.

---

### ⚪ I-01: Solidity Pragma Not Locked

**File:** All contracts  
**Severity:** Informational  
**Status:** **OPEN**

```solidity
pragma solidity ^0.8.20;
```

**Description:** Floating pragma (`^0.8.20`) allows compilation with any 0.8.x version ≥ 0.8.20. This may introduce unexpected behavior if compiled with a different version than tested.

**Recommendation:** Lock to `pragma solidity 0.8.28` (matching the hardhat config).

---

### ⚪ I-02: Unused Import in SangomaExchange

**File:** `SangomaExchange.sol`  
**Severity:** Informational  
**Status:** **OPEN**

```solidity
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
```

**Description:** The file inherits from EIP712, but the import is technically unused for runtime (inherited via `is EIP712`). Consider cleaning up unused imports for clarity.

---

### ⚪ I-03: Event Indexing Could Be Improved

**Files:** Multiple  
**Severity:** Informational  
**Status:** **OPEN**

**Description:** Some events do not use `indexed` parameters where they would improve searchability:
- `MarketAssertionRequested` — `marketId` is `indexed` but `assertionId` is not
- `MarketResolved` — neither parameter is `indexed`

**Recommendation:** Add `indexed` to event parameters that would benefit from filtering.

---

### ⚪ I-04: Magic Number `7200` for Liveness

**File:** `UMAResolutionModule.sol:59`  
**Severity:** Informational  
**Status:** **OPEN**

```solidity
7200, // liveness
```

**Description:** The liveness period is hardcoded as a magic number rather than a named constant or configurable parameter.

**Recommendation:** Replace with a named constant: `uint64 constant DEFAULT_LIVENESS = 7200;`.

---

### ⚪ I-05: No Pausable Emergency Stop

**File:** All contracts  
**Severity:** Informational  
**Status:** **ACKNOWLEDGED — DESIGN CHOICE**

**Description:** No contract implements a pausable mechanism (e.g., OpenZeppelin's `Pausable`). In the event of a critical vulnerability, there is no on-chain kill switch.

**Recommendation:** Consider adding `Pausable` to `SangomaOracle` and `SangomaExchange` for the mainnet deployment.

---

### ⚪ I-06: Owner Can Sweep Any ERC-20

**Files:** All `Ownable` contracts  
**Severity:** Informational  
**Status:** **ACKNOWLEDGED — DESIGN CHOICE**

**Description:** Most contracts do not have a `sweep`/`recoverERC20` function, meaning tokens accidentally sent to the contract are permanently locked. Only `SangomaStaking` has explicit token handling.

**Recommendation:** Add a `recoverERC20` function (owner-only) to all contracts that hold tokens.

---

### ⚪ I-07: UMA Identifier `keccak256("ASSERT_TRUTH")` Relies on UMA Whitelist

**File:** `SangomaUMAOracle.sol:85`, `UMAResolutionModule.sol:59`  
**Severity:** Informational  
**Status:** **BLOCKED — TESTNET ISSUE**

**Description:** The `ASSERT_TRUTH` identifier is not registered on Amoy's UMA OOv3 deployment. This prevents end-to-end testing of the optimistic resolution path on testnet. A direct call to `SangomaOracle.resolveMarket()` was used as a workaround.

**Recommendation:** Coordinate with UMA team to register `ASSERT_TRUTH` on Amoy, or deploy a custom UMA OOv3 instance for testing.

---

## 3. Deployment Verification

### Verified On-Chain Addresses (Polygon Amoy)

| Contract | Address | Verification |
|----------|---------|-------------|
| SangomaGenesisNFT | `0x75Eb6a22e9D229C7Ada626DfEfFD4f5CCDA39b51` | ✅ Source-verified on Amoy scan |
| MockCTF | `0xB81f3e0A187dFA8006b681056332d7f1b56F7c20` | ✅ Source-verified |
| SangomaOracle | `0xeD86704a80bda5E118576f8746A1128d31A596E5` | ✅ Source-verified |
| SangomaUMAOracle | `0x3a299F96E0dD8B767Ddc1BC8e3199FF32F203235` | ✅ Source-verified |

### Deployment Verification Steps

```bash
# 1. Verify bytecode matches source
cast code <contract-address> --rpc-url https://polygon-amoy-bor-rpc.publicnode.com

# 2. Verify constructor arguments
cast abi-encode "constructor(address,address)" <arg1> <arg2>

# 3. Verify owner matches deployer
cast call <contract-address> "owner()" --rpc-url <rpc>
```

---

## 4. Functional Test Results

### Oracle Resolution Pipeline

| Test | Result | Transaction |
|------|--------|-------------|
| SangomaOracle.resolveMarket([1,0]) | ✅ PASS | `0x47388753...` (block 41,554,938) |
| OutcomeReported event | ✅ Verified | questionId + payouts [1,0] |
| CTF getPayouts confirmation | ✅ Verified | Returned [1,0] |
| UMA OOv3 mock assertion | ⚠️ BLOCKED | `ASSERT_TRUTH` identifier not registered on Amoy |

### Access Control

| Role | Account | Test Result |
|------|---------|-------------|
| Owner (all Ownable contracts) | `0xfa7410...` | ✅ Verified |
| Authorized Resolver (SangomaOracle) | Same as owner | ✅ Verified by deploy script |
| Council (SangomaUMAOracle) | Same as owner | ✅ Verified |
| MINTER_ROLE (GovernanceToken) | Same as owner | ✅ Verified |
| Unauthorized resolver call | Reverted | ✅ Verified (tested) |

---

## 5. Recommendations for Mainnet

1. **Replace MockCTF** with the full Gnosis Conditional Tokens Framework
2. **Add timelock** (e.g., 48h) for all owner-only administrative functions
3. **Upgrade to OpenZeppelin v5** with explicit `SafeERC20` usage
4. **Add supply cap** to SangomaGovernanceToken
5. **Integrate with a multisig** (e.g., Safe) for the resolver role
6. **Register UMA identifier** on production chain before launch
7. **Engage a qualified third-party auditor** for a full mainnet audit

---

## 6. Appendix: Contract Dependencies Map

```
SangomaMarketFactory ──────────► MockCTF
                                    │
SangomaOracle ◄─── authorized ─────┘
    │
    ├── SangomaUMAOracle (UMA OOv3 wrapper)
    │       │
    │       └── UMAInterfaces (IOptimisticOracleV3)
    │
    └── UMAResolutionModule (fallback)
            │
            └── UMAInterfaces

SangomaExchange ──────────────► MockCTF (CTF interface)
    │
    └── SangomaGovernanceToken (collateral)

SangomaStaking ──────────────► SangomaGovernanceToken
SangomaGLPVesting
SangomaAirdrop (Merkle)
SangomaGenesisNFT (ERC-721 soulbound)
```

---

*Report generated by DevOps Engineer, Team SANGOMA. This is a MOCK document for template purposes. Findings and severity ratings should be validated by a qualified third-party security auditor before any mainnet deployment.*

**End of Report**