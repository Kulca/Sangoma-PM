# Sangoma Outreach CRM & Status Flow

This document outlines the operational logic for the 'Pioneer 100' Outreach CRM, maintained as a CSV file for lightweight, version-controlled tracking.

## 1. CRM File Location
The primary source of truth for outreach status is:
`/home/team/shared/outreach_tracking.csv`

## 2. Data Structure
The CRM uses a flat file structure with the following columns:

*   **Target:** The full name of the individual or organization.
*   **Platform:** The primary outreach channel (e.g., Email, X (Twitter), LinkedIn).
*   **Handle:** The specific email address or social media handle.
*   **Status:** The current stage in the outreach funnel (see 'Status Definitions' below).
*   **Notes:** Contextual information, including specific draft names, date of last contact, or blockers.

## 3. Status Definitions
The CRM uses a standardized funnel to track progress:

| Status | Definition | Action Required |
| :--- | :--- | :--- |
| **Identified** | Target has been vetted and added to the directory. | None. |
| **Drafted** | A personalized outreach message has been created. | Review and approve for sending. |
| **Contacted** | Initial outreach message has been dispatched. | Wait for response (standard 3-day window). |
| **Engaged** | Target has responded positively/asked questions. | Escalate to Lead or Developer for technical/strategic follow-up. |
| **Onboarded** | Target has signed up for the sandbox and passed FICA. | Move to 'Genesis Liquidity Program' tracking. |
| **Deferred** | Target responded negatively or requested follow-up later. | Set reminder in 'Notes'. |
| **Blocked** | Technical or relationship barrier (e.g., system email pause). | Seek alternative channel (e.g., switch Email to X). |

## 4. Maintenance Workflow
1.  **Daily Update:** At the end of each session, the researcher or lead must update the `Status` and `Notes` for any targets interacted with.
2.  **Backup:** Changes to the CRM should be committed to the `Sangoma-PM` repository as part of the framework solidification process.
3.  **Conflict Resolution:** If multiple team members are working on outreach, the Lead will assign specific targets to avoid double-contact.

## 5. System Constraints & Workarounds
*   **Email Pause:** In the event of an automated system pause on the `ctomail.io` domain, the CRM `Status` for pending email targets should be updated to `Blocked`, and the `Platform` switched to a manual channel (X or LinkedIn).
