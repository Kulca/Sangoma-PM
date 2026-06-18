'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, CheckCircle2, AlertCircle, Wallet, ArrowRight, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import pioneerList from '@/lib/pioneer-list.json';

export default function WhitelistPage() {
  const { userAddress, login, isLoading: authLoading } = useAuth();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [pioneerData, setPioneerData] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userAddress) {
      // Check if address is in pioneer list
      // Note: The CSV might have handles or addresses. For Pilot users it has addresses.
      // For influencers it has handles.
      const found = pioneerList.find((p: any) => 
        p.handle.toLowerCase() === userAddress.toLowerCase() || 
        (p.platform === 'Ethereum' && p.handle.toLowerCase() === userAddress.toLowerCase())
      );

      if (found) {
        setIsEligible(true);
        setPioneerData(found);
      } else {
        // For Alpha demo, let's allow everyone to be eligible if they are not in the list but want to join
        // Actually, the requirement says check the list.
        setIsEligible(false);
      }
      
      // Check if already registered
      fetch('/api/whitelist')
        .then(res => res.json())
        .then(data => {
          if (data.find((r: any) => r.address.toLowerCase() === userAddress.toLowerCase())) {
            setIsRegistered(true);
          }
        })
        .catch(console.error);
    }
  }, [userAddress]);

  const handleRegister = async () => {
    if (!userAddress) return;
    setIsRegistering(true);
    setError(null);

    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: userAddress,
          handle: pioneerData?.handle || 'Unknown',
          name: pioneerData?.name || 'Pioneer User'
        }),
      });

      if (res.ok) {
        setIsRegistered(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-sangoma-cream/30 pb-20">
      {/* Header */}
      <header className="bg-sangoma-green text-sangoma-cream px-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sangoma-gold font-bold text-sm mb-6">
            <span className="opacity-70">←</span> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black tracking-tighter italic mb-2">PIONEER 100</h1>
          <p className="text-sangoma-cream/80 font-medium max-w-[280px]">
            Exclusive whitelist registration for the Sangoma Phase 6 IFWG Sandbox Trial.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-sangoma-gold/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      </header>

      <div className="px-6 -mt-8 relative z-20">
        {!userAddress ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-sangoma-green/5 text-center">
            <div className="w-16 h-16 bg-sangoma-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="text-sangoma-green" size={32} />
            </div>
            <h2 className="text-2xl font-black text-sangoma-green mb-3 tracking-tight">Connect Wallet</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Connect your Polygon wallet to check your eligibility for the Sangoma Pioneer cohort.
            </p>
            <button 
              onClick={login}
              disabled={authLoading}
              className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
              {authLoading ? 'Connecting...' : 'Connect Polygon Wallet'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Eligibility Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-sangoma-green/5">
              {isEligible ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="text-green-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-sangoma-green mb-2 tracking-tight">You are Eligible!</h2>
                  <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-6">Verified Pioneer</p>
                  
                  <div className="bg-sangoma-cream/50 rounded-2xl p-4 mb-8 text-left border border-sangoma-green/5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Recognized As</p>
                    <p className="font-black text-sangoma-green">{pioneerData?.name}</p>
                    <p className="text-xs text-gray-500">{pioneerData?.handle}</p>
                  </div>

                  {!isRegistered ? (
                    <button 
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isRegistering ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                      Confirm Registration
                    </button>
                  ) : (
                    <div className="bg-green-50 text-green-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-green-100">
                      <CheckCircle2 size={20} />
                      Registered Successfully
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-amber-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-sangoma-green mb-3 tracking-tight">Not on the List</h2>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Your address <strong>{userAddress.slice(0,6)}...{userAddress.slice(-4)}</strong> was not found in the initial Pioneer 100 list. 
                    The trial is currently limited to selected influencers and Phase 4 participants.
                  </p>
                  <Link 
                    href="/help"
                    className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    Request Access
                  </Link>
                </div>
              )}
              {error && (
                <p className="mt-4 text-red-500 text-xs font-bold text-center">{error}</p>
              )}
            </div>

            {/* FICA Teaser */}
            <Link href="/verification" className="bg-sangoma-green text-sangoma-cream rounded-3xl p-6 shadow-xl relative overflow-hidden block">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-sangoma-gold text-sangoma-green text-[10px] font-black px-2 py-0.5 rounded-full">
                    AVAILABLE NOW
                  </div>
                  <span className="text-xs font-bold opacity-70 italic">Tiered FICA Integration</span>
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight italic">Secure Your Payouts</h3>
                <p className="text-sm opacity-80 leading-relaxed mb-6">
                  Phase 6 introduces ThisIsMe integration for rapid South African ID verification. Mandatory for ZARP withdrawals.
                </p>
                <div className="flex items-center gap-2 text-sangoma-gold font-black text-sm group">
                  Verify Identity <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            </Link>
          </div>
        )}
      </div>

      {/* Info Section */}
      <section className="px-8 mt-12">
        <h4 className="text-[10px] uppercase font-black text-sangoma-earth tracking-[0.2em] mb-4">Trial Benefits</h4>
        <ul className="space-y-4">
          {[
            { title: 'Soulbound NFT', desc: 'Genesis Trader status with 0% trading fees.' },
            { title: 'ZARP Yield', desc: 'Incentives for liquidity in local markets.' },
            { title: 'Governance', desc: 'Voting rights on the Sangoma Council.' }
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="w-1 h-auto bg-sangoma-gold rounded-full shrink-0" />
              <div>
                <p className="font-black text-sangoma-green text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
