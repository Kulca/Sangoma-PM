import { mockMarkets } from '@/lib/mock-data';
import MarketCard from '@/components/MarketCard';
import { Search, Wallet, User, LayoutGrid, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen pb-24 bg-sangoma-cream/30">
      {/* Hero Section */}
      <header className="bg-sangoma-green text-sangoma-cream px-6 pt-16 pb-20 relative overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-sangoma-gold text-sangoma-green font-black px-3 py-1 rounded-lg text-sm tracking-tighter">
              ALPHA
            </div>
            <div className="flex gap-4">
              <Search size={20} className="text-sangoma-cream/70" />
              <Wallet size={20} className="text-sangoma-cream/70" />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tighter italic">SANGOMA</h1>
          <p className="text-md opacity-80 max-w-[240px] font-medium leading-tight">
            See the future, stake your claim. South Africa's prediction market.
          </p>
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
          {mockMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-sangoma-green text-sangoma-cream rounded-2xl flex justify-around py-4 px-6 shadow-2xl border border-white/10 backdrop-blur-md">
        <div className="flex flex-col items-center gap-1">
          <LayoutGrid size={20} className="text-sangoma-gold" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Markets</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-40">
          <BarChart3 size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Portfolio</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-40">
          <User size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
        </div>
      </nav>
    </main>
  );
}
