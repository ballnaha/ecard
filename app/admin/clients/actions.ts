'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { rm } from 'fs/promises';
import path from 'path';

export async function createClient(formData: FormData) {
  const slug = formData.get('slug') as string;
  const groomName = formData.get('groomName') as string;
  const brideName = formData.get('brideName') as string;
  const eventDateStr = formData.get('eventDate') as string;

  try {
    const existing = await prisma.client.findUnique({ where: { slug } });
    if (existing) return { error: 'Slug ลิงก์นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น' };

    const newClient = await prisma.client.create({
      data: {
        slug,
        groomName,
        brideName,
        eventDate: new Date(eventDateStr),
        // LayoutOrder default (Template เริ่มต้น)
        layoutOrder: [
          "hero", "couple", "schedule", "gallery", "countdown", "colorTheme", "gift", "rsvp", "location", "poweredBy", "mobileNav"
        ]
      }
    });

    revalidatePath('/admin/clients');
    return { success: true, client: newClient };
  } catch(e: any) {
    return { error: 'มีข้อผิดพลาด: ' + e.message };
  }
}

export async function deleteClient(id: string) {
  try {
    // ลบโฟลเดอร์ไฟล์อัปโหลดของลูกค้า (รูปภาพ/วิดีโอ)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', id);
    try {
      await rm(uploadDir, { recursive: true, force: true });
    } catch {
      // โฟลเดอร์อาจไม่มีอยู่ ไม่เป็นไร
    }

    await prisma.client.delete({ where: { id } });
    revalidatePath('/admin/clients');
    return { success: true };
  } catch(e: any) {
    return { error: 'มีข้อผิดพลาดระบบ: ' + e.message };
  }
}

