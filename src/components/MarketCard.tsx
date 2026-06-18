'use client';

import { Market } from '@/lib/types';
import { useState } from 'react';
import { TrendingUp, Clock, Info, ArrowRight, ShieldCheck, AlertTriangle, Scale, Clock9 } from 'lucide-react';
import { buyToken } from '@/lib/actions';
import Link from 'next/link';

interface MarketCardProps {
  market: Market;
}

const statusColors: any = {
  uma_proposed: 'bg-amber-50 border-amber-100 text-amber-700',
  uma_challenged: 'bg-red-50 border-red-100 text-red-700',
  uma_settled: 'bg-green-50 border-green-100 text-green-700',
  disputed: 'bg-red-50 border-red-100 text-red-700',
};

const statusLabels: any = {
  uma_proposed: 'UMA Proposed',
  uma_challenged: 'UMA Challenged',
  uma_settled: 'UMA Settled',
  disputed: 'Disputed',
};

export default function MarketCard({ market }: MarketCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  const isUMA = market.status?.startsWith('uma_');
  const isLocked = market.status !== 'open';

  const handlePredict = async (outcomeId: string) => {
    setIsBuying(true);
    const token = market.outcome_tokens?.find(t => t.id === outcomeId);
    if (token) {
      const result = await buyToken(market.id, token.id, 10, token.probability || 0.5);
      if (result.success) {
        alert(`${result.message} Bought 10 shares of ${token.label}`);
        setSelectedOutcome(null);
      }
    }
    setIsBuying(false);
  };

  return (
    <div className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm mb-6 transition-all hover:shadow-md group ${market.status === 'disputed' || market.status === 'uma_challenged' ? 'border-red-100' : 'border-sangoma-green/20'}`}>
      <div className={`${(market.status === 'disputed' || market.status === 'uma_challenged') ? 'bg-red-50' : market.status === 'uma_proposed' ? 'bg-amber-50' : 'bg-sangoma-green/5'} px-4 py-2 flex justify-between items-center border-b ${(market.status === 'disputed' || market.status === 'uma_challenged') ? 'border-red-100' : 'border-sangoma-green/10'}`}>
        <div className="flex gap-2 items-center">
          <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${market.status === 'disputed' || market.status === 'uma_challenged' ? 'text-red-500' : 'text-sangoma-green'}`}>
            <TrendingUp size={12} />
            {market.category}
          </span>
          {market.is_council_verified && (
            <span className="text-[10px] font-black uppercase text-green-600 flex items-center gap-0.5">
              <ShieldCheck size={10} /> Verified
            </span>
          )}
          {market.status !== 'open' && (
            <span className={`text-[10px] font-black uppercase flex items-center gap-0.5 px-2 py-0.5 rounded-full ${statusColors[market.status] || 'bg-gray-100 text-gray-600'}`}>
              {market.status === 'uma_proposed' && <Clock9 size={10} />}
              {market.status === 'uma_challenged' && <Scale size={10} />}
              {statusLabels[market.status] || market.status}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-sangoma-earth flex items-center gap-1">
          <Clock size={12} />
          {new Date(market.resolution_date).toLocaleDateString()}
        </span>
      </div>
      
      <div className="p-5">
        <Link href={`/markets/${market.id}`} className="block group">
          <h3 className="text-lg font-bold mb-2 leading-tight text-sangoma-green group-hover:text-sangoma-gold transition-colors flex items-center justify-between">
            {market.title}
            <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-sangoma-gold" />
          </h3>
        </Link>
        <p className="text-xs text-sangoma-earth/80 mb-5 leading-relaxed">{market.description}</p>
        
        <div className="space-y-2.5">
          {market.outcome_tokens?.map((token) => (
            <button
              key={token.id}
              disabled={isLocked}
              onClick={() => !isLocked && setSelectedOutcome(token.id)}
              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${
                selectedOutcome === token.id
                  ? 'border-sangoma-gold bg-sangoma-gold/5 ring-1 ring-sangoma-gold'
                  : isLocked ? 'border-gray-50 bg-gray-50/10 cursor-not-allowed opacity-60' : 'border-gray-100 hover:border-sangoma-green/30 bg-gray-50/30'
              }`}
            >
              <span className="font-bold text-sm">{token.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-sangoma-green">
                  {((token.probability || 0) * 100).toFixed(0)}%
                </span>
                <div className="w-12 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-sangoma-gold h-full transition-all duration-500" 
                    style={{ width: `${(token.probability || 0) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">Total Volume</span>
            <span className="text-xs font-bold text-sangoma-green">Mock Data</span>
          </div>
          {isLocked ? (
            <div className="text-[10px] font-black uppercase text-gray-400 italic">
              Trading Closed
            </div>
          ) : (
            <button 
              disabled={!selectedOutcome || isBuying}
              onClick={() => selectedOutcome && handlePredict(selectedOutcome)}
              className={`bg-sangoma-green hover:bg-sangoma-green/90 text-sangoma-cream font-bold py-2 px-6 rounded-xl text-xs shadow-sm transition-all active:scale-95 flex items-center gap-2 ${(!selectedOutcome || isBuying) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isBuying ? 'Processing...' : 'Predict'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
