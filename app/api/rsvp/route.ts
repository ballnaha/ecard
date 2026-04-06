import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, name, phone, attending, guestCount, note } = body;

    if (!clientId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        clientId,
        name,
        phone,
        attending: attending === 'yes',
        guestCount: parseInt(guestCount) || 1,
        dietary: note, // We map note to dietary field in DB
      },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error: any) {
    console.error('RSVP submission error:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
