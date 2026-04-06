import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        eventDate: 'desc',
      },
      include: {
        _count: {
          select: { rsvps: true }
        }
      }
    });

    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Admin Client list error:', error);
    return NextResponse.json({ error: 'Failed to fetch client list' }, { status: 500 });
  }
}
