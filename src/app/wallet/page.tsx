'use client';

import { useState } from 'react';
import { mockUserProfile, mockTransactions } from '@/lib/mock-data';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
  const [depositAmount, setDepositAmount] = useState('100');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    setIsProcessing(true);
    // Simulate Stitch PaymentRequest creation
    setTimeout(() => {
      alert('Redirecting to Stitch... (Simulated)');
      setIsProcessing(false);
    }, 1000);
  };

  const handleWithdraw = async () => {
    if (mockUserProfile.kyc_status !== 'verified') {
      alert('Please complete FICA verification before withdrawing.');
      return;
    }
    setIsProcessing(true);
    // Simulate Stitch Payout
    setTimeout(() => {
      alert('Withdrawal initiated successfully!');
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Wallet Header */}
      <div className="bg-sangoma-green text-white pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-xs mb-4">
            <WalletIcon size={16} /> My Wallet
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total ZAR Balance</p>
              <h1 className="text-4xl font-black mb-2">R {mockUserProfile.balance_zar.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                <span className="text-xs font-bold text-sangoma-gold">SNGM</span>
                <span className="text-sm font-black">{mockUserProfile.balance_sngm.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${mockUserProfile.kyc_status === 'verified' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {mockUserProfile.kyc_status === 'verified' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-60">FICA Status</p>
                  <p className="font-black text-sm capitalize">{mockUserProfile.kyc_status}</p>
                </div>
              </div>
              {mockUserProfile.kyc_status !== 'verified' && (
                <Link href="/onboarding" className="bg-sangoma-gold text-sangoma-green text-[10px] font-black px-3 py-1.5 rounded-lg hover:scale-105 transition-transform">
                  VERIFY NOW
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Deposit Section */}
          <div className="bg-white border border-sangoma-green/20 rounded-3xl p-8 shadow-sm">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 flex items-center gap-2">
              <ArrowUpCircle size={14} className="text-green-500" /> Deposit ZAR
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Amount (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">R</span>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-10 pr-4 font-black text-sangoma-green outline-none focus:border-sangoma-green/30 text-xl"
                  />
                </div>
              </div>
              <button 
                onClick={handleDeposit}
                disabled={isProcessing}
                className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl shadow-lg hover:bg-sangoma-green/90 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Deposit via Stitch'}
              </button>
              <p className="text-[10px] text-center text-gray-400 font-medium">Instant EFT via secure banking API</p>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="bg-white border border-sangoma-green/20 rounded-3xl p-8 shadow-sm">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 flex items-center gap-2">
              <ArrowDownCircle size={14} className="text-red-500" /> Withdraw ZAR
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Amount (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">R</span>
                  <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-10 pr-4 font-black text-sangoma-green outline-none focus:border-sangoma-green/30 text-xl"
                  />
                </div>
              </div>
              <button 
                onClick={handleWithdraw}
                disabled={isProcessing || mockUserProfile.kyc_status !== 'verified'}
                className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  mockUserProfile.kyc_status === 'verified' 
                    ? 'bg-sangoma-gold text-sangoma-green hover:scale-[1.02]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Withdraw to Bank'}
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
                {mockUserProfile.kyc_status === 'verified' ? (
                  <>
                    <CheckCircle2 size={12} className="text-green-500" />
                    Verified to account ending in {mockUserProfile.bank_account_number.slice(-4)}
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} className="text-amber-500" />
                    FICA verification required
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="md:col-span-2 mt-8">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 px-2 flex items-center gap-2">
              <Clock size={14} /> Transaction History
            </h2>
            <div className="bg-white border border-sangoma-green/20 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Reference</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {tx.type === 'deposit' ? (
                              <ArrowUpCircle size={16} className="text-green-500" />
                            ) : (
                              <ArrowDownCircle size={16} className="text-red-500" />
                            )}
                            <span className="font-bold text-sangoma-green text-sm capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-mono text-gray-400">{tx.external_reference}</span>
                        </td>
                        <td className={`px-6 py-5 text-right font-black text-sm ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}R {tx.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right text-xs font-bold text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
