'use client';

import { useState } from 'react';
import { Shield, ChevronRight, User, IdCard, Landmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setStepData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    bankAccount: '',
    bankName: 'Standard Bank',
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate ThisIsMe Identity and AVS verification
    setTimeout(() => {
      setStep(4);
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-sangoma-green text-white pb-24 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-sangoma-gold p-4 rounded-3xl mb-6 shadow-xl shadow-sangoma-gold/20">
            <Shield size={40} className="text-sangoma-green" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tight mb-2">FICA Verification</h1>
          <p className="text-white/60 text-sm text-center">To trade real value, we need to verify your identity as per South African regulations.</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-sangoma-gold' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <User size={20} className="text-sangoma-gold" />
                <h2 className="text-xl font-black">Personal Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">First Name (as on ID)</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Last Name (as on ID)</label>
                  <input 
                    type="text" 
                    placeholder="Enter last name"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={nextStep}
                className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl shadow-lg hover:translate-x-1 transition-transform flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <IdCard size={20} className="text-sangoma-gold" />
                <h2 className="text-xl font-black">Identity Document</h2>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">South African ID Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 9001015000081"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                />
              </div>
              <div className="bg-sangoma-cream/20 p-4 rounded-2xl border border-sangoma-gold/20">
                <p className="text-[10px] font-bold text-sangoma-earth leading-relaxed">
                  We use <span className="text-sangoma-green font-black">ThisIsMe</span> to securely verify your identity with the Department of Home Affairs.
                </p>
              </div>
              <button 
                onClick={nextStep}
                className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl shadow-lg hover:translate-x-1 transition-transform flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Landmark size={20} className="text-sangoma-gold" />
                <h2 className="text-xl font-black">Bank Verification</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Bank Name</label>
                  <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all appearance-none">
                    <option>Standard Bank</option>
                    <option>First National Bank</option>
                    <option>ABSA</option>
                    <option>Capitec</option>
                    <option>Nedbank</option>
                    <option>TymeBank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter account number"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? 'Verifying with ThisIsMe...' : 'Complete Verification'}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black mb-2">Verification Success!</h2>
              <p className="text-gray-400 text-sm mb-8 font-medium">Your identity has been verified. You can now deposit and withdraw ZAR instantly.</p>
              <Link 
                href="/wallet"
                className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all"
              >
                Go to Wallet
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
