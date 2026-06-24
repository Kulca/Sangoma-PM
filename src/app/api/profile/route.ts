import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/lib/user';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  const profile = await getUserProfile(address);
  if (!profile) {
    // Return a default profile if not found
    const defaultProfile = await updateUserProfile(address, {});
    return NextResponse.json(defaultProfile);
  }

  return NextResponse.json(profile);
}
