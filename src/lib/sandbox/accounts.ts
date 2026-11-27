/**
 * Sandbox accounts: waitlist gate, signup, signin, identity resolution.
 *
 * Signup is waitlist-gated: only an email already present in
 * /home/team/shared/waitlist_registrations.json may create an account.
 */
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import {
  OPENING_DEMO_BALANCE_ZAR,
  SANDBOX_WAITLIST_FILE,
  DEMO_ZAR_PER_SNGM,
  MICRO,
} from './config';
import { hashPassword, verifyPassword } from './password';
import { ensureSandboxSchema, q, run, select, transaction } from './sqlite';
import type { Identity } from './session';

export interface SandboxUser {
  id: string;
  email: string;
  display_name: string;
  idp: string;
  external_id: string | null;
  created_at: string;
}

export interface AccountResult {
  ok: boolean;
  error?: string;
  /** 'not_waitlisted' lets the UI offer the waitlist form instead. */
  code?: 'not_waitlisted' | 'duplicate' | 'invalid' | 'credentials' | 'unavailable';
  identity?: Identity;
}

/** Emails on the waitlist, lowercased. */
export function waitlistEmails(): Set<string> {
  const emails = new Set<string>();
  try {
    if (!fs.existsSync(SANDBOX_WAITLIST_FILE)) return emails;
    const parsed = JSON.parse(fs.readFileSync(SANDBOX_WAITLIST_FILE, 'utf8'));
    const rows: unknown[] = Array.isArray(parsed) ? parsed : [];
    for (const row of rows) {
      const email = (row as { email?: unknown })?.email;
      if (typeof email === 'string' && email.includes('@')) {
        emails.add(email.trim().toLowerCase());
      }
    }
  } catch (err) {
    console.error('sandbox: could not read waitlist file', err);
  }
  return emails;
}

export function isOnWaitlist(email: string): boolean {
  return waitlistEmails().has(email.trim().toLowerCase());
}

export function findUserByEmail(email: string): SandboxUser | null {
  const rows = select<SandboxUser>(
    `SELECT id, email, display_name, idp, external_id, created_at
       FROM sandbox_users WHERE email = ${q(email.trim().toLowerCase())} LIMIT 1;`,
  );
  return rows[0] ?? null;
}

export function findUserById(id: string): SandboxUser | null {
  const rows = select<SandboxUser>(
    `SELECT id, email, display_name, idp, external_id, created_at
       FROM sandbox_users WHERE id = ${q(id)} LIMIT 1;`,
  );
  return rows[0] ?? null;
}

/**
 * Create the account, its wallet and the opening ledger entry in ONE
 * transaction, so an account can never exist without its R10,500.00.
 */
export async function createSandboxAccount(input: {
  email: string;
  displayName: string;
  password: string;
}): Promise<AccountResult> {
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();

  if (!email.includes('@') || email.length < 5) {
    return { ok: false, code: 'invalid', error: 'Enter a valid email address.' };
  }
  if (displayName.length < 2) {
    return { ok: false, code: 'invalid', error: 'Enter a display name.' };
  }
  if (input.password.length < 8) {
    return {
      ok: false,
      code: 'invalid',
      error: 'Password must be at least 8 characters.',
    };
  }

  if (!isOnWaitlist(email)) {
    return {
      ok: false,
      code: 'not_waitlisted',
      error:
        'That email is not on the Sangoma waitlist yet. Join the waitlist first and we will open your sandbox account from there.',
    };
  }

  try {
    await ensureSandboxSchema();
  } catch (err) {
    console.error('sandbox: schema init failed', err);
    return { ok: false, code: 'unavailable', error: 'Sandbox storage is unavailable. Try again shortly.' };
  }

  if (findUserByEmail(email)) {
    return {
      ok: false,
      code: 'duplicate',
      error: 'A sandbox account already exists for that email. Sign in instead.',
    };
  }

  const userId = `usr_${randomUUID()}`;
  const now = new Date().toISOString();
  const openingZarMicro = Math.round(OPENING_DEMO_BALANCE_ZAR * MICRO);
  const openingSngmMicro = Math.round(openingZarMicro / DEMO_ZAR_PER_SNGM);
  const txId = `tx_${randomUUID()}`;
  const passwordHash = hashPassword(input.password);

  try {
    transaction([
      `INSERT INTO sandbox_users (id, email, display_name, idp, external_id, password_hash, created_at)
         VALUES (${q(userId)}, ${q(email)}, ${q(displayName)}, 'password', NULL, ${q(passwordHash)}, ${q(now)});`,
      `INSERT INTO sandbox_wallets (user_id, balance_zar_micro, balance_sngm_micro, created_at, updated_at)
         VALUES (${q(userId)}, ${openingZarMicro}, 0, ${q(now)}, ${q(now)});`,
      `INSERT INTO sandbox_transactions
         (id, user_id, type, direction, amount_zar_micro, amount_sngm_micro,
          balance_zar_micro_after, balance_sngm_micro_after, rate_zar_per_sngm, note, created_at)
         VALUES (${q(txId)}, ${q(userId)}, 'opening_demo_balance', 'credit',
                 ${openingZarMicro}, 0, ${openingZarMicro}, 0, ${DEMO_ZAR_PER_SNGM},
                 ${q('Sandbox demo wallet opened with R10,500.00 of simulated funds.')}, ${q(now)});`,
    ]);
  } catch (err) {
    console.error('sandbox: account creation failed', err);
    return { ok: false, code: 'unavailable', error: 'Could not create the account. Try again shortly.' };
  }

  return {
    ok: true,
    identity: { provider: 'password', subject: userId, email, displayName },
  };
}

