# Sangoma Consumer Protection Policy

**Version:** 1.0  
**Date:** July 2026  
**Status:** Final — IFWG Sandbox Trial  
**Jurisdiction:** Republic of South Africa

---

## 1. Purpose and Scope

This Consumer Protection Policy (the "Policy") sets out the framework through which Sangoma protects the rights and interests of its users within the IFWG Regulatory Sandbox trial. It is designed to comply with the relevant provisions of the Consumer Protection Act 68 of 2008 (CPA), the Financial Advisory and Intermediary Services Act 37 of 2002 (FAIS), the Financial Intelligence Centre Act 38 of 2001 (FICA), and the Protection of Personal Information Act 4 of 2013 (POPIA).

This Policy applies to all users of the Sangoma platform during the Phase 6 sandbox trial and will be reviewed and updated as the protocol transitions to mainnet.

---

## 2. Regulatory Context

### 2.1 IFWG Regulatory Sandbox

Sangoma operates within the Intergovernmental Fintech Working Group (IFWG) Regulatory Sandbox, under the oversight of the South African Reserve Bank (SARB), the Financial Sector Conduct Authority (FSCA), and the Financial Intelligence Centre (FIC). The sandbox provides a controlled environment for testing fintech innovations with real users while maintaining appropriate consumer safeguards.

### 2.2 Financial Product Classification

Sangoma is classified as a financial product under the FAIS Act, specifically structured as a hedging tool and contract for difference (CFD). All markets are designed around objectively determinable outcomes, distinguishing the platform from gambling products regulated under the National Gambling Act.

### 2.3 CASP Licensing

Sangoma operates as a Crypto Asset Service Provider (CASP) within the FSCA licensing framework. This classification subjects the platform to ongoing regulatory oversight, including AML/CFT obligations, fit and proper requirements, and consumer protection standards.

---

## 3. Fair Treatment of Consumers

### 3.1 Principles

Sangoma adheres to the following principles of fair treatment:

- **Transparency:** All material information about platform operations, fees, risks, and market mechanics is disclosed to users in clear, accessible language.
- **Accessibility:** The platform is designed to be accessible to South African users across varying levels of digital and financial literacy, with tiered onboarding that reduces barriers to entry.
- **Responsiveness:** User inquiries, complaints, and requests are addressed promptly, with clear escalation paths for unresolved issues.
- **Accountability:** Sangoma accepts responsibility for the proper functioning of its protocols and provides mechanisms for redress when systems fail.

### 3.2 Prohibited Conduct

Sangoma prohibits the following:

- Misrepresentation of market outcomes or platform capabilities
- Unfair or deceptive marketing practices
- Manipulation of market resolution mechanisms
- Unauthorised use or disclosure of user personal information
- Discrimination against any user on prohibited grounds

---

## 4. Disclosure and Transparency

### 4.1 Pre-Trade Disclosure

Before engaging in trading, users are provided with:

- A clear explanation of how prediction markets function, including the relationship between market prices and outcome probabilities
- The fee structure for trading, market creation, and withdrawals
- The resolution mechanism for each market category (automated data feed, UMA Oracle, or Council determination)
- The risks associated with trading, including the potential for total loss of capital
- The terms and conditions governing platform use
- The privacy policy explaining how personal data is collected, used, and protected

### 4.2 Ongoing Disclosure

Sangoma provides ongoing disclosure through:

- Real-time market data, including order books, trade history, and current prices
- Regular status updates on platform operations and known issues
- Monthly regulatory reports summarising platform KPIs, user statistics, and compliance metrics
- Immediate notification of material changes to fees, terms, or platform operations

### 4.3 Post-Trade Disclosure

After each trade, users receive:

- Confirmation of trade execution, including price, quantity, and timestamp
- Transaction history accessible through the user dashboard
- Annual tax reports summarising trading activity for SARS compliance

---

