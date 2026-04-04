import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientList from './ClientList';
import { Box, Typography } from '@mui/material';

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>อีการ์ดลูกค้า (Wedding Cards)</Typography>
        <Typography variant="body1" color="text.secondary">จัดการรายชื่อลูกค้าและออกแบบส่วนประกอบของการ์ดได้ทีละรายบุคคล</Typography>
      </Box>
      
      <ClientList initialClients={clients} />
    </Box>
  );
}
