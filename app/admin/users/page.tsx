import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UserList from './UserList';
import { Box, Typography } from '@mui/material';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const users = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, username: true, role: true, status: true, createdAt: true }
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>จัดการผู้ใช้งาน (Users)</Typography>
        <Typography variant="body1" color="text.secondary">เพิ่ม แก้ไข หรือลบบัญชีแอดมินที่สามารถระบุสิทธิ์ภายในระบบได้</Typography>
      </Box>
      
      {/* Client Component เอาไว้จัดการ UI ค้นหาและปุ่ม Action ต่างๆ */}
      <UserList initialUsers={users} />
    </Box>
  );
}
