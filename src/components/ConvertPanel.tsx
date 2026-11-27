'use client';

import { useActionState } from 'react';
import { ArrowLeftRight, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { convertAction, type ConvertFormState } from '@/lib/sandbox/actions';
import { SimulatedFundsBadge } from '@/components/SimulatedFunds';

export default function ConvertPanel({
  direction,
  title,
  hint,
  cta,
  tone,
}: {
  direction: 'zar_to_sngm' | 'sngm_to_zar';
  title: string;
  hint: string;
  cta: string;
  tone: 'green' | 'gold';
}) {
  const [state, formAction, pending] = useActionState<ConvertFormState, FormData>(
    convertAction,
    {},
  );

  return (
    <div className="bg-white border border-sangoma-green/20 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
          <ArrowLeftRight size={14} className="text-sangoma-green" /> {title}
        </h2>
        <SimulatedFundsBadge tone="light" />
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="direction" value={direction} />
        <div>
          <label
            className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2"
            htmlFor={`amount-${direction}`}
          >
            {direction === 'zar_to_sngm' ? 'Amount (ZAR)' : 'Amount (SNGM)'}
          </label>
          <input
            id={`amount-${direction}`}
            name="amount"
            type="text"
            inputMode="decimal"
            required
            placeholder="250.00"
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-black text-sangoma-green outline-none focus:border-sangoma-green/30 text-lg"
          />
          <p className="text-[10px] text-gray-400 font-medium mt-2 ml-2">{hint}</p>
        </div>

        {state.error && (
          <p className="flex items-start gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertTriangle size={12} className="mt-0.5 shrink-0" /> {state.error}
          </p>
        )}
        {state.message && !state.error && (
          <p className="flex items-start gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0" /> {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={`w-full font-black py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
            tone === 'green'
              ? 'bg-sangoma-green text-white hover:bg-sangoma-green/90'
              : 'bg-sangoma-gold text-sangoma-green hover:scale-[1.01]'
          }`}
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Converting...
            </>
          ) : (
            <>
              <ArrowLeftRight size={16} /> {cta}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
