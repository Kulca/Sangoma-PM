import { mockHoldings, mockTrades, mockUserProfile } from '@/lib/mock-data';
import Link from 'next/link';
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

export default function PortfolioPage() {
  const totalBalance = mockUserProfile.balance_sngm + mockHoldings.reduce((acc, h) => acc + (h.shares * h.current_price), 0);
  const totalPnL = mockHoldings.reduce((acc, h) => acc + (h.shares * (h.current_price - h.avg_price)), 0);

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Summary Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-xs mb-4">
            <Wallet size={16} /> My Portfolio
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black mb-2">{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} SNGM</h1>
              <div className={`flex items-center gap-1.5 font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} SNGM (All Time)
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-sangoma-gold text-sangoma-green font-black px-6 py-3 rounded-2xl shadow-lg shadow-sangoma-gold/20 hover:scale-105 transition-transform active:scale-95">
                Deposit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="space-y-8">
          
          {/* Active Positions */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <TrendingUp size={14} /> Active Positions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockHoldings.map((holding) => {
                const pnl = holding.shares * (holding.current_price - holding.avg_price);
                const isPositive = pnl >= 0;

                return (
                  <Link key={holding.id} href={`/markets/${holding.market_id}`} className="bg-white border border-sangoma-green/20 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <h3 className="font-bold text-sangoma-green line-clamp-1 mb-4 group-hover:text-sangoma-gold transition-colors">{holding.market_title}</h3>
                    <div className="flex justify-between items-center mb-6">
                      <span className="bg-sangoma-green/5 text-sangoma-green text-[10px] font-black uppercase px-2 py-1 rounded">
                        {holding.outcome_label}
                      </span>
                      <span className="text-sm font-black text-sangoma-earth">{holding.shares} Shares</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Avg. Price</span>
                        <span className="font-black text-sangoma-green">{holding.avg_price.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Profit / Loss</span>
                        <span className={`font-black ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{pnl.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Trade History */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <History size={14} /> Trade History
              </h2>
            </div>
            <div className="bg-white border border-sangoma-green/20 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Market / Outcome</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Side</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Shares</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-sangoma-green text-sm">{trade.market_title}</div>
                          <div className="text-[10px] font-black text-sangoma-gold uppercase mt-1">{trade.outcome_label}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trade.side}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-sangoma-earth text-sm">{trade.shares}</td>
                        <td className="px-6 py-5 text-right font-black text-sangoma-green text-sm">{trade.price.toFixed(2)}</td>
                        <td className="px-6 py-5 text-right text-xs font-bold text-gray-400">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
