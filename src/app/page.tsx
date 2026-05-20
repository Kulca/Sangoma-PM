import { mockMarkets, mockUserProfile } from '@/lib/mock-data';
import MarketCard from '@/components/MarketCard';
import { Search, Wallet, User, LayoutGrid, BarChart3, Zap, Activity, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { getESPStatus } from '@/lib/eskom-se-push';
import Link from 'next/link';

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
      {/* Hero Section */}
      <header className="bg-sangoma-green text-sangoma-cream px-6 pt-16 pb-20 relative overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <div className="bg-sangoma-gold text-sangoma-green font-black px-3 py-1 rounded-lg text-sm tracking-tighter">
                ALPHA
              </div>
              {espStatus.is_live && (
                <div className="bg-green-500 text-white font-black px-3 py-1 rounded-lg text-[10px] tracking-widest flex items-center gap-1 animate-pulse">
                  <Activity size={12} /> LIVE
                </div>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/help" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <HelpCircle size={18} />
              </Link>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  <span className="text-[10px] font-bold text-sangoma-gold">SNGM</span>
                  <span className="text-xs font-black">{mockUserProfile.balance_sngm.toLocaleString()}</span>
                </div>
                <div className="text-[10px] font-black text-sangoma-gold mt-1">
                  R {mockUserProfile.balance_zar.toFixed(2)}
                </div>
              </div>
              <Link href="/wallet">
                <Wallet size={20} className="text-sangoma-cream/70" />
              </Link>
            </div>
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tighter italic">SANGOMA</h1>
          <p className="text-md opacity-80 max-w-[240px] font-medium leading-tight mb-8">
            See the future, stake your claim. South Africa's prediction market.
          </p>

          <div className="flex gap-4 mb-8">
             <Link href="/proposals" className="flex-1 bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                <MessageSquarePlus size={20} /> Propose Market
             </Link>
          </div>

          {/* ESP Status Banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sangoma-gold p-2 rounded-lg">
                <Zap size={20} className="text-sangoma-green" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-60">Current Status</p>
                <p className="font-black text-lg">Stage {espStatus.stage} Loadshedding</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold opacity-60">Next Change</p>
              <p className="font-bold text-sm">Stage {espStatus.next_stage}</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sangoma-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sangoma-earth/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </header>

      {/* Featured Markets Section */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h2 className="text-2xl font-black text-sangoma-green tracking-tight">
              Trending
            </h2>
            <div className="h-1 w-8 bg-sangoma-gold rounded-full" />
          </div>
          <button className="text-xs font-bold text-sangoma-earth uppercase tracking-widest">
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
