import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { clientId, fileType, filePath } = await req.json();

    if (!clientId || !fileType || !filePath) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Security: only allow deleting from /uploads/{clientId}/
    if (!filePath.startsWith(`/uploads/${clientId}/`)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    // Delete file from disk
    const absolutePath = path.join(process.cwd(), 'public', filePath);
    try {
      await unlink(absolutePath);
    } catch (e) {
      // File might already be deleted, continue to clean DB
      console.warn('File not found on disk:', absolutePath);
    }

    // Remove path from DB
    const existing = await prisma.client.findUnique({ where: { id: clientId } });
    if (existing) {
      // 1. Remove from heroSection if applicable
      const heroSection = typeof existing.heroSection === 'object' && existing.heroSection !== null
        ? existing.heroSection as any
        : {};

      if (['heroImage', 'heroVideo', 'heroPoster', 'heroNameImage'].includes(fileType)) {
        if (fileType === 'heroImage') delete heroSection.heroImage;
        if (fileType === 'heroVideo') delete heroSection.heroVideo;
        if (fileType === 'heroPoster') delete heroSection.heroPoster;
        if (fileType === 'heroNameImage') delete heroSection.heroNameImage;
      }

      // 2. Remove from coupleSection if applicable
      const coupleSection = typeof existing.coupleSection === 'object' && existing.coupleSection !== null
        ? existing.coupleSection as any
        : {};

      if (['bridePic', 'groomPic'].includes(fileType)) {
        if (fileType === 'bridePic') delete coupleSection.bridePic;
        if (fileType === 'groomPic') delete coupleSection.groomPic;
      }

      await prisma.client.update({
        where: { id: clientId },
        data: { heroSection, coupleSection }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 });
  }
}
