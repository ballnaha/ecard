import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

type ZipEntry = {
  name: string;
  data: Buffer;
  date: Date;
};

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toDosDateTime(date: Date) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosDate, dosTime };
}

function sanitizeName(value: string) {
  return (value || 'guest')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'guest';
}

function buildZip(entries: ZipEntry[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const fileName = Buffer.from(entry.name, 'utf8');
    const crc = crc32(entry.data);
    const { dosDate, dosTime } = toDosDateTime(entry.date);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(entry.data.length, 18);
    localHeader.writeUInt32LE(entry.data.length, 22);
    localHeader.writeUInt16LE(fileName.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, fileName, entry.data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(entry.data.length, 20);
    centralHeader.writeUInt32LE(entry.data.length, 24);
    centralHeader.writeUInt16LE(fileName.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, fileName);

    offset += localHeader.length + fileName.length + entry.data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0);
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(entries.length, 8);
  endRecord.writeUInt16LE(entries.length, 10);
  endRecord.writeUInt32LE(centralDirectory.length, 12);
  endRecord.writeUInt32LE(offset, 16);
  endRecord.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

function mediaUrlToFilePath(mediaUrl: string) {
  if (!mediaUrl.startsWith('/api/media/')) return null;

  const relativePath = decodeURIComponent(mediaUrl.replace('/api/media/', ''));
  const uploadsRoot = path.resolve(process.cwd(), 'public', 'uploads');
  const resolvedPath = path.resolve(uploadsRoot, relativePath);
  if (!resolvedPath.startsWith(uploadsRoot)) return null;
  return resolvedPath;
}

function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;
  const ext = match[1].replace('jpeg', 'jpg');
  return { buffer: Buffer.from(match[2], 'base64'), ext };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        wishes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const entries: ZipEntry[] = [];

    for (const [wishIndex, wish] of client.wishes.entries()) {
      const guestName = sanitizeName(wish.name);
      const prefix = `${String(wishIndex + 1).padStart(3, '0')}-${guestName}`;
      const createdAt = new Date(wish.createdAt);

      if (wish.drawing) {
        if (wish.drawing.startsWith('/api/media/')) {
          const filePath = mediaUrlToFilePath(wish.drawing);
          if (filePath) {
            const data = await fs.readFile(filePath);
            const ext = path.extname(filePath) || '.png';
            entries.push({ name: `${prefix}-drawing${ext}`, data, date: createdAt });
          }
        } else if (wish.drawing.startsWith('data:image')) {
          const parsed = dataUrlToBuffer(wish.drawing);
          if (parsed) {
            entries.push({ name: `${prefix}-drawing.${parsed.ext}`, data: parsed.buffer, date: createdAt });
          }
        }
      }

      const images = Array.isArray(wish.images) ? wish.images as string[] : [];
      for (const [imageIndex, imageUrl] of images.entries()) {
        const filePath = mediaUrlToFilePath(imageUrl);
        if (!filePath) continue;

        try {
          const data = await fs.readFile(filePath);
          const ext = path.extname(filePath) || '.jpg';
          entries.push({
            name: `${prefix}-photo-${String(imageIndex + 1).padStart(2, '0')}${ext}`,
            data,
            date: createdAt,
          });
        } catch {
          // Skip missing files so one bad upload does not block the whole ZIP.
        }
      }
    }

    if (!entries.length) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const zip = buildZip(entries);
    const ownerName = sanitizeName(`${client.brideName}-${client.groomName}`);

    return new NextResponse(zip, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="Guestbook-Photos-${ownerName}.zip"`,
        'Content-Length': zip.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    console.error('Guestbook photos ZIP error:', error);
    return NextResponse.json({ error: 'Failed to create photos ZIP' }, { status: 500 });
  }
}
