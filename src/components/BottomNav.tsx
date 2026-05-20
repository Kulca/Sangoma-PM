'use client';

import { LayoutGrid, BarChart3, Wallet, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-sangoma-green text-sangoma-cream rounded-2xl flex justify-around py-4 px-6 shadow-2xl border border-white/10 backdrop-blur-md z-50">
      <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-sangoma-gold' : 'opacity-40'}`}>
        <LayoutGrid size={20} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Markets</span>
      </Link>
      <Link href="/portfolio" className={`flex flex-col items-center gap-1 ${pathname === '/portfolio' ? 'text-sangoma-gold' : 'opacity-40'}`}>
        <BarChart3 size={20} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Portfolio</span>
      </Link>
      <Link href="/wallet" className={`flex flex-col items-center gap-1 ${pathname === '/wallet' ? 'text-sangoma-gold' : 'opacity-40'}`}>
        <Wallet size={20} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Wallet</span>
      </Link>
      <Link href="/onboarding" className={`flex flex-col items-center gap-1 ${pathname === '/onboarding' ? 'text-sangoma-gold' : 'opacity-40'}`}>
        <ShieldCheck size={20} />
        <span className="text-[9px] font-black uppercase tracking-tighter">FICA</span>
      </Link>
    </nav>
  );
}
