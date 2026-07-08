# Sangoma Protocol: A Decentralized Prediction Market for the South African Context

## Formal Whitepaper — Version 1.0

**July 2026**

---

## Abstract

Sangoma is a decentralized prediction market protocol designed specifically for the South African macroeconomic and regulatory environment. By combining a high-performance centralized matching engine with verifiable on-chain settlement on Polygon POS, and leveraging the UMA Optimistic Oracle for decentralized resolution, Sangoma provides a transparent, compliant, and accessible platform for South Africans to hedge against local risks—including loadshedding, currency volatility, and policy uncertainty—using a ZAR-pegged stablecoin (ZARP). This whitepaper presents the protocol's technical architecture, regulatory compliance framework, economic incentives, and governance model, as developed within the Intergovernmental Fintech Working Group (IFWG) Regulatory Sandbox.

---

## 1. Executive Summary

Sangoma addresses a critical gap in the South African financial ecosystem: the absence of a regulated, accessible platform for predictive forecasting and risk hedging on local events. While global prediction markets such as Polymarket and Kalshi have demonstrated the utility of "skin-in-the-game" forecasting, they remain inaccessible or suboptimal for South African users due to regulatory restrictions, forex friction, and a lack of locally relevant markets.

Sangoma's hybrid architecture combines the speed of a centralized matching engine with the trust guarantees of on-chain settlement. The protocol is structured as a financial product under the oversight of the Financial Sector Conduct Authority (FSCA), operating within the IFWG Regulatory Sandbox to ensure full compliance with South African financial regulations while enabling innovation.

The protocol introduces several innovations specific to the South African context: settlement in a ZAR-pegged stablecoin (ZARP) eliminates forex risk; tiered FICA-compliant onboarding reduces barriers to entry while maintaining regulatory integrity; and the Sangoma Council provides a qualitative truth layer for nuanced local events, complementing the UMA Optimistic Oracle's decentralized resolution mechanism.

---

## 2. The South African Context

### 2.1 The Need for Local Prediction Markets

South Africa faces a unique convergence of economic volatility, policy uncertainty, and infrastructure instability that creates a strong demand for predictive hedging tools:

**Energy Crisis:** Eskom's loadshedding has imposed predictable but uncertain costs on households and businesses. The ability to hedge against loadshedding stages—from Stage 0 through Stage 8 and beyond—enables small businesses to manage operational risk and provides a market-based signal of energy infrastructure stability.

**Currency Volatility:** The South African Rand (ZAR) is among the most volatile emerging-market currencies, driven by global risk sentiment, commodity prices, and domestic political developments. Prediction markets on ZAR/USD exchange rate movements, SARB repo rate decisions, and inflation targets provide real-time, market-driven forecasts that complement traditional economic indicators.

**Policy Uncertainty:** The South African legislative landscape—including the National Health Insurance (NHI) Bill, land reform, and mining charter changes—generates significant uncertainty for investors and businesses. Prediction markets offer a transparent mechanism for quantifying the probability of policy outcomes.

**Data Deficit:** Traditional polling and forecasting in South Africa suffer from small sample sizes, infrequent updates, and methodological biases. Prediction markets, by requiring participants to commit capital to their forecasts, generate higher-integrity signals through the mechanism of "skin in the game."

### 2.2 Market Size and Opportunity

South Africa's financial services sector is the most developed in Africa, with over R7 trillion in assets under management. The country has a mature banking infrastructure, a sophisticated regulatory environment, and one of the highest cryptocurrency adoption rates on the continent. The combination of local economic volatility and high digital asset literacy creates a fertile environment for prediction markets tailored to the South African context.

### 2.3 Comparative Analysis: Existing Models

| Dimension | Kalshi (US) | Polymarket (Global) | Sangoma (SA) |
|-----------|-------------|---------------------|---------------|
| **Matching Engine** | Centralized | Decentralized (CLOB/AMM) | Centralized (Speed-optimized) |
| **Settlement** | Centralized Ledger | On-chain (Polygon) | On-chain (Polygon POS) |
| **Oracle** | Proprietary | UMA (Optimistic) | UMA + Sangoma Council |
| **Currency** | USD (Fiat) | USDC (Stablecoin) | ZARP (ZAR-pegged) |
| **Regulation** | CFTC Regulated | Unregulated | IFWG Sandbox |
| **SA Accessibility** | Restricted (US Only) | Global (Forex Risk) | Local (ZARP On-ramps) |

