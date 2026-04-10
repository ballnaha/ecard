import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const fileType = formData.get('fileType') as string; 

    if (!file || !clientId || !fileType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    // Validate file size
    const maxSize = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024; // Incr. limit for better handling
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `ไฟล์ใหญ่เกินไป (สูงสุด ${isVideo ? '100MB' : '20MB'})` 
      }, { status: 400 });
    }

    // Create directory: public/uploads/{clientId}/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', clientId);
    console.log('[Upload Debug] Base Dir:', process.cwd());
    console.log('[Upload Debug] Target Dir:', uploadDir);

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err: any) {
      console.error('[Upload Debug] MKDIR Error:', err);
      return NextResponse.json({ error: 'System cannot create directory: ' + err.message }, { status: 500 });
    }

    // Delete old files with same fileType prefix — but NOT for gallery (allows multiple files)
    if (fileType !== 'gallery') {
      try {
        const existingFiles = await readdir(uploadDir);
        const oldFiles = existingFiles.filter(f => f.startsWith(`${fileType}_`));
        await Promise.all(
          oldFiles.map(f => unlink(path.join(uploadDir, f)).catch(() => {}))
        );
      } catch {
        // Directory may be empty or not exist yet — safe to ignore
      }
    }

    // Generate filename
    const timestamp = Date.now();
    let fileName = '';
    let finalBuffer: Buffer;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isImage) {
      // 🚀 PROCESS IMAGE: Resize & Convert to WebP
      fileName = `${fileType}_${timestamp}.webp`;
      try {
        finalBuffer = await sharp(buffer)
          .resize({ width: 2000, withoutEnlargement: true }) // Max width 2000px
          .webp({ quality: 85 }) // High quality webp
          .toBuffer();
      } catch (sharpErr: any) {
        console.error('[Upload Debug] Sharp Processing Error:', sharpErr);
        // Fallback to original buffer if sharp fails on VPS
        const ext = path.extname(file.name) || '.jpg';
        fileName = `${fileType}_${timestamp}${ext}`;
        finalBuffer = buffer;
      }
    } else {
      // NOT AN IMAGE (Video or others)
      const ext = path.extname(file.name) || (isVideo ? '.mp4' : '');
      fileName = `${fileType}_${timestamp}${ext}`;
      finalBuffer = buffer;
    }

    const filePath = path.join(uploadDir, fileName);
    console.log('[Upload Debug] Writing to:', filePath);
    
    try {
      await writeFile(filePath, finalBuffer);
      console.log('[Upload Debug] Success!');
    } catch (writeErr: any) {
      console.error('[Upload Debug] WriteFile Error:', writeErr);
      return NextResponse.json({ error: 'System cannot write file: ' + writeErr.message }, { status: 500 });
    }

    // Return the public URL path via the media proxy API for VPS stability
    const publicUrl = `/api/media/${clientId}/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileType,
      fileName 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
