import { NextRequest, NextResponse } from 'next/server';
import { handleStitchWebhook } from '@/lib/fica-stitch';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const signature = req.headers.get('svix-signature') || '';

  try {
    const result = await handleStitchWebhook(payload, signature);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
