import Link from 'next/link';
import { ArrowLeft, LogIn } from 'lucide-react';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/SandboxAuthForms';
import { getSession } from '@/lib/sandbox/session';

export const metadata = {
  title: 'Sign in | Sangoma sandbox',
};

export default async function SandboxSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await getSession();
  if (session) redirect(next && next.startsWith('/') ? next : '/wallet');

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
            <LogIn size={36} className="text-sangoma-gold" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-3">
            Sign in to your sandbox
          </h1>
          <p className="text-white/60 text-sm font-medium max-w-md mx-auto">
            Your demo wallet, positions and transaction ledger are waiting.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6">
        <SignInForm next={next} />
      </div>
    </div>
  );
}
