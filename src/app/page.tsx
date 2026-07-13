import { mockMarkets } from '@/lib/mock-data';
import MarketCard from '@/components/MarketCard';
import { getESPStatus } from '@/lib/eskom-se-push';
import Header from '@/components/Header';
import Link from 'next/link';
import { Users } from 'lucide-react';

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
          <Link href="/markets" className="text-[10px] font-black text-sangoma-earth uppercase tracking-[0.2em] border-b border-sangoma-gold/50 hover:text-sangoma-green transition-colors">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {marketsWithGovernance.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Waitlist CTA */}
        <div className="mt-8 bg-sangoma-green rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sangoma-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative z-10">
            <h3 className="text-xl font-black italic tracking-tighter mb-1">Not Seeing What You Want?</h3>
            <p className="text-white/60 text-xs font-medium mb-5">
              Join the waitlist for early access and exclusive market previews.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 bg-sangoma-gold text-sangoma-green font-black py-3 px-6 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-sm"
            >
              <Users size={16} /> Join Waitlist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
