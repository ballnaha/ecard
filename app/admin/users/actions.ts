'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  const status = formData.get('status') as string;

  if (!username || !password) return { error: "กรุณากรอก Username และ Password ให้ครบถ้วน" };

  try {
    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) return { error: "Username นี้ถูกใช้งานไปแล้ว" };

    const hashed = bcrypt.hashSync(password, 10);
    await prisma.admin.create({
      data: { username, password: hashed, role, status }
    });
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  const status = formData.get('status') as string;

  try {
    const updateData: any = { role, status };
    if (password) {
      updateData.password = bcrypt.hashSync(password, 10);
    }
    
    const current = await prisma.admin.findUnique({ where: { id } });
    if (current?.username !== username) {
      const existing = await prisma.admin.findUnique({ where: { username } });
      if (existing) return { error: "Username นี้ถูกใช้งานไปแล้ว" };
      updateData.username = username;
    }

    await prisma.admin.update({
      where: { id },
      data: updateData
    });
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  try {
    // ป้องกันการลบตัวเอง
    const currentAdmin = await prisma.admin.findUnique({ where: { username: session.user?.name || "" }});
    if (currentAdmin?.id === id) {
       return { error: "ระบบไม่อนุญาตให้ลบบัญชีที่คุณกำลังใช้งานอยู่ได้ครับ" };
    }

    await prisma.admin.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
