import { AlertTriangle } from 'lucide-react';
import { SIMULATED_FUNDS_BADGE, SIMULATED_FUNDS_BANNER } from '@/lib/sandbox/config';

/**
 * The sandbox money marker. Every screen that shows a balance, a price in
 * money or a position carries at least one of these.
 *
 * Deliberately loud: it must be impossible to read a balance here and think it
 * is real money.
 */

export function SimulatedFundsBadge({
  tone = 'dark',
  className = '',
}: {
  /** 'dark' sits on the green headers, 'light' on white cards. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const palette =
    tone === 'dark'
      ? 'bg-amber-300 text-amber-950 border-amber-200'
      : 'bg-amber-100 text-amber-900 border-amber-300';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${palette} ${className}`}
      title={SIMULATED_FUNDS_BANNER}
    >
      <AlertTriangle size={10} aria-hidden />
      {SIMULATED_FUNDS_BADGE}
    </span>
  );
}

export function SimulatedFundsBanner({ className = '' }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="Simulated funds notice"
      className={`flex items-start gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 ${className}`}
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
      <p className="text-[11px] font-bold leading-snug">{SIMULATED_FUNDS_BANNER}</p>
    </div>
  );
}
