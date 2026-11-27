import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SignUpForm } from '@/components/SandboxAuthForms';
import { SimulatedFundsBanner } from '@/components/SimulatedFunds';
import { OPENING_DEMO_BALANCE_ZAR, DEMO_ZAR_PER_SNGM } from '@/lib/sandbox/config';
import { formatZar, toMicro } from '@/lib/sandbox/money';
import { getSession } from '@/lib/sandbox/session';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create sandbox account | Sangoma',
};

export default async function SandboxSignUpPage() {
  const session = await getSession();
  if (session) redirect('/wallet');

  return (
    <div className="min-h-screen bg-sangoma-green text-white pb-24">
      <div className="pt-16 pb-10 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sangoma-gold font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={16} /> Back to markets
          </Link>
          <div className="bg-sangoma-gold/20 p-4 rounded-3xl w-fit mx-auto mb-6">
            <Sparkles size={36} className="text-sangoma-gold" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-3">
            Create your sandbox account
          </h1>
          <p className="text-white/60 text-sm font-medium max-w-md mx-auto">
            Trade real markets with simulated money. Every new account opens with{' '}
            <span className="text-sangoma-gold font-black">
              {formatZar(toMicro(OPENING_DEMO_BALANCE_ZAR))}
            </span>{' '}
            of demo ZAR, convertible to SNGM at R{DEMO_ZAR_PER_SNGM.toFixed(2)} = 1 SNGM.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6">
        <SimulatedFundsBanner className="mb-6" />
        <SignUpForm />
      </div>
    </div>
  );
}
