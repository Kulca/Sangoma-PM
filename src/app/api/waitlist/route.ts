import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const WAITLIST_FILE = '/home/team/shared/waitlist_registrations.json';

export async function POST(req: NextRequest) {
  try {
    const { name, email, wallet_address } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    let registrations: any[] = [];
    if (fs.existsSync(WAITLIST_FILE)) {
      const content = fs.readFileSync(WAITLIST_FILE, 'utf8');
      registrations = content ? JSON.parse(content) : [];
    }

    // Check if email already registered
    if (registrations.some((r: any) => r.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ message: 'Already on the waitlist!' }, { status: 200 });
    }

    registrations.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      wallet_address: wallet_address?.trim() || null,
      registered_at: new Date().toISOString(),
      status: 'waiting',
      source: 'web_waitlist'
    });

    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(registrations, null, 2));
    console.log(`Waitlist: ${name} <${email}> registered`);

    return NextResponse.json({ message: 'You\'re on the list! We\'ll be in touch.', count: registrations.length }, { status: 201 });
  } catch (error: any) {
    console.error('Waitlist registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      const content = fs.readFileSync(WAITLIST_FILE, 'utf8');
      const registrations = content ? JSON.parse(content) : [];
      return NextResponse.json({ count: registrations.length, registrations });
    }
    return NextResponse.json({ count: 0, registrations: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}