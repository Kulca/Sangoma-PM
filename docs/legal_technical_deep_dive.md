# Sangoma: Legal & Technical Implementation Deep Dive

## 1. Regulatory Landscape (South Africa)

### A. The IFWG Regulatory Sandbox
*   **Path to Legitimacy:** Sangoma should operate within the Intergovernmental Fintech Working Group (IFWG) Regulatory Sandbox. This allows for live testing of fintech innovations under the oversight of SARB, FSCA, and FIC.
*   **Sandbox Trial:** Phase 6 of the business plan aligns with a 6-month trial period, targeting 1,000 verified users to prove the platform's utility as a hedging tool rather than a gambling product.

### B. Classification: Financial Product vs. Gambling
*   **FSCA Declaration (Oct 2022):** The FSCA has officially declared crypto assets as "financial products" under the Financial Advisory and Intermediary Services (FAIS) Act. This means any entity providing advice or intermediary services related to crypto assets in South Africa must be a licensed Financial Services Provider (FSP) or operate under a licensed FSP.
*   **CASP Licensing Milestone (2024-2025):** In April 2024, the FSCA began approving the first batch of Crypto Asset Service Provider (CASP) licenses. Major local exchanges like Luno and VALR were among the first 75 approved entities. As of 2026, the regulatory framework has matured, allowing for more complex "crypto-derivative" products within the IFWG Sandbox environment.
*   **Gambling Act vs. FAIS:** By classifying crypto as a financial product, the FSCA has created a path to regulate prediction markets as "derivatives" or "contracts for difference" (CFDs) rather than gambling, provided they meet the criteria for informational and hedging utility.

### C. AML/KYC (FICA)
*   **Mandatory Compliance:** Full FICA compliance is required. Integration with South African identity APIs (e.g., ThisIsMe) is essential for tier-based onboarding.
*   **Tiered Onboarding Proposal:**
    *   **Tier 1 (Explorer):** Limits up to R1,000. Requires only National ID number and verified mobile number (RICA).
    *   **Tier 2 (Forecaster):** Limits up to R20,000. Requires automated ID photo verification and proof of residence.
    *   **Tier 3 (Professional):** Unlimited. Requires full manual review of FICA documents and source of funds declaration.

### D. Taxation (SARS)
*   **Income Tax vs. CGT:** Trading profits on Sangoma are likely to be classified as "revenue" and taxed at the user's marginal income tax rate, as they are derived from frequent, short-term transactions rather than long-term capital appreciation.
*   **Stablecoin Treatment:** SARB treats stablecoins (like ZARP) as "crypto assets," meaning they are subject to the same tax framework as Bitcoin/Ethereum.

## 2. Technical Architecture: Kalshi vs. Polymarket vs. Sangoma

| Feature | Kalshi (Centralized) | Polymarket (Decentralized) | Sangoma (Hybrid) |
| :--- | :--- | :--- | :--- |
| **Matching Engine** | Centralized (Fast) | Decentralized (CLOB/AMM) | Centralized (Speed-optimized) |
| **Settlement** | Bank Transfer / Ledger | On-chain (Polygon) | On-chain (Polygon POS) |
| **Oracle** | In-house / Proprietary | UMA (Optimistic) | UMA (Optimistic) + Council |
| **Currency** | USD (Fiat) | USDC (Crypto) | ZARP (ZAR-pegged Stablecoin) |
| **Regulation** | CFTC Regulated | Unregulated (Pivoting) | IFWG Sandbox (Trialing) |
| **SA Accessibility** | Restricted (US Only) | Global (Varies) | Local (ZARP on-ramps) |

### Technical Nuances:
*   **ZARP Advantage:** Unlike Polymarket which relies on USDC (introducing USD/ZAR forex risk for SA users), Sangoma settles in ZARP. This allows users to hedge local risks (like loadshedding) without being exposed to currency volatility between ZAR and USD.
*   **On-ramps:** Sangoma leverages local CASP infrastructure (like VALR Pay or Luno) to allow users to move from ZAR to ZARP seamlessly, a major hurdle for SA users on global platforms.

## 3. Sangoma's "Truth Layer" Strategy
*   **Local Relevance:** Focused on high-impact SA events (Loadshedding, SARB rates, Elections).
*   **Transparency:** All settlement logic is verifiable on-chain, eliminating "house" bias.
*   **Oracle Redundancy:** Use UMA for automated data-driven markets; Sangoma Council (DAO) for qualitative local nuances.
