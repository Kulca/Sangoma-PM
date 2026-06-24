'use client';

import { useState, useEffect } from 'react';
import { Shield, ChevronRight, User, IdCard, CheckCircle2, Camera, Lock, ArrowRight, Loader2, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { verifyKycTier } from '@/lib/actions';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/lib/types';

export default function VerificationPage() {
  const { userAddress, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
  });

  const fetchProfile = async () => {
    if (!userAddress) return;
    try {
      const res = await fetch(`/api/profile?address=${userAddress}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  useEffect(() => {
    if (userAddress) {
      fetchProfile();
    }
  }, [userAddress]);

  const handleTier1 = async () => {
    if (!userAddress) return;
    if (!formData.firstName || !formData.lastName || !formData.idNumber) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    try {
      const result = await verifyKycTier(1, userAddress, formData);
      if (result.success) {
        await fetchProfile();
        setStep(4); // Success screen for Tier 1
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTier2Complete = async () => {
    if (!userAddress) return;
    setIsVerifying(true);
    setError(null);
    try {
      const result = await verifyKycTier(2, userAddress, { idNumber: profile?.id_number || formData.idNumber, liveness: true });
      if (result.success) {
        await fetchProfile();
        setStep(7); // Final success screen
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-sangoma-green flex items-center justify-center">
        <Loader2 className="text-sangoma-gold animate-spin" size={48} />
      </div>
    );
  }

  if (!userAddress) {
    return (
      <div className="min-h-screen bg-sangoma-green text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-sangoma-gold/20 p-6 rounded-full mb-8">
          <Shield size={64} className="text-sangoma-gold" />
        </div>
        <h1 className="text-3xl font-black italic mb-4">Verification Required</h1>
        <p className="text-white/70 mb-12 max-w-xs font-medium">
          Connect your wallet to access the FICA verification dashboard and unlock trading limits.
        </p>
        <Link href="/" className="bg-sangoma-gold text-sangoma-green font-black py-4 px-12 rounded-2xl shadow-xl shadow-sangoma-gold/20 active:scale-95 transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sangoma-cream/30 pb-32">
      {/* Header */}
      <header className="bg-sangoma-green text-sangoma-cream px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[3.5rem] shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-[10px] mb-6">
            <Shield size={16} /> Identity Verification
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic mb-2">FICA PORTAL</h1>
          <p className="text-sangoma-cream/70 font-medium max-w-[280px] text-sm leading-tight">
            South African regulatory compliance powered by <span className="text-white font-bold italic">ThisIsMe</span>.
          </p>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-12 right-6">
          <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider border-2 ${
            profile?.kyc_tier === 2 ? 'bg-green-500/20 border-green-500 text-green-400' : 
            profile?.kyc_tier === 1 ? 'bg-sangoma-gold/20 border-sangoma-gold text-sangoma-gold' : 
            'bg-white/10 border-white/20 text-white/50'
          }`}>
            {profile?.kyc_tier === 2 ? 'Tier 2 Verified' : 
             profile?.kyc_tier === 1 ? 'Tier 1 Pending' : 
             'Not Verified'}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-sangoma-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </header>

      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl min-h-[400px] flex flex-col">
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Show different content based on profile state and current step */}
            {profile?.kyc_tier === 0 && step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-sangoma-gold/10 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-sangoma-gold" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Personal Details</h2>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-snug">
                  Provide your legal name and ID to instantly activate <span className="text-sangoma-green font-bold">Tier 1</span> trading.
                </p>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 tracking-widest">First Name</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 tracking-widest">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 tracking-widest">South African ID Number</label>
                    <input 
                      type="text" 
                      value={formData.idNumber}
                      maxLength={13}
                      onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/50 transition-all"
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-black bg-red-50 p-4 rounded-2xl border border-red-100">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
                <button 
                  onClick={handleTier1}
                  disabled={isVerifying}
                  className="w-full bg-sangoma-green text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
                  {isVerifying ? 'Verifying with DHA...' : 'Submit Tier 1'}
                </button>
              </div>
            )}

            {/* Success Tier 1 or Already Tier 1 - Offer Tier 2 */}
            {((profile?.kyc_tier === 1 && step < 5) || step === 4) && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">Tier 1 Active!</h2>
                <p className="text-gray-400 text-sm mb-10 font-medium leading-relaxed">
                  Identity matched. You can now trade up to <span className="text-sangoma-green font-bold">R3,000</span> per month.
                </p>
                
                <div className="bg-sangoma-cream/40 rounded-3xl p-6 mb-8 w-full border border-sangoma-gold/10 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-sangoma-gold text-sangoma-green text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Recommended</div>
                    <span className="text-xs font-black text-sangoma-earth">TIER 2 VERIFICATION</span>
                  </div>
                  <h3 className="font-black text-lg mb-2">Unlock Full Potential</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 bg-sangoma-gold rounded-full" /> Unlimited Trading Volume
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 bg-sangoma-gold rounded-full" /> ZARP Instant Withdrawals
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 bg-sangoma-gold rounded-full" /> Priority Support
                    </li>
                  </ul>
                  <button 
                    onClick={() => setStep(5)}
                    className="w-full bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl shadow-lg shadow-sangoma-gold/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    Upgrade to Tier 2 <ArrowRight size={18} />
                  </button>
                </div>

                <Link href="/" className="text-gray-400 font-bold text-sm hover:text-sangoma-green transition-colors">
                  Continue to Markets
                </Link>
              </div>
            )}

            {/* Tier 2 Flow - ThisIsMe Widget Simulation */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-sangoma-gold/10 rounded-xl flex items-center justify-center">
                    <Camera size={20} className="text-sangoma-gold" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight italic">Biometric Liveness</h2>
                </div>
                
                {/* Simulated Widget UI */}
                <div className="aspect-square bg-gray-950 rounded-[3rem] flex flex-col items-center justify-center text-white relative overflow-hidden border-4 border-sangoma-gold/20">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sangoma-gold via-transparent to-transparent animate-pulse" />
                  <div className="relative z-10 w-48 h-64 border-2 border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-full h-full border-2 border-sangoma-gold/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                    <User size={64} className="absolute text-white/10" />
                  </div>
                  <div className="absolute bottom-10 left-0 right-0 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sangoma-gold mb-2">Analyzing Face...</p>
                    <div className="h-1 w-32 bg-white/10 mx-auto rounded-full overflow-hidden">
                       <div className="h-full bg-sangoma-gold w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-start border border-gray-100">
                  <Info className="text-sangoma-gold shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase tracking-wider">
                    Our partner ThisIsMe uses advanced AI to verify you are a real person. Data is encrypted and FICA-compliant.
                  </p>
                </div>
                
                <button 
                  onClick={() => setStep(6)}
                  className="w-full bg-sangoma-green text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Camera size={20} />
                  Capture Photo
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-sangoma-gold/10 rounded-xl flex items-center justify-center">
                    <IdCard size={20} className="text-sangoma-gold" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight italic">Document Scan</h2>
                </div>
                
                <div className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem] p-12 flex flex-col items-center justify-center text-gray-300 min-h-[300px]">
                  <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100 rotate-3">
                    <IdCard size={64} className="text-gray-200" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-center text-gray-400">Scan Front of South African ID Card / Smart ID</p>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-black bg-red-50 p-4 rounded-2xl border border-red-100">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button 
                  onClick={handleTier2Complete}
                  disabled={isVerifying}
                  className="w-full bg-sangoma-gold text-sangoma-green font-black py-5 rounded-2xl shadow-xl shadow-sangoma-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                  {isVerifying ? 'Processing Documents...' : 'Submit Full Verification'}
                </button>
              </div>
            )}

            {/* Final Success */}
            {(profile?.kyc_tier === 2 || step === 7) && (
              <div className="flex flex-col items-center py-8 text-center h-full justify-center">
                <div className="w-24 h-24 bg-sangoma-gold text-sangoma-green rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-sangoma-gold/30 animate-[bounce_2s_infinite]">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tighter italic uppercase">Master Verified</h2>
                <p className="text-gray-400 text-md mb-12 font-medium leading-relaxed max-w-[240px]">
                  Welcome to the Sangoma Elite. Your <span className="text-sangoma-green font-bold">Tier 2</span> status is active.
                </p>
                
                <div className="w-full space-y-4">
                  <div className="bg-green-50 p-5 rounded-3xl border border-green-100 flex items-center gap-4 text-left">
                    <div className="bg-green-500 text-white p-2 rounded-xl">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Airdrop Multiplier</p>
                      <p className="font-black text-sangoma-green">1.5x ACTIVE</p>
                    </div>
                  </div>

                  <Link 
                    href="/portfolio"
                    className="w-full bg-sangoma-green text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                  >
                    View My Portfolio <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trial Info Footer */}
      <footer className="px-10 mt-12 mb-20">
         <div className="flex flex-col gap-6">
            <div className="flex gap-4">
               <div className="w-1 bg-sangoma-gold rounded-full" />
               <div>
                  <h4 className="font-black text-xs text-sangoma-green uppercase tracking-widest mb-1">Regulatory Sandbox</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    Sangoma operates under the IFWG Sandbox Framework. All KYC data is handled according to POPIA and SARB guidelines.
                  </p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="w-1 bg-sangoma-gold rounded-full opacity-50" />
               <div>
                  <h4 className="font-black text-xs text-sangoma-green uppercase tracking-widest mb-1">Need Support?</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed underline">
                    verification-support@sangoma.so
                  </p>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
