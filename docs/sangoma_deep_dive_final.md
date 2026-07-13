# Sangoma: Legal & Technical Deep Dive (Final Report)

## 1. Regulatory Context (South Africa 2026)
Sangoma is positioned as a **Financial Product** under the oversight of the **Financial Sector Conduct Authority (FSCA)**, specifically leveraging the **IFWG Regulatory Sandbox** for its Phase 6 trial.

### Key Regulatory Pillars:
*   **CASP Status:** Operating as a Crypto Asset Service Provider (CASP). The FSCA licensing framework (matured since 2024) allows Sangoma to provide "intermediary services" for crypto-based derivatives.
*   **Classification:** Structured as a "Hedging Tool" or "Contract for Difference" (CFD) to distinguish from gambling. The utility is focused on **informational hedging** against local risks (e.g., Eskom loadshedding, CPI volatility).
*   **FICA Compliance:** Mandatory tiered KYC integration.
    *   *Tier 1:* R1,000 limit (ID + Mobile).
    *   *Tier 2:* R20,000 limit (ID Photo + PoR).
    *   *Tier 3:* Unlimited (Full Manual Review).
*   **ZARP Native:** Settlement in ZARP (local ZAR stablecoin) ensures compliance with SARB exchange control for domestic users and eliminates USD/ZAR forex risk.

## 2. Competitive Analysis: Kalshi vs. Polymarket vs. Sangoma

| Feature | Kalshi (Regulated) | Polymarket (Decentralized) | Sangoma (Hybrid) |
| :--- | :--- | :--- | :--- |
| **Matching Engine** | Centralized (CLOB) | Hybrid (Off-chain/On-chain) | Centralized (SME) |
| **Settlement** | Centralized Ledger | On-chain (Polygon) | On-chain (Polygon POS) |
| **Oracle** | Proprietary/Direct | UMA (Optimistic) | UMA + Sangoma Council |
| **Currency** | USD (Fiat) | USDC (Stablecoin) | ZARP (Local Stablecoin) |
| **UX Focus** | Institutional/Retail | Crypto-Native | Mobile-First/SA-Retail |
| **SA Edge** | N/A (US Only) | Global (Forex Risk) | Local (ZARP On-ramps) |

### Sangoma's "Hybrid" Advantage:
*   **Speed:** The **Sangoma Matching Engine (SME)**, built in Node.js/Go, provides sub-second order matching, crucial for high-volatility events like SARB rate decisions.
*   **Trust:** Settlement is executed on-chain (Polygon), ensuring that "the house" cannot manipulate outcomes.
*   **Decentralized Resolution:** Markets are resolved using **UMA's Optimistic Oracle V3**. The Council asserts a claim (e.g., "SARB Repo Rate unchanged: YES"), which enters a 2-hour liveness period where anyone can dispute it. Successful assertions trigger automated on-chain payouts.
*   **Context:** The **Sangoma Council** provides a qualitative truth layer for local South African nuances, initiating UMA assertions and managing complex qualitative events.

## 3. Target Feature Set
*   **Core Categories:** Energy (Eskom), Macro (ZARP/Repo/CPI), Politics (Elections), Rainfall.
*   **Product Experience:** 
    *   **ZARP Integration:** Native trading currency.
    *   **Account Abstraction:** Gnosis Safe + Social Login to remove "seed phrase" friction.
    *   **PWA:** Optimized for 3G/4G connectivity.
*   **Governance:** Genesis Soulbound NFTs for the "Pioneer 100" cohort, granting voting weight in the Council.

## 4. Next Steps for Phase 6
*   **Pioneer Outreach:** Wave 1 (Influencers) is drafted. 
*   **Directory Expansion:** Currently 10 high-priority targets identified; expanding to 100.
*   **Sandbox Submission:** Finalizing the IFWG report based on this deep dive.
