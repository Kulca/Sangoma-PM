import { NextRequest, NextResponse } from 'next/server';
import { query, insertProposal } from '@/lib/db';

export async function GET() {
  try {
    const proposals = query('SELECT * FROM market_proposals ORDER BY created_at DESC LIMIT 5');
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, category, description, user_id } = await req.json();

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'A valid market title is required' }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'A valid description is required' }, { status: 400 });
    }
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'A valid category is required' }, { status: 400 });
    }

    // Validate title length
    if (title.length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or fewer' }, { status: 400 });
    }

    const id = `prop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const userId = user_id || 'u1';

    const success = insertProposal(id, userId, title.trim(), description.trim(), category.trim());

    if (success) {
      return NextResponse.json({ id, title: title.trim(), category: category.trim(), description: description.trim(), status: 'pending' }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving proposal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
