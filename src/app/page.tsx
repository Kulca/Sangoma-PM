import { mockMarkets } from '@/lib/mock-data';
import MarketCard from '@/components/MarketCard';
import { getESPStatus } from '@/lib/eskom-se-push';
import Header from '@/components/Header';

export default async function Home() {
  const espStatus = await getESPStatus();

  // Add some metadata to mock markets for the dashboard demo
  const marketsWithGovernance = mockMarkets.map(m => {
    if (m.id === '1') return { ...m, status: 'disputed' as const };
    if (m.id === '2') return { ...m, is_council_verified: true };
    return m;
  });

  return (
    <main className="min-h-screen pb-24 bg-sangoma-cream/30">
      <Header espStatus={espStatus} />

      {/* Featured Markets Section */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h2 className="text-2xl font-black text-sangoma-green tracking-tight italic uppercase">
              Trending
            </h2>
            <div className="h-1 w-8 bg-sangoma-gold rounded-full" />
          </div>
          <button className="text-[10px] font-black text-sangoma-earth uppercase tracking-[0.2em] border-b border-sangoma-gold/50">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {marketsWithGovernance.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>
    </main>
  );
}
