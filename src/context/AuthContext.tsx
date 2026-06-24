'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrCreateSessionKey } from '@/lib/safe-service';
import { getSafeAuthPack } from '@/lib/safe-auth';
import type { SafeAuthPack } from '@safe-global/auth-kit';
import { ethers, BrowserProvider } from 'ethers';

interface AuthContextType {
  userAddress: string | null;
  safeAddress: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  signer: ethers.Signer | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authPack, setAuthPack] = useState<SafeAuthPack | null>(null);

  const updateSigner = async (pack: SafeAuthPack) => {
    const provider = pack.getProvider();
    if (provider) {
      const browserProvider = new BrowserProvider(provider as any);
      const ethersSigner = await browserProvider.getSigner();
      setSigner(ethersSigner);
      const address = await ethersSigner.getAddress();
      setUserAddress(address);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const pack = await getSafeAuthPack();
        setAuthPack(pack);
        
        // Check if already logged in (some providers persist session)
        // Note: SafeAuthPack might not have an easy 'check if authenticated' without triggering something
        // but we can try to get provider
        if (pack.getProvider()) {
          await updateSigner(pack);
        }
      } catch (error) {
        console.log('Auth initialization skipped or failed:', error);
        // Fallback to local session key for Alpha demo if Web3Auth fails
        const sessionKey = getOrCreateSessionKey();
        if (sessionKey) {
          setUserAddress(sessionKey.address);
          setSigner(sessionKey);
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!authPack) return;
    setIsLoading(true);
    try {
      const authBundle = await authPack.signIn();
      if (authBundle?.eoa) {
        await updateSigner(authPack);
        setSafeAddress(authBundle.safes?.[0] || null);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback
      const sessionKey = getOrCreateSessionKey();
      if (sessionKey) {
        setUserAddress(sessionKey.address);
        setSigner(sessionKey);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (authPack) await authPack.signOut({ reset: true });
    localStorage.removeItem('sangoma_session_key');
    setUserAddress(null);
    setSafeAddress(null);
    setSigner(null);
  };

  return (
    <AuthContext.Provider value={{ userAddress, safeAddress, login, logout, isLoading, signer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
