/**
 * Session guard for pages that show money.
 *
 * Any page under /wallet, /portfolio or /proposals calls requireSandboxSession
 * first; signed-out visitors are sent to the sign-in page and returned to the
 * page they asked for afterwards.
 */
import { redirect } from 'next/navigation';
import { getSession, type SessionPayload } from './session';
import { getWallet } from './wallet';

export async function requireSandboxSession(nextPath: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect(`/sandbox/signin?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}

/** Session for pages that render either way (e.g. the landing page). */
export async function optionalSession(): Promise<SessionPayload | null> {
  return getSession();
}

/**
 * Balances for the in-page header. Returns null when signed out, so the header
 * can offer a sign-in link instead of a balance.
 */
export async function headerFunds(): Promise<{
  zarMicro: number;
  sngmMicro: number;
} | null> {
  const session = await getSession();
  if (!session) return null;
  try {
    const wallet = await getWallet(session.subject);
    return { zarMicro: wallet.zarMicro, sngmMicro: wallet.sngmMicro };
  } catch {
    return null;
  }
}
