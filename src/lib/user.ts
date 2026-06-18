import fs from 'fs';
import path from 'path';
import { Profile } from './types';

const PROFILES_FILE = '/home/team/shared/user_profiles.json';
const REGISTRATIONS_FILE = '/home/team/shared/pioneer_registrations.json';

export async function getUserProfile(address: string): Promise<Profile | null> {
  try {
    let profiles: Record<string, Profile> = {};
    if (fs.existsSync(PROFILES_FILE)) {
      profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
    }
    
    const lowerAddress = address.toLowerCase();
    let profile = profiles[lowerAddress] || null;

    // Check if user is registered as a pioneer
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, 'utf8'));
      const registration = registrations.find((r: any) => r.address.toLowerCase() === lowerAddress);
      if (registration) {
        if (!profile) {
          profile = {
            id: lowerAddress,
            username: registration.handle || `user_${lowerAddress.slice(2, 8)}`,
            email: `${lowerAddress.slice(2, 8)}@example.com`,
            balance_sngm: 1000,
            kyc_status: 'none',
            kyc_tier: 0
          };
        }
        // Add pioneer info to profile if needed
      }
    }

    return profile;
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
}

export async function updateUserProfile(address: string, updates: Partial<Profile>): Promise<Profile> {
  let profiles: Record<string, Profile> = {};
  if (fs.existsSync(PROFILES_FILE)) {
    profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
  }

  const lowerAddress = address.toLowerCase();
  let existing = profiles[lowerAddress];

  if (!existing) {
    // Try to get info from registration
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, 'utf8'));
      const registration = registrations.find((r: any) => r.address.toLowerCase() === lowerAddress);
      if (registration) {
        existing = {
          id: lowerAddress,
          username: registration.handle || `user_${lowerAddress.slice(2, 8)}`,
          email: `${lowerAddress.slice(2, 8)}@example.com`,
          balance_sngm: 1000,
          kyc_status: 'none',
          kyc_tier: 0
        };
      }
    }
  }

  if (!existing) {
    existing = {
      id: lowerAddress,
      username: `user_${lowerAddress.slice(2, 8)}`,
      email: `${lowerAddress.slice(2, 8)}@example.com`,
      balance_sngm: 1000,
      kyc_status: 'none',
      kyc_tier: 0
    };
  }

  const updated = { ...existing, ...updates };
  profiles[lowerAddress] = updated;

  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
  return updated;
}