Sangoma's hybrid approach captures the best of both models: the speed and user experience of a centralized platform, combined with the transparency and trust guarantees of decentralized settlement and oracle resolution.

---

## 3. Regulatory Framework

### 3.1 IFWG Regulatory Sandbox

Sangoma operates within the Intergovernmental Fintech Working Group (IFWG) Regulatory Sandbox, a framework established by the South African Reserve Bank (SARB), the Financial Sector Conduct Authority (FSCA), and the Financial Intelligence Centre (FIC). The sandbox enables live testing of fintech innovations under regulatory supervision, with tailored relief from certain licensing requirements during the trial period.

The Phase 6 sandbox trial is structured as a six-month pilot, targeting 1,000 verified users, with the objective of demonstrating the platform's utility as a hedging tool and informational market rather than a gambling product. Key deliverables include monthly regulatory reporting, real-time auditability of all on-chain settlement, and transparent resolution mechanics.

### 3.2 Classification as a Financial Product

The FSCA's October 2022 declaration classified crypto assets as "financial products" under the Financial Advisory and Intermediary Services (FAIS) Act. This classification provides a regulatory pathway for prediction markets to be treated as derivatives or contracts for difference (CFDs), provided they meet the criteria for informational and hedging utility.

Sangoma is structured as a hedging tool, with all markets designed around verifiable, objectively determinable outcomes (e.g., "Did the SARB keep the repo rate unchanged?"). This distinguishes the platform from gambling products, which are regulated under the National Gambling Act and subject to different requirements.

### 3.3 Crypto Asset Service Provider (CASP) Licensing

The FSCA began approving Crypto Asset Service Provider (CASP) licenses in April 2024, with major local exchanges among the first 75 approved entities. As of 2026, the CASP licensing framework has matured, enabling more complex crypto-derivative products within the sandbox environment. Sangoma operates under this framework, providing intermediary services for crypto-based derivative markets.

### 3.4 AML/KYC Compliance (FICA)

Full compliance with the Financial Intelligence Centre Act (FICA) is mandatory for all users. Sangoma implements a tiered onboarding system to balance regulatory compliance with user accessibility:

**Tier 1 (Explorer):** Limits up to R1,000. Requires National ID number and verified mobile number (RICA-compliant). Designed for new users to explore the platform with minimal friction.

**Tier 2 (Forecaster):** Limits up to R20,000. Requires automated ID photo verification and proof of residence. Integration with South African identity APIs (ThisIsMe) enables rapid verification.

**Tier 3 (Professional):** Unlimited trading limits. Requires full manual review of FICA documents, source of funds declaration, and enhanced due diligence for high-volume participants.

### 3.5 Data Protection (POPIA)

Sangoma complies with the Protection of Personal Information Act (POPIA) through the following measures:

- **Data Minimization:** Only essential KYC data is collected and stored, with tier-based progressive disclosure.
- **Purpose Limitation:** User data is used exclusively for compliance and platform operations, not for unrelated commercial purposes.
- **Security Safeguards:** All personally identifiable information (PII) is encrypted at rest and in transit, with access restricted to authorized personnel.
- **Data Subject Rights:** Users may request access to, correction of, or deletion of their personal data, subject to regulatory retention requirements.

### 3.6 Taxation (SARS)

Trading profits on Sangoma are classified as revenue and taxed at the user's marginal income tax rate, consistent with SARS guidance on frequent, short-term trading activities. The ZARP stablecoin is treated as a crypto asset for tax purposes, subject to the same reporting framework as other digital assets. Sangoma provides users with transaction history reports to facilitate tax compliance.

### 3.7 Consumer Protection

Consumer protection is built into the protocol at multiple levels:

- **Transparent Resolution:** All market outcomes are settled on-chain, providing a verifiable audit trail.
- **Dispute Mechanism:** The UMA Optimistic Oracle enables any participant to challenge a resolution within a 2-hour liveness period.
- **Fund Segregation:** User funds are held in smart contracts, not in the platform's operational accounts, ensuring that the platform cannot misappropriate user capital.
- **Council Oversight:** The Sangoma Council provides qualitative oversight for complex markets, with a formal escalation path to UMA's decentralized dispute resolution.

