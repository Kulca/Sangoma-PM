import { getMarkets } from '@/lib/onchain-service';
import { getESPStatus } from '@/lib/eskom-se-push';
import MarketCard from '@/components/MarketCard';
import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Infrastructure', 'Economics', 'Finance', 'Sports', 'Water', 'Energy', 'Politics'] as const;

export default async function MarketsPage() {
  const espStatus = await getESPStatus();
  // Use onchain service with silent mock fallback
  const fetchedMarkets = await getMarkets();
  const marketsWithGovernance = fetchedMarkets.map(m => {
    if (m.id === 'uma-market-1') return { ...m, status: 'uma_proposed' as const };
    if (m.id === 'uma-market-2') return { ...m, status: 'uma_challenged' as const };
    return m;
  });

  return (
    <main className="min-h-screen pb-24 bg-sangoma-cream/30">
      <Header espStatus={espStatus} />

      {/* Markets Content */}
      <section className="px-6 -mt-8 relative z-20">
        {/* Back & Title */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-sangoma-green/10">
              <ArrowLeft size={18} className="text-sangoma-green" />
            </Link>
            <div>
              <h2 className="text-2xl font-black text-sangoma-green tracking-tight italic uppercase flex items-center gap-2">
                <TrendingUp size={22} className="text-sangoma-gold" /> Markets
              </h2>
              <div className="h-1 w-8 bg-sangoma-gold rounded-full mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-sangoma-earth/60 uppercase tracking-widest">
            <Filter size={14} />
            <span>{marketsWithGovernance.length} Active</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide px-2 -mx-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 transition-all ${
                cat === 'All'
                  ? 'bg-sangoma-green text-white border-sangoma-green shadow-sm'
                  : 'bg-white text-sangoma-earth/70 border-sangoma-green/10 hover:border-sangoma-green/30 hover:text-sangoma-green'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Market Cards */}
        <div className="space-y-4">
          {marketsWithGovernance.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Empty State (hidden when markets exist) */}
        {marketsWithGovernance.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-sangoma-green/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={32} className="text-sangoma-green/30" />
            </div>
            <h3 className="text-lg font-black text-sangoma-green mb-2">No Markets Yet</h3>
            <p className="text-sm text-sangoma-earth/60 max-w-xs mx-auto">
              Markets will appear here once the Sangoma Council approves them.
            </p>
            <Link
              href="/proposals"
              className="inline-block mt-6 bg-sangoma-gold text-sangoma-green font-black py-3 px-8 rounded-2xl shadow-lg hover:scale-105 transition-all text-sm"
            >
              Propose a Market
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}