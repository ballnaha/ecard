import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brideName, groomName, slug, eventDate } = body;

    if (!brideName || !groomName || !slug || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.client.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists. กรุณาใช้ชื่ออื่น' }, { status: 400 });
    }

    // Create client
    const newClient = await prisma.client.create({
      data: {
        brideName,
        groomName,
        slug: slug.toLowerCase(),
        eventDate: new Date(eventDate),
        primaryColor: '#615b56', // Default theme color
        layoutOrder: [
          { id: "hero", isActive: true },
          { id: "couple", isActive: true },
          { id: "schedule", isActive: true },
          { id: "dressCode", isActive: true },
          { id: "countdown", isActive: true },
          { id: "gallery", isActive: true },
          { id: "location", isActive: true },
          { id: "rsvp", isActive: true },
          { id: "gift", isActive: true },
          { id: "guestbook", isActive: true },
          { id: "poweredBy", isActive: true },
          { id: "mobileNav", isActive: true }
        ]
      }
    });

    return NextResponse.json(newClient);
  } catch (error: any) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
