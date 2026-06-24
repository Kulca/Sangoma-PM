/**
 * ThisIsMe API Client (Mock for Alpha/Sandbox)
 */

export interface ThisIsMeVerificationResult {
  success: boolean;
  tier: number;
  provider_reference: string;
  data?: any;
}

export const thisIsMe = {
  /**
   * Tier 1: Instant Identity Verification
   * Checks SA ID number against DHA via ThisIsMe API.
   */
  verifyTier1: async (firstName: string, lastName: string, idNumber: string): Promise<ThisIsMeVerificationResult> => {
    console.log(`[ThisIsMe] Verifying Tier 1 for ${firstName} ${lastName} (${idNumber})`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic validation for demo purposes
    if (idNumber.length !== 13) {
      return { success: false, tier: 1, provider_reference: 'err_invalid_id' };
    }

    return {
      success: true,
      tier: 1,
      provider_reference: 'tim_t1_' + Math.random().toString(36).substr(2, 9),
      data: {
        match_status: 'match',
        dha_status: 'alive'
      }
    };
  },

  /**
   * Tier 2: Biometric & Document Verification
   * Typically uses the ThisIsMe embedded widget.
   */
  verifyTier2: async (idNumber: string): Promise<ThisIsMeVerificationResult> => {
    console.log(`[ThisIsMe] Verifying Tier 2 for ID ${idNumber}`);
    
    // Simulate Liveness & Doc check delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      tier: 2,
      provider_reference: 'tim_t2_' + Math.random().toString(36).substr(2, 9),
      data: {
        liveness_score: 0.99,
        document_authentic: true
      }
    };
  }
};
