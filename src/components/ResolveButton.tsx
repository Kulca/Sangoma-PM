'use client';

import { useState } from 'react';
import { resolveMarket } from '@/lib/actions';

interface ResolveButtonProps {
  marketId: string;
  tokenId: string;
  label: string;
}

export default function ResolveButton({ marketId, tokenId, label }: ResolveButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleResolve = async () => {
    if (!confirm(`Are you sure you want to resolve this market as "${label}"? This action is irreversible and will trigger payouts.`)) {
      return;
    }
    
    setIsPending(true);
    try {
      const result = await resolveMarket(marketId, tokenId);
      if (result.success) {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to resolve market');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleResolve}
      disabled={isPending}
      className={`bg-gray-50 border-2 border-gray-100 hover:border-sangoma-gold px-4 py-2 rounded-xl text-xs font-black text-sangoma-green transition-all ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isPending ? 'Resolving...' : `Resolve "${label}"`}
    </button>
  );
}
