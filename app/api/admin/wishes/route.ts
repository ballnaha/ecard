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

    const wishes = await prisma.wish.findMany({
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

    return NextResponse.json(wishes);
  } catch (error: any) {
    console.error('Admin Wishes list error:', error);
    return NextResponse.json({ error: 'Failed to fetch Wishes list' }, { status: 500 });
  }
}
