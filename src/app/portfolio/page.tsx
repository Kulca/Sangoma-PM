import Link from 'next/link';
import { Wallet, TrendingUp, History, LogOut } from 'lucide-react';
import { requireSandboxSession } from '@/lib/sandbox/guard';
import { getWalletSnapshot } from '@/lib/sandbox/wallet';
import { signOutAction } from '@/lib/sandbox/actions';
import { formatSngm, formatZar } from '@/lib/sandbox/money';
import { SimulatedFundsBadge, SimulatedFundsBanner } from '@/components/SimulatedFunds';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const session = await requireSandboxSession('/portfolio');
  const wallet = await getWalletSnapshot(session.subject);

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      {/* Summary Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-16 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-start gap-3 mb-6">
            <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-[10px]">
              <Wallet size={14} /> My Portfolio
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
          <h1 className="text-4xl font-black mb-2 tracking-tighter">
            {formatZar(wallet.zarMicro)}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-white/60">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {formatSngm(wallet.sngmMicro)} SNGM liquid
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {session.displayName}
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-sangoma-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <SimulatedFundsBanner className="mb-8" />

        <div className="space-y-10">
          {/* Active Positions */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-sangoma-earth tracking-[0.2em] flex items-center gap-2">
                <TrendingUp size={14} /> Active positions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No open positions yet.</p>
                <p className="text-[10px] text-gray-400 font-medium mt-2">
                  Positions and their values are driven by live market prices once you
                  trade.
                </p>
                <Link
                  href="/markets"
                  className="text-sangoma-gold font-black uppercase text-xs tracking-widest mt-4 inline-block"
                >
                  Explore markets
                </Link>
              </div>
            </div>
          </section>

          {/* Trade History */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-sangoma-earth tracking-[0.2em] flex items-center gap-2">
                <History size={14} /> Trade history
              </h2>
            </div>
            <div className="bg-white border-2 border-sangoma-green/5 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b-2 border-gray-50">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Market / Outcome
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Side
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                        Shares
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-50">
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold">
                        No trades yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pb-4">
            <Link
              href="/wallet"
              className="bg-sangoma-green text-white font-black py-3 px-6 rounded-2xl text-xs hover:scale-[1.02] transition-all"
            >
              Open demo wallet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
