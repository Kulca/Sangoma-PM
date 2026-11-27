'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Mail, Lock, User, AlertTriangle, Users } from 'lucide-react';
import { signInAction, signUpAction, type AuthFormState } from '@/lib/sandbox/actions';
import { SimulatedFundsBadge } from '@/components/SimulatedFunds';

const inputClass =
  'w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/40 transition-all';
const labelClass =
  'block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2 flex items-center gap-1';

function ErrorBox({ state }: { state: AuthFormState }) {
  if (!state.error) return null;
  return (
    <div className="bg-red-50 border-2 border-red-200 text-red-600 text-xs font-bold py-3 px-4 rounded-2xl flex items-start gap-2">
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <span>{state.error}</span>
    </div>
  );
}

export function SignUpForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signUpAction,
    {},
  );

  if (state.code === 'not_waitlisted') {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users size={32} />
        </div>
        <h2 className="text-xl font-black mb-2 tracking-tight">Not on the waitlist yet</h2>
        <p className="text-gray-500 text-sm font-medium mb-6">{state.error}</p>
        <Link
          href="/waitlist"
          className="block bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all"
        >
          Join the waitlist
        </Link>
        <Link
          href="/sandbox/signup"
          className="block mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-sangoma-green"
        >
          Try another email
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl">
      <form action={formAction} className="space-y-5">
        <ErrorBox state={state} />

        <div>
          <label className={labelClass} htmlFor="displayName">
            <User size={12} /> Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            placeholder="Thandi Mokoena"
            className={inputClass}
            autoComplete="nickname"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            <Mail size={12} /> Waitlisted email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
            autoComplete="email"
          />
          <p className="text-[10px] text-gray-400 font-medium mt-2 ml-2">
            Sandbox accounts are open to waitlisted emails only.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="password">
            <Lock size={12} /> Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className={inputClass}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="confirmPassword">
            <Lock size={12} /> Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            placeholder="Repeat the password"
            className={inputClass}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Creating account...
            </>
          ) : (
            <>
              <ArrowRight size={18} /> Create sandbox account
            </>
          )}
        </button>
      </form>

      <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-center gap-2 mb-1">
          <SimulatedFundsBadge tone="light" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-900">
            R10,500.00 demo balance
          </span>
        </div>
        <p className="text-[10px] font-medium text-amber-900/80 leading-snug">
          Your new wallet is funded with R10,500.00 of simulated money. It is not real
          money, it cannot be withdrawn, and no real money can be deposited.
        </p>
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mt-6">
        Already have a sandbox account?{' '}
        <Link href="/sandbox/signin" className="text-sangoma-green hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signInAction,
    {},
  );

  return (
    <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next ?? ''} />
        <ErrorBox state={state} />

        <div>
          <label className={labelClass} htmlFor="email">
            <Mail size={12} /> Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password">
            <Lock size={12} /> Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Your password"
            className={inputClass}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-sangoma-green text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Signing in...
            </>
          ) : (
            <>
              <ArrowRight size={18} /> Sign in
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mt-6">
        New here?{' '}
        <Link href="/sandbox/signup" className="text-sangoma-green hover:underline">
          Create a sandbox account
        </Link>
      </p>
    </div>
  );
}
