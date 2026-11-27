/**
 * Signed session cookies for the sandbox.
 *
 * The cookie is http-only and carries an HMAC-SHA256 signed payload. There is
 * deliberately ONE way to mint a session — `createSession(identity)` — and it
 * takes a provider-agnostic identity record:
 *
 *   { provider: 'password', subject: <user id>, email, displayName }
 *   { provider: 'sso',      subject: <idp subject>, email, displayName }
 *
 * An SSO callback later only has to resolve/attach the account
 * (see `getOrCreateUserFromIdentity` in accounts.ts) and call createSession
 * with provider 'sso'. Nothing in the wallet or page code changes.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_SECRET_FILE,
  SESSION_TTL_SECONDS,
} from './config';

export type IdentityProvider = 'password' | 'sso';

export interface Identity {
  provider: IdentityProvider;
  /** Stable subject: our user id for password accounts, the IdP subject for SSO. */
  subject: string;
  email: string;
  displayName: string;
}

export interface SessionPayload extends Identity {
  iat: number;
  exp: number;
}

let cachedSecret: Buffer | null = null;

function secret(): Buffer {
  if (cachedSecret) return cachedSecret;
  const fromEnv = process.env.SANDBOX_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) {
    cachedSecret = Buffer.from(fromEnv, 'utf8');
    return cachedSecret;
  }
  try {
    if (fs.existsSync(SESSION_SECRET_FILE)) {
      const existing = fs.readFileSync(SESSION_SECRET_FILE, 'utf8').trim();
      if (existing.length >= 32) {
        cachedSecret = Buffer.from(existing, 'hex');
        return cachedSecret;
      }
    }
  } catch {
    // fall through and create
  }
  const fresh = randomBytes(32);
  fs.mkdirSync(path.dirname(SESSION_SECRET_FILE), { recursive: true });
  fs.writeFileSync(SESSION_SECRET_FILE, fresh.toString('hex'), { mode: 0o600 });
  cachedSecret = fresh;
  return cachedSecret;
}

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf).toString('base64url');

function sign(payloadB64: string): string {
  return createHmac('sha256', secret()).update(payloadB64).digest('base64url');
}

export function encodeSession(identity: Identity): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...identity,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.subject || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Mint a session cookie. This is the single entry point for any provider. */
export async function createSession(identity: Identity): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(identity), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
    // The public origin is HTTPS (TLS terminates at the proxy in front of
    // this app), so the cookie never travels in clear text to a browser.
    secure: false,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

/** Current session, or null. Never throws. */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const jar = await cookies();
    return decodeSession(jar.get(SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}
