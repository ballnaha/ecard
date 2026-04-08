'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "ต้องเข้าสู่ระบบก่อน" };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const username = session.user?.name || 'admin';

  if (!currentPassword || !newPassword) return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };

  const adminCount = await prisma.admin.count();

  if (adminCount === 0) {
    // กำลังใช้งานรหัสผ่านจาก .env, เราจะทำการสร้างบัญชีลงตาราง Admin เลย
    const validPassword = process.env.ADMIN_PASSWORD;

    if (currentPassword !== validPassword) {
      return { error: "รหัสผ่านเดิมไม่ถูกต้อง" };
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    await prisma.admin.create({
      data: {
        username: username,
        password: hashed,
      }
    });

    return { success: true };

  } else {
    // เปลี่ยนจากฐานข้อมูล
    const adminFound = await prisma.admin.findUnique({ where: { username } });

    if (!adminFound || !bcrypt.compareSync(currentPassword, adminFound.password)) {
      return { error: "รหัสผ่านเดิมไม่ถูกต้อง" };
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    await prisma.admin.update({
      where: { username },
      data: { password: hashed }
    });

    return { success: true };
  }
}
