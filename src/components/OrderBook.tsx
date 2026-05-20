'use client';

import { useState, useEffect } from 'react';
import { Market } from '@/lib/types';
import { smeClient, SMEBookUpdate, SMEOrder } from '@/lib/sme-client';

interface OrderBookProps {
  market: Market;
}

export default function OrderBook({ market }: OrderBookProps) {
  const [bids, setBids] = useState<any[]>([]);
  const [asks, setAsks] = useState<any[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState(market.outcome_tokens?.[0]?.id || '');

  useEffect(() => {
    if (!smeClient) return;

    smeClient.connect();
    smeClient.getBook(market.id, selectedTokenId);

    const unsubscribe = smeClient.subscribe((msg) => {
      if (msg.type === 'book_update' && msg.outcome_token_id === selectedTokenId) {
        // Aggregate orders by price
        const aggBids = aggregateOrders(msg.bids || []);
        const aggAsks = aggregateOrders(msg.asks || []);
        setBids(aggBids.slice(0, 5));
        setAsks(aggAsks.slice(0, 5));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [market.id, selectedTokenId]);

  const aggregateOrders = (orders: SMEOrder[]) => {
    const agg: Record<number, number> = {};
    orders.forEach(o => {
      agg[o.price] = (agg[o.price] || 0) + o.remaining_quantity;
    });
    return Object.entries(agg)
      .map(([price, quantity]) => ({ price: parseFloat(price), quantity }))
      .sort((a, b) => b.price - a.price); // Default sort descending
  };

  const maxQty = Math.max(...bids.map(b => b.quantity), ...asks.map(a => a.quantity), 1);

  return (
    <div className="bg-white border border-sangoma-green/20 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Live Order Book</h3>
        <select 
          value={selectedTokenId} 
          onChange={(e) => setSelectedTokenId(e.target.value)}
          className="text-[10px] font-black uppercase bg-gray-50 border border-gray-100 rounded px-2 py-1 outline-none"
        >
          {market.outcome_tokens?.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between mb-3 px-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Size</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Price</span>
          </div>
          <div className="space-y-1">
            {bids.length > 0 ? bids.map((bid, i) => (
              <div key={i} className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-green-50 transition-colors relative overflow-hidden group">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-green-100/50 transition-all duration-500" 
                  style={{ width: `${(bid.quantity / maxQty) * 100}%` }}
                />
                <span className="text-xs font-bold text-gray-600 relative z-10">{bid.quantity.toLocaleString()}</span>
                <span className="text-xs font-black text-green-600 relative z-10">{bid.price.toFixed(2)}</span>
              </div>
            )) : (
              <div className="text-center py-4 text-[10px] font-bold text-gray-300 uppercase">No Bids</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-3 px-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Price</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Size</span>
          </div>
          <div className="space-y-1">
            {asks.length > 0 ? [...asks].reverse().map((ask, i) => (
              <div key={i} className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-red-50 transition-colors relative overflow-hidden group">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-red-100/50 transition-all duration-500" 
                  style={{ width: `${(ask.quantity / maxQty) * 100}%` }}
                />
                <span className="text-xs font-black text-red-600 relative z-10">{ask.price.toFixed(2)}</span>
                <span className="text-xs font-bold text-gray-600 relative z-10">{ask.quantity.toLocaleString()}</span>
              </div>
            )) : (
              <div className="text-center py-4 text-[10px] font-bold text-gray-300 uppercase">No Asks</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Last Price</span>
          <span className="text-lg font-black text-sangoma-green">
            {asks.length > 0 ? asks[asks.length-1].price.toFixed(2) : bids.length > 0 ? bids[0].price.toFixed(2) : '0.00'} SNGM
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</span>
          <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live
          </span>
        </div>
      </div>
    </div>
  );
}
