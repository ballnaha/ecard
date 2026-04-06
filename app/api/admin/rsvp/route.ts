import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    const where = slug ? { 
      client: { 
        slug: slug 
      } 
    } : {};

    const rsvps = await prisma.rSVP.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: {
          select: {
            brideName: true,
            groomName: true,
            slug: true,
          }
        }
      }
    });

    return NextResponse.json(rsvps);
  } catch (error: any) {
    console.error('Admin RSVP list error:', error);
    return NextResponse.json({ error: 'Failed to fetch RSVP list' }, { status: 500 });
  }
}
