'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Market } from '@/lib/types';
import { smeClient } from '@/lib/sme-client';
import { getOrCreateSessionKey } from '@/lib/safe-service';
import { ethers } from 'ethers';

interface TradePanelProps {
  market: Market;
}

export default function TradePanel({ market }: TradePanelProps) {
  const { userAddress, signer } = useAuth();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState(0.50);
  const [quantity, setQuantity] = useState(10);
  const [selectedTokenId, setSelectedTokenId] = useState(market.outcome_tokens?.[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [oneClickEnabled, setOneClickEnabled] = useState(false);

  useEffect(() => {
    if (!smeClient) return;
    const unsubscribe = smeClient.subscribe((msg) => {
      if (msg.type === 'order_accepted' || msg.type === 'order_rejected') {
        setIsProcessing(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async () => {
    if (!smeClient || !userAddress) return;
    setIsProcessing(true);
    try {
      // If one-click is enabled, use the local session key
      // Otherwise, use the signer from AuthContext (which might be Web3Auth)
      const effectiveSigner = oneClickEnabled ? (getOrCreateSessionKey() || signer) : signer;
      
      if (!effectiveSigner) {
        throw new Error('No signer available');
      }

      await smeClient.placeOrder({
        market_id: market.id,
        outcome_token_id: selectedTokenId,
        side,
        type: orderType,
        price,
        quantity,
      }, effectiveSigner);
      
      console.log('Order placed successfully');
    } catch (error) {
      console.error('Failed to place order:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className=\"bg-white rounded-3xl p-6 shadow-xl border border-gray-100\">
      <div className=\"flex bg-gray-100 p-1 rounded-xl mb-6\">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${side === 'buy' ? 'bg-sangoma-green text-white shadow-sm' : 'text-gray-500'}`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${side === 'sell' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500'}`}
        >
          Sell
        </button>
      </div>

      <div className=\"mb-6\">
        <label className=\"block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest\">Select Outcome</label>
        <div className=\"grid grid-cols-2 gap-2\">
          {market.outcome_tokens?.map((token) => (
            <button
              key={token.id}
              onClick={() => setSelectedTokenId(token.id)}
              className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                selectedTokenId === token.id
                  ? 'border-sangoma-gold bg-sangoma-gold/5'
                  : 'border-gray-100 hover:border-sangoma-green/20'
              }`}
            >
              {token.label}
            </button>
          ))}
        </div>
      </div>

      <div className=\"space-y-4 mb-8\">
        <div className=\"flex justify-between items-end\">
          <label className=\"text-[10px] font-black uppercase text-gray-400 tracking-widest\">Order Type</label>
          <div className=\"flex gap-4\">
            <button onClick={() => setOrderType('limit')} className={`text-xs font-bold ${orderType === 'limit' ? 'text-sangoma-green underline' : 'text-gray-400'}`}>Limit</button>
            <button onClick={() => setOrderType('market')} className={`text-xs font-bold ${orderType === 'market' ? 'text-sangoma-green underline' : 'text-gray-400'}`}>Market</button>
          </div>
        </div>
        
        {orderType === 'limit' && (
          <div>
            <label className=\"block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest\">Price (SNGM)</label>
            <div className=\"relative\">
              <input
                type=\"number\"
                step=\"0.01\"
                min=\"0.01\"
                max=\"0.99\"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className=\"w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 font-black text-sangoma-green outline-none focus:border-sangoma-green/30\"
              />
              <span className=\"absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400\">per share</span>
            </div>
          </div>
        )}

        <div>
          <label className=\"block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest\">Quantity</label>
          <input
            type=\"number\"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className=\"w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 font-black text-sangoma-green outline-none focus:border-sangoma-green/30\"
          />
        </div>
      </div>

      <div className=\"bg-sangoma-green/5 rounded-2xl p-4 mb-6 border border-sangoma-green/10\">
        <div className=\"flex justify-between items-center mb-2\">
          <span className=\"text-xs font-bold text-sangoma-earth\">Total Cost</span>
          <span className=\"font-black text-sangoma-green\">{(price * quantity).toFixed(2)} SNGM</span>
        </div>
        <div className=\"flex justify-between items-center mb-4\">
          <span className=\"text-xs font-bold text-sangoma-earth\">Potential Payout</span>
          <span className=\"font-black text-sangoma-gold\">{(1.00 * quantity).toFixed(2)} SNGM</span>
        </div>
        
        <div className=\"flex items-center gap-2 pt-2 border-t border-sangoma-green/10\">
          <input
            type=\"checkbox\"
            id=\"oneClick\"
            checked={oneClickEnabled}
            onChange={(e) => setOneClickEnabled(e.target.checked)}
            className=\"w-4 h-4 rounded text-sangoma-green focus:ring-sangoma-green\"
          />
          <label htmlFor=\"oneClick\" className=\"text-[10px] font-bold text-sangoma-earth uppercase tracking-tight\">
            Enable One-Click Trading (Session Keys)
          </label>
        </div>
      </div>

      <button
        disabled={isProcessing || !userAddress}
        onClick={handleSubmit}
        className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-[0.98] ${
          side === 'buy' ? 'bg-sangoma-green hover:bg-sangoma-green/90' : 'bg-red-600 hover:bg-red-700'
        } ${isProcessing || !userAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {!userAddress ? 'Connect Wallet' : (isProcessing ? 'Processing...' : `${side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}`)}
      </button>
    </div>
  );
}
