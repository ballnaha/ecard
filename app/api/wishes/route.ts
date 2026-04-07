import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const clientId = formData.get('clientId') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    const drawing = formData.get('drawing') as string; // Base64
    const files = formData.getAll('images') as File[];

    if (!clientId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', clientId, 'wishes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls: string[] = [];
    
    // Save uploaded images
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || '.jpg';
      const fileName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imageUrls.push(`/uploads/${clientId}/wishes/${fileName}`);
    }

    // Save drawing (if it's a large base64, we might want to save it as a file)
    let savedDrawingPath = '';
    if (drawing && drawing.startsWith('data:image')) {
      const base64Data = drawing.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `drawing_${crypto.randomUUID()}.png`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      savedDrawingPath = `/uploads/${clientId}/wishes/${fileName}`;
    }

    const wish = await prisma.wish.create({
      data: {
        clientId,
        name,
        message,
        drawing: savedDrawingPath || drawing,
        images: imageUrls,
      } as any, // Cast to any to avoid TypeScript errors if Prisma hasn't regenerated
    });

    return NextResponse.json({ success: true, wish });
  } catch (error: any) {
    console.error('Wish submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
