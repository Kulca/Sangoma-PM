'use client';

import { useState } from 'react';
import { mockDisputes, mockMarkets, mockProposals } from '@/lib/mock-data';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Gavel, Scale, Clock, Zap, Lightbulb } from 'lucide-react';

export default function CouncilPortal() {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [markets, setMarkets] = useState(mockMarkets);
  const [proposals, setProposals] = useState(mockProposals);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const resolveDispute = (id: string, status: 'resolved' | 'dismissed') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status, resolved_at: new Date().toISOString() } : d));
    setSelectedDispute(null);
  };

  const approveProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    alert(`Proposal ${id} approved!`);
    setSelectedProposal(null);
  };

  const rejectProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    alert(`Proposal ${id} rejected.`);
    setSelectedProposal(null);
  };

  const proposeUMA = (marketId: string, outcome: string) => {
    setMarkets(prev => prev.map(m => m.id === marketId ? { 
      ...m, 
      status: 'uma_proposed', 
      uma_proposed_outcome: outcome,
      uma_liveness_ends: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    } : m));
    alert(`Outcome "${outcome}" proposed via UMA for market ${marketId}`);
  };

  const settleUMA = (marketId: string) => {
    setMarkets(prev => prev.map(m => m.id === marketId ? { ...m, status: 'uma_settled' } : m));
    alert(`Market ${marketId} settled via UMA`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-xs mb-4">
            <Shield size={16} /> Sangoma Council
          </div>
          <h1 className="text-4xl font-black mb-2 italic tracking-tighter">Council Governance Dashboard</h1>
          <p className="text-white/60 text-sm max-w-xl font-medium">
            The Sangoma Council monitors market integrity, manages UMA disputes, and executes final resolution protocols.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* UMA Resolution Queue */}
            <section>
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                <Scale size={14} className="text-sangoma-gold" /> UMA Resolution Queue
              </h2>
              <div className="space-y-4">
                {markets.filter(m => m.status !== 'resolved' && m.status !== 'uma_settled').map((market) => (
                  <div 
                    key={market.id}
                    onClick={() => { setSelectedMarket(market); setSelectedDispute(null); }}
                    className={`bg-white border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedMarket?.id === market.id ? 'border-sangoma-gold' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-sangoma-green/10 text-sangoma-green text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            {market.category}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            market.status === 'open' ? 'bg-blue-100 text-blue-700' : 
                            market.status === 'uma_proposed' ? 'bg-amber-100 text-amber-700' :
                            market.status === 'uma_challenged' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {market.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-sangoma-green">{market.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Ends</p>
                        <p className="text-xs font-bold text-sangoma-green">{new Date(market.resolution_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {market.status === 'uma_proposed' && (
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-amber-600" />
                          <div>
                            <p className="text-[10px] font-black text-amber-800 uppercase">Liveness Countdown</p>
                            <p className="text-xs font-bold text-amber-900">
                              {new Date(market.uma_liveness_ends!) > new Date() 
                                ? `Expires in ${Math.round((new Date(market.uma_liveness_ends!).getTime() - Date.now()) / (1000 * 60 * 60))} hours`
                                : 'Liveness period ended'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-amber-800 uppercase">Proposed Outcome</p>
                          <p className="text-sm font-black text-amber-900 uppercase">{market.uma_proposed_outcome}</p>
                        </div>
                      </div>
                    )}

                    {market.status === 'uma_challenged' && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-red-600" />
                          <div>
                            <p className="text-[10px] font-black text-red-800 uppercase">Status</p>
                            <p className="text-xs font-bold text-red-900">Challenged - Awaiting Oracle Vote</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-red-800 uppercase">Challenger</p>
                          <p className="text-[10px] font-mono text-red-900">{market.uma_challenger}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Active Disputes */}
            <section>
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" /> Community Disputes
              </h2>
              <div className="space-y-4">
                {disputes.map((dispute) => {
                  const market = markets.find(m => m.id === dispute.market_id);
                  return (
                    <div 
                      key={dispute.id}
                      onClick={() => { setSelectedDispute(dispute); setSelectedMarket(null); setSelectedProposal(null); }}
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
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Market Proposals */}
            <section>
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                <Lightbulb size={14} className="text-sangoma-gold" /> Market Proposals
              </h2>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div 
                    key={proposal.id}
                    onClick={() => { setSelectedProposal(proposal); setSelectedMarket(null); setSelectedDispute(null); }}
                    className={`bg-white border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedProposal?.id === proposal.id ? 'border-sangoma-gold' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-sangoma-gold/10 text-sangoma-gold text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                          {proposal.category}
                        </span>
                        <h3 className="text-lg font-black text-sangoma-green mt-1">{proposal.title}</h3>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        proposal.status === 'pending' ? 'bg-blue-100 text-blue-700' : 
                        proposal.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-medium italic">"{proposal.description}"</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
                      <span>By User #{proposal.user_id}</span>
                      <span>Submitted {new Date(proposal.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Resolution Sidebar */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">
              Decision Engine
            </h2>
            
            {selectedMarket ? (
              <div className="bg-white border border-sangoma-green/20 rounded-[2.5rem] p-8 shadow-xl sticky top-24">
                <div className="bg-sangoma-green/10 p-4 rounded-3xl mb-6">
                  <Scale size={32} className="text-sangoma-green mb-2" />
                  <h3 className="font-black text-sangoma-green">Market Action</h3>
                  <p className="text-[10px] font-bold text-sangoma-green/60 uppercase">{selectedMarket.title}</p>
                </div>
                
                <div className="space-y-6 mb-8">
                  {selectedMarket.status === 'open' ? (
                    <>
                      <p className="text-xs text-gray-500 font-medium">
                        This market is ready for resolution. Proposing an outcome will start the UMA liveness period (24h).
                      </p>
                      <div className="space-y-2">
                        {selectedMarket.outcome_tokens.map((token: any) => (
                          <button 
                            key={token.id}
                            onClick={() => proposeUMA(selectedMarket.id, token.label)}
                            className="w-full bg-gray-50 border-2 border-gray-100 hover:border-sangoma-gold p-4 rounded-2xl text-left transition-all group"
                          >
                            <p className="text-[10px] font-black text-gray-400 uppercase">Propose Outcome</p>
                            <p className="text-sm font-black text-sangoma-green group-hover:text-sangoma-gold uppercase">{token.label}</p>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : selectedMarket.status === 'uma_proposed' && new Date(selectedMarket.uma_liveness_ends) <= new Date() ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                        <p className="text-xs text-green-800 font-bold">Liveness period has expired with no challenges. This outcome can now be settled.</p>
                      </div>
                      <button 
                        onClick={() => settleUMA(selectedMarket.id)}
                        className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
                      >
                        <Zap size={18} className="text-sangoma-gold" />
                        Settle Market
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                      <Clock size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-[10px] font-black text-gray-400 uppercase">Awaiting Status Change</p>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedProposal ? (
              <div className="bg-white border border-sangoma-green/20 rounded-[2.5rem] p-8 shadow-xl sticky top-24">
                <div className="bg-sangoma-gold/10 p-4 rounded-3xl mb-6">
                  <Lightbulb size={32} className="text-sangoma-gold mb-2" />
                  <h3 className="font-black text-sangoma-green">Market Proposal</h3>
                  <p className="text-[10px] font-bold text-sangoma-green/60 uppercase">{selectedProposal.title}</p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Description</label>
                    <p className="text-xs font-medium text-sangoma-green">{selectedProposal.description}</p>
                  </div>
                  {selectedProposal.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <button 
                        onClick={() => rejectProposal(selectedProposal.id)}
                        className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl hover:bg-red-50 transition-all group"
                      >
                        <XCircle size={24} className="text-gray-400 group-hover:text-red-500 mb-1" />
                        <span className="text-[10px] font-black uppercase text-gray-500">Reject</span>
                      </button>
                      <button 
                        onClick={() => approveProposal(selectedProposal.id)}
                        className="flex flex-col items-center justify-center p-4 bg-sangoma-green rounded-2xl hover:bg-sangoma-green/90 transition-all group"
                      >
                        <CheckCircle size={24} className="text-sangoma-gold mb-1" />
                        <span className="text-[10px] font-black uppercase text-white">Approve</span>
                      </button>
                    </div>
                  )}
                  {selectedProposal.status !== 'pending' && (
                    <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                      <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposal {selectedProposal.status}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedDispute ? (
              <div className="bg-white border border-sangoma-green/20 rounded-[2.5rem] p-8 shadow-xl sticky top-24">
                <div className="bg-sangoma-gold/10 p-4 rounded-3xl mb-6">
                  <Gavel size={32} className="text-sangoma-gold mb-2" />
                  <h3 className="font-black text-sangoma-green">Dispute Review</h3>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Reason</label>
                    <p className="text-sm font-medium text-sangoma-green italic">"{selectedDispute.reason}"</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Action</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button 
                        onClick={() => resolveDispute(selectedDispute.id, 'dismissed')}
                        className="p-3 bg-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        Dismiss
                      </button>
                      <button 
                        onClick={() => resolveDispute(selectedDispute.id, 'resolved')}
                        className="p-3 bg-sangoma-green rounded-xl text-[10px] font-black uppercase text-white hover:bg-sangoma-green/90 transition-all"
                      >
                        Investigate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                <Info size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                  Select a market or dispute <br/> to take action
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
