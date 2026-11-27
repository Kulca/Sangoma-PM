/**
 * Minimal SQLite access for the sandbox database.
 *
 * The app already shells out to the `sqlite3` CLI (see src/lib/db.ts); we keep
 * that approach but use execFileSync with an argv array so no shell ever sees
 * the SQL, and quote every value explicitly.
 *
 * The schema is created on first use, so a fresh machine only needs the file to
 * be reachable.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { SANDBOX_DB_PATH } from './config';

const BUSY_TIMEOUT_MS = 5000;

/** Quote a value as a SQL literal. Numbers pass through as-is. */
export function q(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('non-finite number in SQL');
    return String(Math.trunc(value));
  }
  return `'${value.replace(/'/g, "''")}'`;
}

/** Run one or more statements; throws on the first SQL error. */
export function run(sql: string): void {
  execFileSync('sqlite3', [SANDBOX_DB_PATH], {
    input: `PRAGMA busy_timeout=${BUSY_TIMEOUT_MS};\n${sql}\n`,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

/** Run a SELECT and return rows as objects. */
export function select<T = Record<string, unknown>>(sql: string): T[] {
  const out = execFileSync('sqlite3', ['-json', SANDBOX_DB_PATH], {
    input: `PRAGMA busy_timeout=${BUSY_TIMEOUT_MS};\n${sql}\n`,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
  if (!out) return [];
  return JSON.parse(out) as T[];
}

/** Run several statements atomically. */
export function transaction(statements: string[]): void {
  run(['BEGIN IMMEDIATE;', ...statements, 'COMMIT;'].join('\n'));
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS sandbox_users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  idp           TEXT NOT NULL DEFAULT 'password',   -- 'password' | 'sso'
  external_id   TEXT,                               -- SSO subject, NULL for password accounts
  password_hash TEXT,                               -- NULL for SSO-only accounts
  created_at    TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sandbox_users_identity
  ON sandbox_users (idp, external_id) WHERE external_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS sandbox_wallets (
  user_id            TEXT PRIMARY KEY,
  balance_zar_micro  INTEGER NOT NULL DEFAULT 0,
  balance_sngm_micro INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sandbox_transactions (
  id                        TEXT PRIMARY KEY,
  user_id                   TEXT NOT NULL,
  type                      TEXT NOT NULL,
  direction                 TEXT NOT NULL DEFAULT 'none', -- credit | debit | none
  amount_zar_micro          INTEGER NOT NULL DEFAULT 0,
  amount_sngm_micro         INTEGER NOT NULL DEFAULT 0,
  balance_zar_micro_after   INTEGER NOT NULL DEFAULT 0,
  balance_sngm_micro_after  INTEGER NOT NULL DEFAULT 0,
  rate_zar_per_sngm         REAL NOT NULL,
  note                      TEXT,
  created_at                TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sandbox_tx_user
  ON sandbox_transactions (user_id, created_at DESC);
`;

let schemaReady: Promise<void> | null = null;

/** Create the database file and tables on first use. Idempotent. */
export function ensureSandboxSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const dir = path.dirname(SANDBOX_DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      run(SCHEMA);
    })().catch((err) => {
      schemaReady = null; // let the next request retry
      throw err;
    });
  }
  return schemaReady;
}