---

## 4. Technical Architecture

### 4.1 Hybrid Design Philosophy

Sangoma employs a hybrid architecture that separates the matching and settlement layers:

**Matching Layer (Centralized):** The Sangoma Matching Engine (SME) is a high-performance WebSocket server implemented in TypeScript on Bun, running on port 8080. The engine provides sub-second order matching, essential for volatile markets such as SARB rate decisions and loadshedding stage changes. Orders are signed using EIP-712 cryptographic signatures, ensuring cryptographic provenance.

**Settlement Layer (Decentralized):** All final settlement occurs on the Polygon Proof-of-Stake (POS) network, providing low-cost, high-throughput transaction processing. The settlement layer uses the Conditional Tokens Framework (CTF), an open-source standard for creating and resolving binary outcome markets.

### 4.2 Core Components

**Frontend:** A Next.js 15 application (App Router) with Tailwind CSS, optimized for South African network conditions as a Progressive Web App (PWA). The interface supports Edge, 3G, and 4G connectivity.

**Smart Contracts:** Four contracts deployed on Polygon Amoy testnet:
- `SangomaGenesisNFT` — Soulbound NFT for the Pioneer 100 cohort
- `MockCTF` — Conditional Tokens Framework implementation
- `SangomaOracle` — Primary oracle for market resolution
- `SangomaUMAOracle` — UMA Optimistic Oracle V3 integration

**Matching Engine:** A standalone Bun/TypeScript service that maintains order books, matches trades, and logs transactions to `trades.jsonl` and `orders.jsonl`.

**Data Feeds:** Integration with EskomSePush API for automated loadshedding stage data, enabling real-time market resolution without manual intervention.

### 4.3 Infrastructure Architecture

```
Frontend (Next.js) <--> Matching Engine (Bun:8080) <--> Smart Contracts (Polygon Amoy)
                              |
                    trades.jsonl / orders.jsonl
                              |
                    Shared Storage Layer
                              |
              UMA Optimistic Oracle V3 (Decentralized Resolution)
```

### 4.4 Settlement Flow

1. **Order Placement:** User signs an order via EIP-712 and submits it to the SME via WebSocket.
2. **Order Matching:** The SME matches buy and sell orders, updating the order book.
3. **Trade Execution:** Matched trades are logged and the positions are recorded.
4. **Market Resolution:** When a market expires, the oracle (UMA or Council) resolves the outcome.
5. **Payout Distribution:** The conditional tokens framework distributes payouts to winning positions.

---

## 5. Oracle & Resolution

### 5.1 Two-Tier Resolution Model

Sangoma implements a two-tier resolution system designed for both speed and security:

**Tier 1 — Automated Resolution (Data Feeds):** For markets with objectively verifiable outcomes, automated data feeds provide immediate resolution. The EskomSePush API, for example, provides real-time loadshedding stage data that can be used to settle energy markets without human intervention.

**Tier 2 — Optimistic Resolution (UMA):** For markets requiring human judgment or complex data interpretation, the Sangoma Council submits assertions to the UMA Optimistic Oracle V3. The assertion enters a 2-hour liveness period during which any participant can dispute it. If undisputed, the assertion is accepted as true. If disputed, the UMA Data Verification Mechanism (DVM) resolves the dispute through token holder voting.

### 5.2 UMA Optimistic Oracle V3 Integration

The UMA Optimistic Oracle provides a decentralized truth layer with the following characteristics:

- **Assertion-Based:** The Council asserts a claim (e.g., "SARB repo rate unchanged: YES") with a bond denominated in the settlement currency.
- **Liveness Period:** A 2-hour window for disputes, providing sufficient time for participants to verify the assertion.
- **Economic Security:** Asserters post bonds that are slashed if their assertion is successfully disputed, creating strong economic incentives for honest reporting.
- **Permissionless Disputes:** Any participant can dispute an assertion, ensuring that the Council cannot unilaterally control outcomes.

### 5.3 Sangoma Council

The Sangoma Council serves as the initial truth layer for qualitative markets, providing:

