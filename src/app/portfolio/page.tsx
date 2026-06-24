'use client';

import { useState, useEffect } from 'react';
import { mockHoldings, mockTrades, mockUserProfile } from '@/lib/mock-data';
import Link from 'next/link';
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownRight, Shield, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/lib/types';

export default function PortfolioPage() {
  const { userAddress, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userAddress) return;
      setIsProfileLoading(true);
      try {
        const res = await fetch(`/api/profile?address=${userAddress}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsProfileLoading(false);
      }
    };

    if (userAddress) {
      fetchProfile();
    }
  }, [userAddress]);

  const totalBalance = (profile?.balance_sngm || mockUserProfile.balance_sngm) + mockHoldings.reduce((acc, h) => acc + (h.shares * h.current_price), 0);
  const totalPnL = mockHoldings.reduce((acc, h) => acc + (h.shares * (h.current_price - h.avg_price)), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-sangoma-green flex items-center justify-center">
        <Loader2 className="text-sangoma-gold animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      {/* Summary Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-16 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-[10px]">
              <Wallet size={14} /> My Portfolio
            </div>
            
            {/* KYC Status Badge in Header */}
            <Link href="/verification" className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/20 transition-all">
              {profile?.kyc_tier === 2 ? (
                <ShieldCheck size={14} className="text-green-400" />
              ) : profile?.kyc_tier === 1 ? (
                <Shield size={14} className="text-sangoma-gold" />
              ) : (
                <ShieldAlert size={14} className="text-red-400" />
              )}
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {profile?.kyc_tier === 2 ? 'Verified' : profile?.kyc_tier === 1 ? 'Tier 1' : 'Unverified'}
              </span>
            </Link>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black mb-2 tracking-tighter italic">{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sangoma-gold not-italic">SNGM</span></h1>
              <div className={`flex items-center gap-1.5 font-bold text-sm ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} SNGM (All Time)
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-sangoma-gold text-sangoma-green font-black px-8 py-4 rounded-2xl shadow-lg shadow-sangoma-gold/20 hover:scale-105 transition-transform active:scale-95 text-sm uppercase tracking-widest">
                Deposit
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-sangoma-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="space-y-10">
          
          {/* Active Positions */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-sangoma-earth tracking-[0.2em] flex items-center gap-2">
                <TrendingUp size={14} /> Active Positions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockHoldings.length > 0 ? mockHoldings.map((holding) => {
                const pnl = holding.shares * (holding.current_price - holding.avg_price);
                const isPositive = pnl >= 0;

                return (
                  <Link key={holding.id} href={`/markets/${holding.market_id}`} className="bg-white border-2 border-sangoma-green/5 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                    <h3 className="font-black text-sangoma-green text-lg line-clamp-2 mb-6 group-hover:text-sangoma-gold transition-colors italic leading-tight">{holding.market_title}</h3>
                    <div className="flex justify-between items-center mb-8">
                      <span className="bg-sangoma-green/5 text-sangoma-green text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest">
                        {holding.outcome_label}
                      </span>
                      <span className="text-md font-black text-sangoma-earth">{holding.shares} Shares</span>
                    </div>
                    <div className="flex justify-between items-end border-t-2 border-gray-50 pt-6">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Avg. Price</span>
                        <span className="font-black text-xl text-sangoma-green">{holding.avg_price.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Profit / Loss</span>
                        <span className={`font-black text-xl ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{pnl.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              }) : (
                <div className="col-span-2 bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                   <p className="text-gray-400 font-bold">No active positions yet.</p>
                   <Link href="/" className="text-sangoma-gold font-black uppercase text-xs tracking-widest mt-4 inline-block">Explore Markets</Link>
                </div>
              )}
            </div>
          </section>

          {/* Trade History */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-sangoma-earth tracking-[0.2em] flex items-center gap-2">
                <History size={14} /> Trade History
              </h2>
            </div>
            <div className="bg-white border-2 border-sangoma-green/5 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b-2 border-gray-50">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Market / Outcome</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Side</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Shares</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-50">
                    {mockTrades.length > 0 ? mockTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-black text-sangoma-green text-sm mb-1">{trade.market_title}</div>
                          <div className="text-[10px] font-black text-sangoma-gold uppercase tracking-tighter">{trade.outcome_label}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trade.side}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-sangoma-earth text-sm">{trade.shares}</td>
                        <td className="px-8 py-6 text-right font-black text-sangoma-green text-sm">{trade.price.toFixed(2)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold">No trades yet.</td>
                      </tr>
                    )}
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
