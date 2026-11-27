'use client';

import { HelpCircle, Wallet, Activity, Zap, MessageSquarePlus, ShieldCheck, LogIn } from 'lucide-react';
import Link from 'next/link';
import { SimulatedFundsBadge } from '@/components/SimulatedFunds';
import { formatSngm, formatZar } from '@/lib/sandbox/money';

export interface HeaderFunds {
  zarMicro: number;
  sngmMicro: number;
}

interface HeaderProps {
  espStatus: {
    is_live?: boolean;
    stage: number;
    next_stage?: number;
  };
  /** Simulated sandbox balances; null when nobody is signed in. */
  funds?: HeaderFunds | null;
}

export default function Header({ espStatus, funds = null }: HeaderProps) {
  return (
    <header className="bg-sangoma-green text-sangoma-cream px-6 pt-16 pb-20 relative overflow-hidden rounded-b-[3rem] shadow-xl">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <div className="bg-sangoma-gold text-sangoma-green font-black px-3 py-1 rounded-lg text-sm tracking-tighter">
              ALPHA
            </div>
            {espStatus.is_live && (
              <div className="bg-green-500 text-white font-black px-3 py-1 rounded-lg text-[10px] tracking-widest flex items-center gap-1 animate-pulse">
                <Activity size={12} /> LIVE
              </div>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/help" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
              <HelpCircle size={18} />
            </Link>
            {funds ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  <span className="text-[10px] font-bold text-sangoma-gold">SNGM</span>
                  <span className="text-xs font-black">{formatSngm(funds.sngmMicro)}</span>
                </div>
                <div className="text-[10px] font-black text-sangoma-gold mt-1">
                  {formatZar(funds.zarMicro)}
                </div>
                <SimulatedFundsBadge className="mt-1" />
              </div>
            ) : (
              <Link
                href="/sandbox/signin"
                className="flex items-center gap-1.5 bg-sangoma-gold text-sangoma-green font-black text-[10px] uppercase tracking-widest px-3 py-2 rounded-full hover:scale-105 transition-all"
              >
                <LogIn size={12} /> Sign in
              </Link>
            )}
            <Link href="/wallet">
              <Wallet size={20} className="text-sangoma-cream/70" />
            </Link>
          </div>
        </div>
        <h1 className="text-5xl font-black mb-3 tracking-tighter italic uppercase">SANGOMA</h1>
        <p className="text-md opacity-80 max-w-[240px] font-medium leading-tight mb-8">
          See the future, stake your claim. South Africa&apos;s prediction market.
        </p>

        <div className="flex gap-4 mb-8">
           <Link href="/proposals" className="flex-1 bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm">
              <MessageSquarePlus size={20} /> Propose
           </Link>
           <Link href="/verification" className="flex-1 bg-white text-sangoma-green font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm relative">
              <ShieldCheck size={20} />
              Verify
           </Link>
        </div>

        {/* ESP Status Banner */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sangoma-gold p-2 rounded-lg shadow-inner">
              <Zap size={20} className="text-sangoma-green" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Current Status</p>
              <p className="font-black text-lg leading-none mt-1">Stage {espStatus.stage} Loadshedding</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Next Change</p>
            <p className="font-bold text-sm">Stage {espStatus.next_stage}</p>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sangoma-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-sangoma-earth/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
    </header>
  );
}
