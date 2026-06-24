'use client';

import { useState } from 'react';
import { mockDisputes, mockMarkets } from '@/lib/mock-data';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Gavel } from 'lucide-react';

export default function CouncilPortal() {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);

  const resolveDispute = (id: string, status: 'resolved' | 'dismissed') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status, resolved_at: new Date().toISOString() } : d));
    setSelectedDispute(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-xs mb-4">
            <Shield size={16} /> Sangoma Council
          </div>
          <h1 className="text-4xl font-black mb-2 italic tracking-tighter">Dispute Resolution Portal</h1>
          <p className="text-white/60 text-sm max-w-xl font-medium">
            The Sangoma Council is responsible for final market resolutions in cases of ambiguity or dispute. 
            Decisions here are final and trigger the payout process.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dispute List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> Active Disputes
            </h2>
            
            {disputes.map((dispute) => {
              const market = mockMarkets.find(m => m.id === dispute.market_id);
              return (
                <div 
                  key={dispute.id}
                  onClick={() => setSelectedDispute(dispute)}
                  className={`bg-white border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedDispute?.id === dispute.id ? 'border-sangoma-gold' : 'border-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-sangoma-gold/20 text-sangoma-earth text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        Market #{dispute.market_id}
                      </span>
                      <h3 className="text-lg font-black text-sangoma-green mt-1">{market?.title}</h3>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      dispute.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-medium italic">"{dispute.reason}"</p>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
                    <span className="flex items-center gap-1"><Info size={12} /> Raised {new Date(dispute.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resolution Sidebar */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">
              Resolution Engine
            </h2>
            
            {selectedDispute ? (
              <div className="bg-white border border-sangoma-green/20 rounded-[2.5rem] p-8 shadow-xl sticky top-24">
                <div className="bg-sangoma-gold/10 p-4 rounded-3xl mb-6">
                  <Gavel size={32} className="text-sangoma-gold mb-2" />
                  <h3 className="font-black text-sangoma-green">Case Details</h3>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Reason for Dispute</label>
                    <p className="text-sm font-medium text-sangoma-green">{selectedDispute.reason}</p>
                  </div>
                  {selectedDispute.evidence_url && (
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Evidence URL</label>
                      <a href={selectedDispute.evidence_url} target="_blank" className="text-xs text-blue-500 font-bold hover:underline">
                        {selectedDispute.evidence_url}
                      </a>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Council Notes</label>
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-xs font-bold outline-none focus:border-sangoma-gold/30 h-32"
                      placeholder="Add council findings..."
                      defaultValue={selectedDispute.council_notes}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => resolveDispute(selectedDispute.id, 'dismissed')}
                    className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all group"
                  >
                    <XCircle size={24} className="text-gray-400 group-hover:text-red-500 mb-1" />
                    <span className="text-[10px] font-black uppercase text-gray-500">Dismiss</span>
                  </button>
                  <button 
                    onClick={() => resolveDispute(selectedDispute.id, 'resolved')}
                    className="flex flex-col items-center justify-center p-4 bg-sangoma-green rounded-2xl hover:bg-sangoma-green/90 transition-all group"
                  >
                    <CheckCircle size={24} className="text-sangoma-gold mb-1" />
                    <span className="text-[10px] font-black uppercase text-white">Resolve</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                <Info size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                  Select a dispute to begin <br/> the resolution process
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
