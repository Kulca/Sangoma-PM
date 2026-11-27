/**
 * Demo wallet: balances in integer micro-units, and an append-only ledger.
 * Every movement of money writes exactly one ledger row.
 */
import { randomUUID } from 'node:crypto';
import { DEMO_ZAR_PER_SNGM } from './config';
import { ensureSandboxSchema, q, select } from './sqlite';
import { run } from './sqlite';

export interface Wallet {
  userId: string;
  zarMicro: number;
  sngmMicro: number;
}

export interface LedgerEntry {
  id: string;
  type: string;
  direction: string;
  amount_zar_micro: number;
  amount_sngm_micro: number;
  balance_zar_micro_after: number;
  balance_sngm_micro_after: number;
  rate_zar_per_sngm: number;
  note: string | null;
  created_at: string;
}

export async function getWallet(userId: string): Promise<Wallet> {
  await ensureSandboxSchema();
  const rows = select<{ balance_zar_micro: number; balance_sngm_micro: number }>(
    `SELECT balance_zar_micro, balance_sngm_micro FROM sandbox_wallets
       WHERE user_id = ${q(userId)} LIMIT 1;`,
  );
  return {
    userId,
    zarMicro: rows[0]?.balance_zar_micro ?? 0,
    sngmMicro: rows[0]?.balance_sngm_micro ?? 0,
  };
}

export async function getLedger(userId: string, limit = 50): Promise<LedgerEntry[]> {
  await ensureSandboxSchema();
  return select<LedgerEntry>(
    `SELECT id, type, direction, amount_zar_micro, amount_sngm_micro,
            balance_zar_micro_after, balance_sngm_micro_after, rate_zar_per_sngm,
            note, created_at
       FROM sandbox_transactions
      WHERE user_id = ${q(userId)}
      ORDER BY created_at DESC, rowid DESC
      LIMIT ${Math.max(1, Math.min(limit, 200))};`,
  );
}

export interface WalletSnapshot extends Wallet {
  rate: number;
  ledger: LedgerEntry[];
}

export async function getWalletSnapshot(userId: string): Promise<WalletSnapshot> {
  const [wallet, ledger] = await Promise.all([getWallet(userId), getLedger(userId)]);
  return { ...wallet, rate: DEMO_ZAR_PER_SNGM, ledger };
}

export type ConvertDirection = 'zar_to_sngm' | 'sngm_to_zar';

export interface ConvertResult {
  ok: boolean;
  error?: string;
  wallet?: Wallet;
}

/**
 * Convert at the flat demo rate. The debit, the credit and the ledger row are
 * one atomic statement, and the debit only applies when the balance covers it.
 */
export async function convert(
  userId: string,
  direction: ConvertDirection,
  amountMicro: number,
): Promise<ConvertResult> {
  if (!Number.isFinite(amountMicro) || amountMicro <= 0) {
    return { ok: false, error: 'Enter an amount greater than zero.' };
  }
  await ensureSandboxSchema();

  const now = new Date().toISOString();
  const txId = `tx_${randomUUID()}`;

  const isZarToSngm = direction === 'zar_to_sngm';
  const debitZar = isZarToSngm ? amountMicro : 0;
  const debitSngm = isZarToSngm ? 0 : amountMicro;
  const creditSngm = isZarToSngm
    ? Math.round(amountMicro / DEMO_ZAR_PER_SNGM)
    : 0;
  const creditZar = isZarToSngm
    ? 0
    : Math.round(amountMicro * DEMO_ZAR_PER_SNGM);

  const type = isZarToSngm ? 'convert_zar_to_sngm' : 'convert_sngm_to_zar';
  const note = isZarToSngm
    ? 'Converted ZAR to SNGM at the flat demo rate.'
    : 'Converted SNGM to ZAR at the flat demo rate.';

  // changes() is still the UPDATE's row count inside the following SELECT, so
  // the ledger row is written only when the balance actually covered the debit.
  run(`
BEGIN IMMEDIATE;
UPDATE sandbox_wallets
   SET balance_zar_micro  = balance_zar_micro  - ${debitZar} + ${creditZar},
       balance_sngm_micro = balance_sngm_micro - ${debitSngm} + ${creditSngm},
       updated_at = ${q(now)}
 WHERE user_id = ${q(userId)}
   AND balance_zar_micro >= ${debitZar}
   AND balance_sngm_micro >= ${debitSngm};
INSERT INTO sandbox_transactions
  (id, user_id, type, direction, amount_zar_micro, amount_sngm_micro,
   balance_zar_micro_after, balance_sngm_micro_after, rate_zar_per_sngm, note, created_at)
SELECT ${q(txId)}, ${q(userId)}, ${q(type)}, 'swap',
       ${debitZar + creditZar}, ${debitSngm + creditSngm},
       balance_zar_micro, balance_sngm_micro, ${DEMO_ZAR_PER_SNGM}, ${q(note)}, ${q(now)}
  FROM sandbox_wallets
 WHERE user_id = ${q(userId)} AND changes() = 1;
COMMIT;
`);

  const written = select<{ id: string }>(
    `SELECT id FROM sandbox_transactions WHERE id = ${q(txId)} LIMIT 1;`,
  );
  if (written.length === 0) {
    return {
      ok: false,
      error: isZarToSngm
        ? 'Not enough ZAR in your demo wallet for that conversion.'
        : 'Not enough SNGM in your demo wallet for that conversion.',
    };
  }
  return { ok: true, wallet: await getWallet(userId) };
}
