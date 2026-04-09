import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, name, phone, attending, guestCount, note } = body;

    if (!clientId || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isAttending = attending === 'yes';
    const finalGuestCount = isAttending ? (parseInt(guestCount) || 1) : 0;

    // Check for existing RSVP by phone for this specific client
    const existingRsvp = await prisma.rSVP.findFirst({
      where: {
        clientId,
        phone,
      },
    });

    if (existingRsvp) {
      // Update existing RSVP instead of rejecting
      const updatedRsvp = await prisma.rSVP.update({
        where: { id: existingRsvp.id },
        data: {
          name,
          attending: isAttending,
          guestCount: finalGuestCount,
          dietary: note,
        },
      });

      return NextResponse.json({ ...updatedRsvp, updated: true }, { status: 200 });
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        clientId,
        name,
        phone,
        attending: isAttending,
        guestCount: finalGuestCount,
        dietary: note,
      },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error: any) {
    console.error('RSVP submission error:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