## 5. Complaints and Dispute Resolution

### 5.1 Complaints Process

Sangoma maintains a formal complaints process with the following stages:

**Stage 1 — Informal Resolution:** Users may raise issues through the platform's support channel. Sangoma aims to resolve all Stage 1 complaints within 5 business days.

**Stage 2 — Formal Complaint:** If the user is unsatisfied with the Stage 1 outcome, they may submit a formal complaint through the complaints portal. Sangoma will acknowledge receipt within 2 business days and provide a substantive response within 15 business days.

**Stage 3 — Escalation to Sangoma Council:** Complaints relating to market resolution, platform integrity, or regulatory compliance may be escalated to the Sangoma Council for review.

**Stage 4 — External Dispute Resolution:** If the Council's determination is unsatisfactory, users may refer the matter to the FSCA's Ombud or an independent arbitration mechanism.

### 5.2 Dispute Resolution for Market Outcomes

Market outcome disputes are handled through the UMA Optimistic Oracle mechanism:

- Any user may dispute a market resolution within the 2-hour liveness period
- Disputes are resolved by the UMA Data Verification Mechanism (DVM) through token holder voting
- Successful disputants are rewarded with the assertion bond
- The outcome of UMA resolution is final and binding

### 5.3 System Failure and Error Resolution

In the event of a system error, trade execution failure, or smart contract malfunction:

1. The platform will be temporarily suspended to prevent further errors
2. An incident report will be published within 24 hours
3. Affected users will be notified and provided with a remediation plan
4. Losses resulting from platform error (not market movement) will be reimbursed from operational reserves

---

## 6. Fund Segregation and Security

### 6.1 Custody of User Funds

User funds in the sandbox trial are held in smart contracts on the Polygon Amoy testnet. These contracts are:

- Non-custodial by design — Sangoma cannot unilaterally transfer user funds
- Auditable on-chain — all contract interactions are publicly verifiable
- Subject to security audits prior to mainnet deployment

### 6.2 Fund Segregation on Mainnet

Upon mainnet transition, user funds will be held as follows:

- **Trading Funds:** Held in Gnosis Safe smart contracts with multi-signature protection
- **Liquidity Pool Funds:** Held in protocol-managed smart contracts with independent audit oversight
- **Corporate Funds:** Held in separate bank accounts at a Tier 1 South African bank
- No commingling of user and corporate funds at any level

### 6.3 Withdrawal Rights

Users have the right to withdraw their available funds at any time, subject to:

- FICA verification requirements for the withdrawal amount tier
- Standard processing times (same-day for testnet, 1-3 business days for mainnet)
- Applicable network fees (gas) for on-chain transactions
- Compliance with applicable exchange control regulations (SARB)

---

## 7. Data Protection and Privacy (POPIA Compliance)

### 7.1 Data Collection and Processing

Sangoma collects and processes personal data only for the following purposes:

- Identity verification and FICA compliance
- Platform operation and trade execution
- Regulatory reporting and AML/CFT obligations
- User support and communication
- Platform improvement and analytics (anonymised)

### 7.2 Data Subject Rights

Users have the following rights under POPIA:

- **Right of Access:** Request confirmation of whether personal data is held and access to that data
- **Right to Correction:** Request correction of inaccurate or outdated personal data
- **Right to Deletion:** Request deletion of personal data, subject to regulatory retention requirements
- **Right to Object:** Object to the processing of personal data for specific purposes
- **Right to Complaint:** Lodge a complaint with the Information Regulator (South Africa)

### 7.3 Data Security Measures

Sangoma implements the following security measures:

- Encryption of all personal data at rest (AES-256) and in transit (TLS 1.3)
- Access controls restricting data access to authorised personnel on a need-to-know basis
- Regular security audits and penetration testing
- Incident response procedures for data breaches, with mandatory notification to the Information Regulator and affected users within 72 hours

### 7.4 Data Retention

