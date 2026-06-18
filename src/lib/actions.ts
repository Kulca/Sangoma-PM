'use server'

import { revalidatePath } from 'next/cache'
import { updateUserProfile } from './user'
import { thisIsMe } from './this-is-me'

export async function buyToken(marketId: string, tokenId: string, quantity: number, price: number) {
  console.log(`Buying ${quantity} tokens of ${tokenId} in market ${marketId} at ${price} SNGM each`);
  await new Promise(resolve => setTimeout(resolve, 800));
  revalidatePath('/');
  return { success: true, message: 'Trade executed successfully!' };
}

export async function verifyKycTier(tier: 1 | 2, address: string, data: any) {
  console.log(`Verifying KYC Tier ${tier} for ${address} with data:`, data);
  
  let result;
  if (tier === 1) {
    result = await thisIsMe.verifyTier1(data.firstName, data.lastName, data.idNumber);
  } else {
    result = await thisIsMe.verifyTier2(data.idNumber);
  }

  if (result.success) {
    await updateUserProfile(address, {
      kyc_status: tier === 2 ? 'verified' : 'pending', // Tier 1 is "pending" full verification but allows some trading
      kyc_tier: tier,
      identity_verified: true,
      liveness_verified: tier === 2 ? true : false,
      document_verified: tier === 2 ? true : false,
    });
  }
  
  revalidatePath('/verification');
  revalidatePath('/portfolio');
  revalidatePath('/');
  
  return { 
    success: result.success, 
    tier,
    message: result.success ? `Tier ${tier} verification successful!` : 'Verification failed'
  };
}

export async function resolveMarket(marketId: string, winningTokenId: string) {
  console.log(`Resolving market ${marketId} with winning outcome ${winningTokenId}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true, message: `Market ${marketId} resolved successfully.` };
}
