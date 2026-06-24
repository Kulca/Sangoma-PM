'use client';

import { Market } from '@/lib/types';
import { useState } from 'react';
import { TrendingUp, Clock, Info } from 'lucide-react';

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  const handlePredict = (outcomeId: string) => {
    setSelectedOutcome(outcomeId);
    // In a real app, this would open a betting modal
  };

  return (
    <div className="bg-white border border-sangoma-green/20 rounded-2xl overflow-hidden shadow-sm mb-6 transition-all hover:shadow-md">
      <div className="bg-sangoma-green/5 px-4 py-2 flex justify-between items-center border-b border-sangoma-green/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-sangoma-green flex items-center gap-1">
          <TrendingUp size={12} />
          {market.category}
        </span>
        <span className="text-[10px] font-medium text-sangoma-earth flex items-center gap-1">
          <Clock size={12} />
          {new Date(market.endDate).toLocaleDateString()}
        </span>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 leading-tight text-sangoma-green">{market.title}</h3>
        <p className="text-xs text-sangoma-earth/80 mb-5 leading-relaxed">{market.description}</p>
        
        <div className="space-y-2.5">
          {market.outcomes.map((outcome) => (
            <button
              key={outcome.id}
              onClick={() => handlePredict(outcome.id)}
              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${
                selectedOutcome === outcome.id
                  ? 'border-sangoma-gold bg-sangoma-gold/5 ring-1 ring-sangoma-gold'
                  : 'border-gray-100 hover:border-sangoma-green/30 bg-gray-50/30'
              }`}
            >
              <span className="font-bold text-sm">{outcome.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-sangoma-green">
                  {(outcome.probability * 100).toFixed(0)}%
                </span>
                <div className="w-12 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-sangoma-gold h-full transition-all duration-500" 
                    style={{ width: `${outcome.probability * 100}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">Total Volume</span>
            <span className="text-xs font-bold text-sangoma-green">R {market.volume.toLocaleString()}</span>
          </div>
          <button className="bg-sangoma-green hover:bg-sangoma-green/90 text-sangoma-cream font-bold py-2 px-6 rounded-xl text-xs shadow-sm transition-all active:scale-95 flex items-center gap-2">
            Predict
          </button>
        </div>
      </div>
    </div>
  );
}
