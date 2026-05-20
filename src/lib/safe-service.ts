import { ethers } from 'ethers';

// EIP-712 Domain for SangomaExchange
// Note: name and version must match what's in the contract constructor
export const SANGOMA_DOMAIN = {
  name: 'Sangoma Matching Engine',
  version: '1.0',
  chainId: 80002, // Polygon Amoy
  verifyingContract: '0x0B306BF915C4d645ff596e518fAf3F9669b97016', // Placeholder - update after deployment
};

export const ORDER_TYPES = {
  Order: [
    { name: 'maker', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'price', type: 'uint256' },
    { name: 'amount', type: 'uint256' },
    { name: 'side', type: 'uint8' },
    { name: 'salt', type: 'bytes32' },
    { name: 'expiration', type: 'uint256' },
  ],
};

export interface Order {
  maker: string;
  token: string;
  price: string; // uint256 as string
  amount: string; // uint256 as string
  side: number; // 0 for Buy, 1 for Sell
  salt: string;
  expiration: number;
}

/**
 * Signs an order using the provided signer (could be a regular EOA or a Session Key).
 */
export async function signOrder(signer: ethers.Signer, order: Order) {
  // Use _signTypedData for EIP-712
  // Note: For ethers v6, use signer.signTypedData
  if ('signTypedData' in signer) {
    // @ts-ignore
    return await signer.signTypedData(SANGOMA_DOMAIN, ORDER_TYPES, order);
  } else {
    // Fallback for older versions or specific providers
    // @ts-ignore
    return await signer._signTypedData(SANGOMA_DOMAIN, ORDER_TYPES, order);
  }
}

/**
 * Generates or retrieves an ephemeral session key from local storage.
 */
export function getOrCreateSessionKey() {
  if (typeof window === 'undefined') return null;

  const storedKey = localStorage.getItem('sangoma_session_key');
  if (storedKey) {
    return new ethers.Wallet(storedKey);
  }

  const newWallet = ethers.Wallet.createRandom();
  localStorage.setItem('sangoma_session_key', newWallet.privateKey);
  return newWallet;
}
