'use client';

import { useState } from 'react';
import { Mail, User, Wallet, ArrowRight, CheckCircle, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({ name: '', email: '', wallet_address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setCount(data.count || 0);
      } else {
        setError(data?.error || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sangoma-green text-white pb-24">
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-sangoma-gold/20 p-4 rounded-3xl w-fit mx-auto mb-6 shadow-2xl">
            <Users size={40} className="text-sangoma-gold" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4">Join the Waitlist</h1>
          <p className="text-white/60 text-sm font-medium max-w-md mx-auto">
            Be among the first to access Sangoma. Get early platform access, 
            exclusive market previews, and a Genesis Soulbound NFT.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6">
        {submitted ? (
          <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">You're on the List!</h2>
            <p className="text-gray-400 text-sm font-medium mb-2">
              We'll notify you when your spot opens up.
            </p>
            <p className="text-[10px] font-black text-sangoma-green/40 uppercase tracking-widest">
              {count} people ahead of you
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/markets" className="bg-sangoma-green text-white font-black py-4 px-8 rounded-2xl hover:scale-105 transition-all text-sm">
                Explore Markets
              </Link>
              <Link href="/proposals" className="text-sangoma-gold font-black text-sm hover:underline">
                Propose a Market
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 text-xs font-bold py-3 px-4 rounded-2xl">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 flex items-center gap-1">
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Thabo Mbeki"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 flex items-center gap-1">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="thabo@example.com"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 flex items-center gap-1">
                  <Wallet size={12} /> Wallet Address <span className="text-gray-300 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all font-mono text-xs"
                  value={formData.wallet_address}
                  onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Joining...
                  </span>
                ) : (
                  <><ArrowRight size={18} /> Join the Waitlist</>
                )}
              </button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-4 font-medium">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        )}

        {/* Perks */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Early Access', desc: 'Platform before public launch' },
            { label: 'Genesis NFT', desc: 'Soulbound pioneer token' },
            { label: 'Council Seat', desc: 'Shape market direction' },
          ].map((perk) => (
            <div key={perk.label} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-sangoma-gold font-black text-[10px] uppercase tracking-widest mb-1">{perk.label}</p>
              <p className="text-white/50 text-[10px] font-medium">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}