export async function updateClientLayout(id: string, layoutOrder: string[]) {
  try {
    await prisma.client.update({
      where: { id },
      data: { layoutOrder }
    });
    revalidatePath(`/admin/builder`);
    revalidatePath(`/admin/clients`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch(e: any) {
    return { error: 'อัปเดตไม่สำเร็จ: ' + e.message };
  }
}

export async function updateClientHero(id: string, formData: FormData) {
  try {
    const groomName = formData.get('groomName') as string;
    const brideName = formData.get('brideName') as string;
    const eventDate = formData.get('eventDate') as string;
    const locationText = formData.get('locationText') as string;
    const mediaType = formData.get('mediaType') as string;
    const heroStyle = formData.get('heroStyle') as string;
    const heroImage = formData.get('heroImage') as string;
    const heroVideo = formData.get('heroVideo') as string;
    const heroPoster = formData.get('heroPoster') as string;
    const heroNameImage = formData.get('heroNameImage') as string;
    const heroBackgroundColor = formData.get('heroBackgroundColor') as string;
    const showFallingPetals = formData.get('showFallingPetals') === 'true';
    
    // Check if client exists
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบลูกค้ารายนี้' };

    // Update the heroSection JSON properly
    const heroSection = typeof existing.heroSection === 'object' && existing.heroSection !== null 
      ? existing.heroSection as any 
      : {};

    heroSection.mediaType = mediaType;
    heroSection.heroStyle = heroStyle;
    heroSection.locationText = locationText;
    if (heroImage) heroSection.heroImage = heroImage;
    if (heroVideo) heroSection.heroVideo = heroVideo;
    if (heroPoster) heroSection.heroPoster = heroPoster;
    if (heroNameImage) heroSection.heroNameImage = heroNameImage;
    heroSection.heroBackgroundColor = heroBackgroundColor;
    heroSection.showFallingPetals = showFallingPetals;
    
    await prisma.client.update({
      where: { id },
      data: {
        groomName,
        brideName,
        eventDate: eventDate ? new Date(eventDate) : existing.eventDate,
        heroSection
      }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch(e: any) {
    return { error: 'บันทึกข้อมูลหน้าปกไม่สำเร็จ: ' + e.message };
  }
}

export async function updateClientTheme(id: string, formData: FormData) {
  try {
    const primaryColor = formData.get('primaryColor') as string;
    const secondaryColor = formData.get('secondaryColor') as string;
    const fontFamily = formData.get('fontFamily') as string;
    
    await prisma.client.update({
      where: { id },
      data: {
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        fontFamily: fontFamily || undefined,
      }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch(e: any) {
    return { error: 'บันทึกธีมไม่สำเร็จ: ' + e.message };
  }
}

export async function updateClientCouple(id: string, formData: FormData) {
  try {
    const bridePic = formData.get('bridePic') as string;
    const groomPic = formData.get('groomPic') as string;
    const introText = formData.get('introText') as string;
    const coupleStyle = formData.get('coupleStyle') as string;
    const brideName = formData.get('brideName') as string;
    const groomName = formData.get('groomName') as string;
    const brideFather = formData.get('brideFather') as string;
    const brideMother = formData.get('brideMother') as string;
    const groomFather = formData.get('groomFather') as string;
    const groomMother = formData.get('groomMother') as string;
    
    // Check if client exists
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบลูกค้ารายนี้' };

    const coupleSection = typeof existing.coupleSection === 'object' && existing.coupleSection !== null 
      ? existing.coupleSection as any 
      : {};

    const oldBridePic = coupleSection.bridePic;
    const oldGroomPic = coupleSection.groomPic;

    // Handle Bride Pic Cleanup
    if (bridePic && bridePic !== oldBridePic) {
      if (oldBridePic && oldBridePic.startsWith('/uploads/') && !oldBridePic.includes('demo')) {
        try {
          const fullPath = path.join(process.cwd(), 'public', oldBridePic);
          await rm(fullPath);
        } catch (err) {
          console.error('Failed to delete old bride pic:', err);
        }
      }
      coupleSection.bridePic = bridePic;
    }

    // Handle Groom Pic Cleanup
    if (groomPic && groomPic !== oldGroomPic) {
      if (oldGroomPic && oldGroomPic.startsWith('/uploads/') && !oldGroomPic.includes('demo')) {
        try {
          const fullPath = path.join(process.cwd(), 'public', oldGroomPic);
          await rm(fullPath);
        } catch (err) {
          console.error('Failed to delete old groom pic:', err);
        }
      }
      coupleSection.groomPic = groomPic;
    }

    coupleSection.introText = introText;
    coupleSection.coupleStyle = coupleStyle || 'arch-duo';
    coupleSection.brideName = brideName;
    coupleSection.groomName = groomName;
    coupleSection.brideFather = brideFather;
    coupleSection.brideMother = brideMother;
    coupleSection.groomFather = groomFather;
    coupleSection.groomMother = groomMother;
    
    await prisma.client.update({
      where: { id },
      data: { coupleSection }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch(e: any) {
    return { error: 'บันทึกข้อมูลแนะนำบ่าวสาวไม่สำเร็จ: ' + e.message };
  }
}

export async function updateClientGallery(id: string, images: string[], layout?: string) {
  try {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบข้อมูลลูกค้า' };

    // Get old list for cleanup
    let oldImages: string[] = [];
    if (existing.galleryImages) {
      if (Array.isArray(existing.galleryImages)) {
        oldImages = existing.galleryImages as string[];
      } else if (typeof existing.galleryImages === 'object') {
        oldImages = (existing.galleryImages as any).items || [];
      }
    }

    // Cleanup files that are NOT in the new list
    const toDelete = oldImages.filter(img => 
      !images.includes(img) && 
      img.startsWith('/uploads/') && 
      !img.includes('demo')
    );

    for (const imgPath of toDelete) {
      try {
        const fullPath = path.join(process.cwd(), 'public', imgPath);
        await rm(fullPath);
      } catch (err) {
        console.error('Failed to delete gallery image:', imgPath, err);
      }
    }

    // Save as structured JSON
    const data = {
      items: images,
      layout: layout || 'masonry'
    };

    await prisma.client.update({
      where: { id },
      data: { galleryImages: data }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch (e: any) {
    return { error: 'บันทึกแกลเลอรีล้มเหลว: ' + e.message };
  }
}

export async function updateClientCountdown(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const style = formData.get('style') as string;

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบข้อมูลลูกค้า' };

    const data = {
      title: title || 'นับถอยหลังสู่ช่วงเวลาแสนหวาน',
      subtitle: subtitle || 'See You Soon',
      style: style || 'classic'
    };

    await prisma.client.update({
      where: { id },
      data: { 
        countdownSection: data 
      }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch (e: any) {
    return { error: 'บันทึกส่วนนับถอยหลังล้มเหลว: ' + e.message };
  }
}

export async function updateClientSchedule(id: string, schedules: any[]) {
  try {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบข้อมูลลูกค้า' };

    await prisma.client.update({
      where: { id },
      data: { scheduleSection: schedules }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch (e: any) {
    return { error: 'บันทึกตารางพิธีการล้มเหลว: ' + e.message };
  }
}

export async function updateClientDressCode(id: string, title: string, subtitle: string, colors: string[]) {
  try {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบข้อมูลลูกค้า' };

    await prisma.client.update({
      where: { id },
      data: {
        dressCodeSection: {
          title: title || 'DRESS CODE',
          subtitle: subtitle || 'WE WOULD LOVE TO SEE YOU IN OUR WEDDING THEME',
          colors
        }
      }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch (e: any) {
    return { error: 'บันทึกธีมการแต่งกายล้มเหลว: ' + e.message };
  }
}

export async function updateClientLocation(id: string, formData: FormData) {
  try {
    const venueName = formData.get('venueName') as string;
    const venueAddress = formData.get('venueAddress') as string;
    const googleMapExternal = formData.get('googleMapExternal') as string;
    const googleMapEmbed = formData.get('googleMapEmbed') as string;

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบข้อมูลลูกค้า' };

    await prisma.client.update({
      where: { id },
      data: {
        locationSection: {
          venueName,
          venueAddress,
          googleMapExternal,
          googleMapEmbed
        }
      }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch (e: any) {
    return { error: 'บันทึกสถานที่จัดงานล้มเหลว: ' + e.message };
  }
}

export async function updateClientGift(id: string, formData: FormData) {
  try {
    const title = formData.get('giftTitle') as string;
    const subtitle = formData.get('giftSubtitle') as string;
    const message = formData.get('giftMessage') as string;
    const bankName = formData.get('bankName') as string;
    const accountNumber = formData.get('accountNumber') as string;
    const accountName = formData.get('accountName') as string;
    const qrCode = formData.get('qrCode') as string;

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: 'ไม่พบข้อมูลลูกค้า' };

    await prisma.client.update({
      where: { id },
      data: {
        giftSection: {
          title: title || 'Gifts & Blessings',
          subtitle: subtitle || 'ของขวัญและคำอวยพร',
          message: message || '',
          bankName,
          accountNumber,
          accountName,
          qrCode
        }
      }
    });

    revalidatePath(`/admin/builder`);
    revalidatePath(`/[client]`, 'page');
    return { success: true };
  } catch (e: any) {
    return { error: 'บันทึกข้อมูลของขวัญล้มเหลว: ' + e.message };
  }
}
