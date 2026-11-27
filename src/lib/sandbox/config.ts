/**
 * Sandbox (demo platform) configuration.
 *
 * Everything the demo wallet needs to be re-pointed or re-priced lives here so
 * there is exactly one place to change it. The demo conversion rate in
 * particular is an owner decision (currently R1 = 1 SNGM) and must stay a
 * single named constant.
 */

/** SQLite file. Lives in /home so it survives a machine rebuild. */
export const SANDBOX_DB_PATH =
  process.env.SANDBOX_DB_PATH || '/home/team/shared/sandbox.db';

/** Waitlist registrations — the signup gate reads this file. */
export const SANDBOX_WAITLIST_FILE =
  process.env.SANDBOX_WAITLIST_FILE ||
  '/home/team/shared/waitlist_registrations.json';

/** Owner default: R1.00 = 1 SNGM (flat demo rate, no slippage, no fees). */
export const DEMO_ZAR_PER_SNGM = 1;

/** Every new sandbox account is funded with R10,500.00 of simulated money. */
export const OPENING_DEMO_BALANCE_ZAR = 10_500;

/** Balances are stored as integer micro-units (6 decimals) — never floats. */
export const MICRO = 1_000_000;

/** Signed, http-only session cookie. */
export const SESSION_COOKIE = 'sangoma_sandbox_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Secret used to sign sessions. Env wins; otherwise a key file in /home. */
export const SESSION_SECRET_FILE =
  process.env.SANDBOX_SESSION_SECRET_FILE ||
  '/home/team/shared/.sandbox_session_secret';

/**
 * The one sentence every money screen carries. Deliberately unambiguous:
 * this is not real money, it cannot leave the platform, and none can come in.
 */
export const SIMULATED_FUNDS_BANNER =
  'Simulated funds — every balance, deposit and trade here is demo money. It is not real money, it cannot be withdrawn, and no real money can be deposited. Market prices, positions and portfolio values are real and live.';

/** Short form for badges next to a balance. */
export const SIMULATED_FUNDS_BADGE = 'Simulated funds';
