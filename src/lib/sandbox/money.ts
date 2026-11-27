/**
 * Money helpers. Balances are integer micro-units everywhere; only the view
 * layer converts to a display string.
 */
import { MICRO } from './config';

export function toMicro(amount: number): number {
  return Math.round(amount * MICRO);
}

export function fromMicro(micro: number): number {
  return micro / MICRO;
}

/** R 10,500.00 — always two decimals, always the R prefix. */
export function formatZar(micro: number): string {
  return `R ${fromMicro(micro).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** 10,500.00 — SNGM amount without a currency prefix. */
export function formatSngm(micro: number): string {
  return fromMicro(micro).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parse a user-entered amount ("250", "250.50") into micro-units, or null. */
export function parseAmountMicro(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, '').replace(/,/g, '');
  if (!/^\d+(\.\d{1,6})?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return toMicro(value);
}