- **Market Vetting:** Reviewing and approving proposed markets for compliance and verifiability.
- **Qualitative Resolution:** Initiating UMA assertions for markets requiring human judgment.
- **Dispute Oversight:** Monitoring the dispute window and escalating contested resolutions.

The Council is composed of the Pioneer 100 cohort, with Genesis Soulbound NFTs granting voting weight. Council members are selected through a structured process prioritizing domain expertise, network influence, and regulatory alignment.

### 5.4 Resolution Flow

1. Market expires → Council member initiates assertion via `SangomaUMAOracle.requestResolution()`
2. UMA enters 2-hour liveness period
3. If no dispute → assertion settles → `resolveMarket()` triggers payouts
4. If dispute → UMA DVM votes → final resolution
5. If callback fails → manual settlement via `settleAndResolve()`

---

## 6. The ZARP Stablecoin

### 6.1 Rationale

Sangoma settles all trades in ZARP, a ZAR-pegged stablecoin. This design choice addresses several critical requirements:

- **Forex Elimination:** South African users on global platforms like Polymarket face USD/ZAR exchange rate risk on their trading capital. ZARP settlement eliminates this friction.
- **Regulatory Compliance:** Settlement in a ZAR-denominated instrument simplifies compliance with SARB exchange control regulations.
- **Local On-Ramps:** Integration with South African CASPs (including VALR Pay and Luno) enables seamless ZAR-to-ZARP conversion, reducing onboarding friction.
- **Tax Simplicity:** ZAR-denominated profits simplify tax reporting for South African users, avoiding the need for USD/ZAR conversion in gain calculations.

### 6.2 Integration

ZARP is integrated into the platform through the following channels:

- **Direct Purchase:** Users can purchase ZARP through integrated CASP partners using EFT or instant EFT.
- **Trading:** All markets are denominated in ZARP, providing a consistent unit of account.
- **Settlement:** Winning positions are paid out in ZARP, which can be withdrawn to user wallets or converted back to ZAR.

---

## 7. Tokenomics & Incentives

### 7.1 SNGM Token

The Sangoma Governance Token (SNGM) serves as the protocol's governance and utility token:

- **Governance:** SNGM holders vote on Council elections, protocol upgrades, and market parameter changes.
- **Staking:** Users stake SNGM to access tiered fee discounts (Apprentice through Sangoma tiers).
- **Resolution Staking:** Council members stake SNGM when initiating assertions, with slashing penalties for false assertions.
- **Fee Discounts:** Staking SNGM reduces trading fees, with higher stakes unlocking greater discounts.

### 7.2 Genesis Liquidity Program (GLP)

The GLP is a 30-day incentive program designed to bootstrap liquidity during the sandbox trial:

- **Liquidity Providers:** Users who provide ZARP liquidity to active markets receive SNGM pool distributions.
- **Traders:** Active traders earn SNGM referral bonuses and volume-based rewards.
- **Leaderboard:** A transparent leaderboard tracks GLP participation, with Genesis Soulbound NFTs awarded to top contributors.

### 7.3 Fee Structure

Trading fees are structured as follows:
- **Standard:** 0.5% per trade
- **Staked (Apprentice):** 0.3% per trade
- **Staked (Sangoma):** 0.1% per trade
- **Market Creation:** SNGM staking requirement plus proposal fee

---

## 8. Governance

### 8.1 Sangoma Council

The Sangoma Council is the primary governance body during the sandbox trial, responsible for:

- Approving new markets for compliance with regulatory and platform standards
- Initiating UMA assertions for qualitative market resolution
- Monitoring market integrity and dispute resolution
- Reviewing and updating platform parameters

### 8.2 Pioneer 100

The Pioneer 100 cohort consists of 100 domain experts and influencers selected through a structured three-pillar methodology:

1. **Domain Expertise:** Economists, financial analysts, energy experts, and policy researchers
2. **Network & Influence:** Journalists, media figures, and community leaders
3. **Regulatory Alignment:** Former regulators, compliance professionals, and legal experts

The cohort is distributed across five sectors: Finance/Economy (30%), Media/Broadcasting (25%), Crypto/Tech (20%), Politics/Legal/Regulatory (15%), and Industry/Energy/Civil Society (10%).

