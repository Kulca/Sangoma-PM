import { mockMarkets } from '@/lib/mock-data';
import { getESPStatus } from '@/lib/eskom-se-push';
import { Shield, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import ResolveButton from '@/components/ResolveButton';

export default async function AdminPage() {
  const espStatus = await getESPStatus();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Admin Header */}
      <header className="bg-sangoma-green text-white px-6 py-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-sangoma-gold font-black uppercase tracking-widest text-xs mb-2">
              <Shield size={16} /> Sangoma Admin
            </div>
            <h1 className="text-3xl font-black italic">Internal Oracle Dashboard</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-white/60">System Status</p>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold">Matching Engine Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Oracle Status Card */}
          <div className="md:col-span-3 bg-white border border-sangoma-green/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${espStatus.is_live ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-sangoma-gold'}`}>
                <Activity size={32} />
              </div>
              <div>
                <h2 className="font-black text-sangoma-green">EskomSePush Oracle</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {espStatus.is_live ? 'Live Feed Connected' : 'Mock Data / Offline'}
                </p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase">Current Stage</p>
                <p className="text-2xl font-black text-sangoma-green">{espStatus.stage}</p>
              </div>
              <div className="text-center border-l border-gray-100 pl-8">
                <p className="text-[10px] font-black text-gray-400 uppercase">Next Change</p>
                <p className="text-2xl font-black text-sangoma-earth">Stage {espStatus.next_stage || '?'}</p>
              </div>
              <div className="text-center border-l border-gray-100 pl-8">
                <p className="text-[10px] font-black text-gray-400 uppercase">Last Poll</p>
                <p className="text-xs font-black text-sangoma-green mt-2">
                  {espStatus.last_polled ? new Date(espStatus.last_polled).toLocaleTimeString() : 'Never'}
                </p>
              </div>
            </div>
            <div>
              <button className="bg-sangoma-green text-white text-xs font-black px-6 py-3 rounded-2xl hover:bg-sangoma-green/90 transition-colors">
                Refresh Oracle
              </button>
            </div>
          </div>

          {/* Market Resolution Section */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <AlertCircle size={14} /> Pending Resolution
              </h2>
            </div>
            
            <div className="space-y-4">
              {mockMarkets.map((market) => (
                <div key={market.id} className="bg-white border border-sangoma-green/20 rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-sangoma-green/5 text-sangoma-green text-[10px] font-black uppercase px-2 py-1 rounded">
                          {market.category}
                        </span>
                        <span className="text-xs font-bold text-gray-400">ID: {market.id}</span>
                      </div>
                      <h3 className="text-lg font-black text-sangoma-green">{market.title}</h3>
                      <p className="text-xs font-bold text-sangoma-earth">Target Resolution: {new Date(market.resolution_date).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {market.outcome_tokens?.map((token) => (
                        <ResolveButton 
                          key={token.id}
                          marketId={market.id}
                          tokenId={token.id}
                          label={token.label}
                        />
                      ))}
                      <button className="bg-red-50 border-2 border-red-100 hover:border-red-500 px-4 py-2 rounded-xl text-xs font-black text-red-600 transition-all">
                        Cancel Market
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-sangoma-green font-bold text-[10px]">
            <Activity size={20} />
            LIVE SITE
          </Link>
          <div className="flex flex-col items-center gap-1 text-sangoma-gold font-bold text-[10px]">
            <Shield size={20} />
            ADMIN
          </div>
        </div>
      </div>
    </div>
  );
}
