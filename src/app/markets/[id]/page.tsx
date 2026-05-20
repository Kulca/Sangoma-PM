import { getMarketById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import TradePanel from '@/components/TradePanel';
import OrderBook from '@/components/OrderBook';
import ProbabilityChart from '@/components/ProbabilityChart';
import Link from 'next/link';
import { ArrowLeft, Share2, Info, ShieldCheck, Globe, AlertTriangle, Scale } from 'lucide-react';

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Header */}
      <div className="bg-sangoma-green text-white pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sangoma-gold font-bold text-sm mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft size={16} />
            Back to Markets
          </Link>
          
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block bg-sangoma-gold/20 text-sangoma-gold text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-sangoma-gold/30">
                  {market.category}
                </span>
                {market.is_council_verified && (
                  <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-green-500/30">
                    <ShieldCheck size={12} /> Council Verified
                  </span>
                )}
                {market.status === 'disputed' && (
                  <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-red-500/30 animate-pulse">
                    <AlertTriangle size={12} /> Disputed
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black leading-tight mb-4">{market.title}</h1>
              <div className="flex items-center gap-4 text-xs font-bold text-white/60">
                <span className="flex items-center gap-1.5"><Globe size={14} /> Global Market</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Verified Outcome</span>
              </div>
            </div>
            <button className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors flex-shrink-0">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6">
        {market.status === 'disputed' && (
          <div className="bg-white border-2 border-red-100 rounded-3xl p-6 mb-8 flex items-start gap-4 shadow-lg shadow-red-500/5">
            <div className="bg-red-50 p-3 rounded-2xl">
              <Scale size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-sangoma-green uppercase mb-1">Market Under Review</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                This market has been disputed. The Sangoma Council is currently reviewing the resolution. 
                Trading is suspended until a final verdict is reached.
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <div className="bg-white border border-sangoma-green/20 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Probability Trend</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-sangoma-green">62%</span>
                    <span className="text-xs font-bold text-green-600">+4.2%</span>
                  </div>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  {['1H', '1D', '1W', 'ALL'].map((t) => (
                    <button key={t} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${t === '1D' ? 'bg-white shadow-sm text-sangoma-green' : 'text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <ProbabilityChart />
            </div>

            {/* Description */}
            <div className="bg-white border border-sangoma-green/20 rounded-3xl p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} /> About this Market
              </h3>
              <div className="prose prose-sm max-w-none text-sangoma-earth">
                <p className="font-medium leading-relaxed">{market.description}</p>
                <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-black uppercase mb-2">Resolution Source</h4>
                  <p className="text-xs font-bold text-gray-500">This market will resolve based on official statements from the relevant authorities and reputable news outlets (News24, Daily Maverick, etc.).</p>
                </div>
              </div>
            </div>

            {/* Order Book */}
            <OrderBook market={market} />
          </div>

          {/* Sidebar / Trade Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TradePanel market={market} />
              
              <div className="mt-6 p-6 bg-sangoma-gold/5 border border-sangoma-gold/20 rounded-3xl">
                <h4 className="text-[10px] font-black uppercase text-sangoma-gold tracking-widest mb-3">Your Position</h4>
                <p className="text-xs font-bold text-sangoma-earth italic">You don't have any shares in this market yet.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