Personal data is retained only for as long as necessary to fulfil the purposes for which it was collected, subject to:

- FICA record-keeping requirements (5 years after account closure)
- Tax record-keeping requirements (5 years after last transaction)
- Legal or regulatory obligations requiring longer retention

---

## 8. Marketing and Communication

### 8.1 Marketing Standards

All marketing communications from Sangoma will:

- Be accurate, clear, and not misleading
- Clearly identify Sangoma as the sender
- Include appropriate risk warnings where applicable
- Provide a clear opt-out mechanism for all electronic communications

### 8.2 Direct Marketing

Sangoma will obtain explicit consent before sending direct marketing communications. Users may withdraw consent at any time through their account settings or by clicking the unsubscribe link in any marketing communication.

---

## 9. Vulnerable Consumers

### 9.1 Identification and Protection

Sangoma recognises that certain users may be vulnerable and implements the following protections:

- **Financial Literacy Resources:** Educational content explaining prediction markets, risk management, and responsible trading
- **Cooling-Off Period:** New users may cancel their first deposit within 7 days without penalty
- **Deposit Limits:** Tier 1 (Explorer) accounts are limited to R1,000 total deposits to limit exposure for new users
- **Responsible Trading Warnings:** Prominent warnings displayed before high-risk market participation

### 9.2 Exclusion of Minors

Sangoma prohibits access to persons under the age of 18. Age verification is conducted through the FICA onboarding process, which requires a valid South African National ID number.

---

## 10. Liability and Indemnification

### 10.1 Platform Liability

Sangoma accepts liability for:

- Losses directly resulting from platform errors, smart contract malfunctions, or system failures
- Unauthorised access to user accounts resulting from platform security failures
- Breaches of data protection obligations under POPIA

### 10.2 Limitation of Liability

Sangoma does not accept liability for:

- Trading losses resulting from market movements or user trading decisions
- Losses resulting from force majeure events or circumstances beyond reasonable control
- Losses resulting from user error, including misplaced private keys or incorrect transaction parameters
- Indirect, consequential, or special damages

### 10.3 User Indemnity

Users indemnify Sangoma against losses resulting from:

- Violation of platform terms and conditions
- Violation of applicable laws or regulations
- Fraudulent, dishonest, or malicious activity

---

## 11. Complaints Reporting and Regulatory Oversight

### 11.1 Complaints Register

Sangoma maintains a confidential complaints register recording:

- Date and nature of each complaint
- Resolution status and outcome
- Time to resolution
- Trends and recurring issues

### 11.2 Regulatory Reporting

Complaints data is included in monthly regulatory reports submitted to the IFWG Sandbox oversight committee. Summary statistics (not individual complainant data) may be published in the platform's transparency report.

### 11.3 Contact Information

**Consumer Protection Officer:**  
Sangoma Protocol  
Email: support@sangoma.africa  
Response Time: 2 business days  

**Regulatory Oversight:**  
Financial Sector Conduct Authority (FSCA)  
Riverwalk Office Park, Block B  
41 Matroosberg Road, Ashlea Gardens  
Pretoria, 0081  
Email: info@fsca.co.za  

**Information Regulator (South Africa):**  
JD House, 27 Stiemens Street  
Braamfontein, Johannesburg, 2001  
Email: enquiries@inforegulator.org.za  

---

## 12. Policy Review and Amendment

This Policy will be reviewed:

- At least annually
- Upon any material change in applicable law or regulation
- Upon the occurrence of a significant consumer protection incident
- Upon transition from sandbox trial to mainnet

Users will be notified of material amendments at least 14 days before they take effect. Continued use of the platform after the effective date constitutes acceptance of the amended Policy.

---

*This Consumer Protection Policy is published as part of the Sangoma IFWG Regulatory Sandbox trial documentation. It reflects the platform's commitment to fair treatment, transparency, and regulatory compliance in serving South African users.*