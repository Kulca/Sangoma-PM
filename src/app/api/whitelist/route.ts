import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REGISTRATIONS_FILE = '/home/team/shared/pioneer_registrations.json';

export async function POST(req: NextRequest) {
  try {
    const { address, handle, name } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    let registrations = [];
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const fileContent = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
      registrations = JSON.parse(fileContent);
    }

    // Check if already registered
    if (registrations.find((r: any) => r.address.toLowerCase() === address.toLowerCase())) {
      return NextResponse.json({ message: 'Already registered' }, { status: 200 });
    }

    registrations.push({
      address,
      handle,
      name,
      registeredAt: new Date().toISOString(),
      status: 'pending_fica'
    });

    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));

    return NextResponse.json({ message: 'Registered successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Whitelist registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const fileContent = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
      return NextResponse.json(JSON.parse(fileContent));
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
