'use client';

import { useAuth } from '@/context/AuthContext';
import { Wallet } from 'lucide-react';

export default function ConnectButton() {
  const { userAddress, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-9 px-4 rounded-xl bg-gray-100 animate-pulse w-24"></div>
    );
  }

  if (userAddress) {
    return (
      <button 
        onClick={logout}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-sangoma-green/10 text-sangoma-green font-bold text-xs hover:bg-sangoma-green/20 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
      </button>
    );
  }

  return (
    <button 
      onClick={login}
      className="flex items-center gap-2 h-9 px-4 rounded-xl bg-sangoma-green text-white font-black text-xs hover:bg-sangoma-green/90 transition-all shadow-md active:scale-95"
    >
      <Wallet size={14} />
      Login
    </button>
  );
}
