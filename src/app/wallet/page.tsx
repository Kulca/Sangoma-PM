import Link from 'next/link';
import {
  Wallet as WalletIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Lock,
  LogOut,
  ArrowLeftRight,
} from 'lucide-react';
import { requireSandboxSession } from '@/lib/sandbox/guard';
import { getWalletSnapshot, type LedgerEntry } from '@/lib/sandbox/wallet';
import { signOutAction } from '@/lib/sandbox/actions';
import { formatSngm, formatZar } from '@/lib/sandbox/money';
import { DEMO_ZAR_PER_SNGM } from '@/lib/sandbox/config';
import { SimulatedFundsBadge, SimulatedFundsBanner } from '@/components/SimulatedFunds';
import ConvertPanel from '@/components/ConvertPanel';

export const dynamic = 'force-dynamic';

const LEDGER_LABELS: Record<string, string> = {
  opening_demo_balance: 'Opening demo balance',
  convert_zar_to_sngm: 'ZAR → SNGM',
  convert_sngm_to_zar: 'SNGM → ZAR',
};

function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const label = LEDGER_LABELS[entry.type] ?? entry.type;
  const zarPositive =
    entry.type === 'opening_demo_balance' || entry.type === 'convert_sngm_to_zar';

  return (
    <tr className="hover:bg-gray-50/60 transition-colors align-top">
      <td className="px-4 py-4">
        <div className="font-black text-sangoma-green text-xs">{label}</div>
        <div className="text-[10px] text-gray-400 font-medium mt-0.5">
          {entry.note ?? '—'}
        </div>
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div
          className={`font-black text-xs ${
            zarPositive ? 'text-green-600' : 'text-sangoma-earth'
          }`}
        >
          {entry.amount_zar_micro > 0
            ? `${zarPositive ? '+' : '−'} ${formatZar(entry.amount_zar_micro)}`
            : '—'}
        </div>
        <div className="text-[10px] font-bold text-gray-400">
          {entry.amount_sngm_micro > 0
            ? `${zarPositive ? '−' : '+'} ${formatSngm(entry.amount_sngm_micro)} SNGM`
            : '—'}
        </div>
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div className="font-black text-[11px] text-sangoma-green">
          {formatZar(entry.balance_zar_micro_after)}
        </div>
        <div className="text-[10px] font-bold text-gray-400">
          {formatSngm(entry.balance_sngm_micro_after)} SNGM
        </div>
      </td>
      <td className="px-4 py-4 text-right text-[10px] font-bold text-gray-400 whitespace-nowrap">
        {new Date(entry.created_at).toLocaleString('en-ZA', {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </td>
    </tr>
  );
}

function DisabledMoneyCard({
  title,
  icon,
  body,
}: {
  title: string;
  icon: React.ReactNode;
  body: string;
}) {
  return (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-6">
      <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>
      <button
        type="button"
        disabled
        aria-disabled="true"
        title={body}
        className="w-full bg-gray-100 text-gray-400 font-black py-4 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <Lock size={16} /> {title}
      </button>
      <p className="mt-3 flex items-start gap-1.5 text-[10px] font-bold text-gray-500">
        <Lock size={12} className="mt-0.5 shrink-0" /> {body}
      </p>
    </div>
  );
}

export default async function WalletPage() {
  const session = await requireSandboxSession('/wallet');
  const wallet = await getWalletSnapshot(session.subject);

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      {/* Wallet Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-xs">
              <WalletIcon size={16} /> My Wallet
            </div>
            <div className="flex items-center gap-2">
              <SimulatedFundsBadge />
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-sangoma-gold transition-colors"
                >
                  <LogOut size={12} /> Sign out
                </button>
              </form>
            </div>
          </div>

          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Simulated ZAR balance
          </p>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <h1 className="text-4xl font-black">{formatZar(wallet.zarMicro)}</h1>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm font-black text-sangoma-gold mb-1">
              {formatSngm(wallet.sngmMicro)} SNGM
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-white/60">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              Demo rate: R{DEMO_ZAR_PER_SNGM.toFixed(2)} = 1 SNGM
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {session.displayName} · {session.email}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <SimulatedFundsBanner className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConvertPanel
            direction="zar_to_sngm"
            title="Convert ZAR → SNGM"
            hint={`Flat demo rate R${DEMO_ZAR_PER_SNGM.toFixed(2)} = 1 SNGM. No fees, no slippage.`}
            cta="Convert to SNGM"
            tone="green"
          />
          <ConvertPanel
            direction="sngm_to_zar"
            title="Convert SNGM → ZAR"
            hint={`Flat demo rate R${DEMO_ZAR_PER_SNGM.toFixed(2)} = 1 SNGM. No fees, no slippage.`}
            cta="Convert to ZAR"
            tone="gold"
          />

          <DisabledMoneyCard
            title="Deposit ZAR"
            icon={<ArrowUpCircle size={14} className="text-gray-400" />}
            body="Deposits are not available in the sandbox. No real money can enter the platform."
          />
          <DisabledMoneyCard
            title="Withdraw ZAR"
            icon={<ArrowDownCircle size={14} className="text-gray-400" />}
            body="Withdrawals are not available in the sandbox. Simulated funds cannot leave the platform."
          />
        </div>

        {/* Transaction Ledger */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <Clock size={14} /> Transaction ledger
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {wallet.ledger.length} {wallet.ledger.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="bg-white border border-sangoma-green/20 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-[9px] font-black uppercase text-gray-400">
                      Type
                    </th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase text-gray-400 text-right">
                      Movement
                    </th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase text-gray-400 text-right">
                      Balance after
                    </th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase text-gray-400 text-right">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {wallet.ledger.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-gray-400 font-bold text-xs">
                        No ledger entries yet.
                      </td>
                    </tr>
                  ) : (
                    wallet.ledger.map((entry) => <LedgerRow key={entry.id} entry={entry} />)
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-3 px-2">
            Every movement in the demo wallet is written here: type, amount, balance after
            and timestamp. Balances are simulated; market prices are real.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/portfolio"
            className="flex items-center gap-2 bg-sangoma-green text-white font-black py-3 px-6 rounded-2xl text-xs hover:scale-[1.02] transition-all"
          >
            <ArrowLeftRight size={14} /> View portfolio
          </Link>
          <Link
            href="/markets"
            className="flex items-center gap-2 bg-white border-2 border-sangoma-green/20 text-sangoma-green font-black py-3 px-6 rounded-2xl text-xs hover:scale-[1.02] transition-all"
          >
            Browse markets
          </Link>
        </div>
      </div>
    </div>
  );
}