### 8.3 Community Seats

Three community seats on the Council are elected by SNGM stakers, with eligibility requiring a minimum 5,000 SNGM stake and FICA Tier 2 verification. Terms are six months, with recall procedures for non-participation.

---

## 9. Risk Management & Compliance

### 9.1 Market Integrity

All markets are subject to quantitative vetting criteria before approval:
- Minimum 1,000 ZARP liquidity commitment from market creators
- Minimum 5,000 ZARP projected volume
- Multi-source verification requirements for news-based markets
- Clear, objectively determinable resolution criteria

### 9.2 Fund Security

User funds are held in smart contracts with the following safeguards:
- No single entity has unilateral control over user funds
- All settlement logic is verifiable on-chain
- Regular security audits of smart contract code
- Fund segregation from operational accounts

### 9.3 Regulatory Reporting

Sangoma provides automated regulatory reporting dashboards covering:
- Platform KPIs (active users, trading volume, market counts)
- User risk monitoring (AML flagging, suspicious activity)
- Market integrity audit trails (resolution certificates, UMA hashes)
- Monthly governance summaries for IFWG/SARB oversight

---

## 10. Roadmap

### Phase 6: IFWG Sandbox Trial (Current — July 2026 to January 2027)

- **Deployment:** Full protocol on Polygon Amoy testnet
- **Users:** Target 1,000 verified users through tiered FICA onboarding
- **Markets:** Inaugural markets on Eskom loadshedding, SARB repo rate, and petrol price
- **Liquidity:** Genesis Liquidity Program bootstrapping minimum ZARP liquidity
- **Resolution:** UMA Optimistic Oracle validation and Sangoma Council operations

### Mainnet Launch (Q1 2027)

- **Deployment:** Migration to Polygon POS mainnet
- **Licensing:** CASP licensing and full FSCA compliance
- **Markets:** Expansion to political, economic, and hyper-local categories
- **Token:** SNGM token launch with governance and staking

### Phase 2: Scaling (Q2 2027)

- **Account Abstraction:** Gnosis Safe integration for social login
- **Mobile App:** Native mobile application for iOS and Android
- **Market Expansion:** User-generated markets with Council approval

### Phase 3: Full Decentralization (Q3 2027+)

- **On-Chain Settlement:** Full CTF-based settlement on Polygon
- **DAO Governance:** Transition to fully decentralized governance
- **Permissionless Markets:** Open market creation with UMA-based resolution

---

## 11. Conclusion

Sangoma represents a significant innovation in the South African financial technology landscape: a regulated, decentralized prediction market that addresses the specific needs of South African users. By combining the speed of a centralized matching engine, the security of on-chain settlement, the decentralization of UMA's optimistic oracle, and the regulatory clarity of the IFWG Sandbox, Sangoma provides a platform that is both accessible and trustworthy.

The protocol's design reflects a deep understanding of the South African context—from the tiered FICA onboarding that balances compliance with accessibility, to the ZARP stablecoin that eliminates forex friction, to the market categories that address the most pressing sources of economic uncertainty for South Africans.

As the protocol moves through its sandbox trial toward mainnet launch, Sangoma aims to establish itself as the premier platform for South African predictive forecasting, providing a transparent, verifiable, and compliant truth layer for the country's most important economic and policy questions.

---

## References

1. Financial Sector Conduct Authority. "Declaration of Crypto Assets as Financial Products." Government Gazette, October 2022.
2. Intergovernmental Fintech Working Group. "IFWG Regulatory Sandbox Framework." SARB, FSCA, FIC, 2023.
3. South African Reserve Bank. "Position Paper on Stablecoins." SARB, 2024.
4. Financial Intelligence Centre. "Guidance Note on Crypto Asset Service Providers." FIC, 2024.
5. UMA Protocol. "Optimistic Oracle V3 Specification." UMA, 2025.
6. Conditional Tokens Framework. "Specification and Implementation." Gnosis, 2024.
7. Polygon Technology. "Polygon POS Architecture." Polygon, 2024.

---

*This whitepaper is published for informational purposes within the context of the IFWG Regulatory Sandbox trial. It does not constitute financial advice or an offer of securities. The Sangoma Protocol is subject to ongoing regulatory review and development.*