/** Verify email + password. Returns the identity to put in a session. */
export async function authenticate(input: {
  email: string;
  password: string;
}): Promise<AccountResult> {
  const email = input.email.trim().toLowerCase();
  try {
    await ensureSandboxSchema();
  } catch {
    return { ok: false, code: 'unavailable', error: 'Sandbox storage is unavailable. Try again shortly.' };
  }

  const rows = select<{ id: string; email: string; display_name: string; password_hash: string | null }>(
    `SELECT id, email, display_name, password_hash FROM sandbox_users
       WHERE email = ${q(email)} AND idp = 'password' LIMIT 1;`,
  );
  const user = rows[0];
  if (!user || !verifyPassword(input.password, user.password_hash)) {
    return { ok: false, code: 'credentials', error: 'Email or password is incorrect.' };
  }
  return {
    ok: true,
    identity: {
      provider: 'password',
      subject: user.id,
      email: user.email,
      displayName: user.display_name,
    },
  };
}

/**
 * SSO seam. Given an external identity (e.g. a Google subject), return the
 * sandbox user it maps to, creating the account (and its wallet) on first
 * sight. Nothing else in the wallet code needs to know which provider is used.
 */
export async function getOrCreateUserFromIdentity(identity: {
  provider: 'sso';
  subject: string;
  email: string;
  displayName: string;
}): Promise<SandboxUser> {
  await ensureSandboxSchema();
  const existing = select<SandboxUser>(
    `SELECT id, email, display_name, idp, external_id, created_at FROM sandbox_users
       WHERE idp = ${q(identity.provider)} AND external_id = ${q(identity.subject)} LIMIT 1;`,
  )[0];
  if (existing) return existing;

  const userId = `usr_${randomUUID()}`;
  const now = new Date().toISOString();
  const openingZarMicro = Math.round(OPENING_DEMO_BALANCE_ZAR * MICRO);
  transaction([
    `INSERT INTO sandbox_users (id, email, display_name, idp, external_id, password_hash, created_at)
       VALUES (${q(userId)}, ${q(identity.email.toLowerCase())}, ${q(identity.displayName)},
               'sso', ${q(identity.subject)}, NULL, ${q(now)});`,
    `INSERT INTO sandbox_wallets (user_id, balance_zar_micro, balance_sngm_micro, created_at, updated_at)
       VALUES (${q(userId)}, ${openingZarMicro}, 0, ${q(now)}, ${q(now)});`,
    `INSERT INTO sandbox_transactions
       (id, user_id, type, direction, amount_zar_micro, amount_sngm_micro,
        balance_zar_micro_after, balance_sngm_micro_after, rate_zar_per_sngm, note, created_at)
       VALUES (${q(`tx_${randomUUID()}`)}, ${q(userId)}, 'opening_demo_balance', 'credit',
               ${openingZarMicro}, 0, ${openingZarMicro}, 0, ${DEMO_ZAR_PER_SNGM},
               ${q('Sandbox demo wallet opened with R10,500.00 of simulated funds.')}, ${q(now)});`,
  ]);
  return {
    id: userId,
    email: identity.email.toLowerCase(),
    display_name: identity.displayName,
    idp: 'sso',
    external_id: identity.subject,
    created_at: now,
  };
}

/** True when the database file is readable and writable. */
export function sandboxStorageReady(): boolean {
  try {
    run('SELECT 1;');
    return true;
  } catch {
    return false;
  }
}
