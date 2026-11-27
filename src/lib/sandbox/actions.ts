/**
 * Server actions for the sandbox: sign up, sign in, sign out, convert.
 *
 * These are plain form actions (no client fetch), so they work under the
 * app's basePath and without JavaScript round-trips to a hard-coded URL.
 */
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authenticate, createSandboxAccount } from './accounts';
import { createSession, destroySession, getSession } from './session';
import { convert, type ConvertDirection } from './wallet';
import { parseAmountMicro } from './money';

export interface AuthFormState {
  error?: string;
  /** 'not_waitlisted' switches the signup page to the waitlist offer. */
  code?: string;
}

export interface ConvertFormState {
  error?: string;
  message?: string;
}

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v : '');

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = str(formData.get('email')).trim().toLowerCase();
  const displayName = str(formData.get('displayName')).trim();
  const password = str(formData.get('password'));
  const confirmPassword = str(formData.get('confirmPassword'));

  if (!email || !displayName || !password) {
    return { error: 'Display name, email and password are all required.' };
  }
  if (password !== confirmPassword) {
    return { error: 'The two passwords do not match.' };
  }

  const result = await createSandboxAccount({ email, displayName, password });
  if (!result.ok || !result.identity) {
    return { error: result.error ?? 'Could not create the account.', code: result.code };
  }

  await createSession(result.identity);
  redirect('/wallet');
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = str(formData.get('email')).trim().toLowerCase();
  const password = str(formData.get('password'));
  const next = str(formData.get('next'));

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const result = await authenticate({ email, password });
  if (!result.ok || !result.identity) {
    return { error: result.error ?? 'Email or password is incorrect.' };
  }

  await createSession(result.identity);
  redirect(next && next.startsWith('/') ? next : '/wallet');
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect('/');
}

export async function convertAction(
  _prev: ConvertFormState,
  formData: FormData,
): Promise<ConvertFormState> {
  const session = await getSession();
  if (!session) {
    return { error: 'Your session expired. Sign in again.' };
  }

  const direction = str(formData.get('direction')) as ConvertDirection;
  if (direction !== 'zar_to_sngm' && direction !== 'sngm_to_zar') {
    return { error: 'Unknown conversion direction.' };
  }

  const amountMicro = parseAmountMicro(str(formData.get('amount')));
  if (amountMicro === null) {
    return { error: 'Enter an amount greater than zero (up to 6 decimals).' };
  }

  const result = await convert(session.subject, direction, amountMicro);
  if (!result.ok) {
    return { error: result.error ?? 'Conversion failed.' };
  }

  revalidatePath('/wallet');
  revalidatePath('/portfolio');
  return {
    message:
      direction === 'zar_to_sngm'
        ? 'Converted ZAR to SNGM. Both balances updated.'
        : 'Converted SNGM to ZAR. Both balances updated.',
  };
}
