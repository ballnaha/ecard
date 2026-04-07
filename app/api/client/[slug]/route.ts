import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const client = await prisma.client.findUnique({
      where: { slug },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Map DB fields → frontend-friendly shape
    const heroSection = (client.heroSection as any) || {};
    const hero = {
      groomName: client.groomName,
      brideName: client.brideName,
      eventDate: dayjs(client.eventDate).format('DD . MM . YY'),
      locationText: heroSection.locationText || '',
      mediaType: heroSection.mediaType || 'video',
      heroStyle: heroSection.heroStyle || 'classic',
      heroNameImage: heroSection.heroNameImage || '',
      showFallingPetals: !!heroSection.showFallingPetals,
      heroVideo: heroSection.heroVideo || '',
      heroImage: heroSection.heroImage || '',
      heroPoster: heroSection.heroPoster || '',
      heroBackgroundColor: heroSection.heroBackgroundColor || '#ffffff',
    };

    const data = {
      id: client.id,
      slug: client.slug,
      brideName: client.brideName,
      groomName: client.groomName,
      eventDate: client.eventDate,
      primaryColor: client.primaryColor,
      secondaryColor: client.secondaryColor,
      fontFamily: client.fontFamily,
      layoutOrder: client.layoutOrder || null,
      hero,
      coupleSection: (client.coupleSection as any) || { 
        introText: 'Two paths that led to one beautiful journey...', 
        bridePic: '', 
        groomPic: '', 
        coupleStyle: 'arch-duo' 
      },
      scheduleSection: client.scheduleSection || null,
      locationSection: client.locationSection || null,
      galleryImages: client.galleryImages || null,
      countdownSection: client.countdownSection || null,
      dressCodeSection: client.dressCodeSection || null,
      giftSection: client.giftSection || null,
      mobileNavSection: client.mobileNavSection || null,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Client fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
