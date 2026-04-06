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
        layoutOrder: ['hero', 'countdown', 'couple', 'gallery', 'location', 'rsvp']
      }
    });

    return NextResponse.json(newClient);
  } catch (error: any) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
