import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import BuilderEditor from './BuilderEditor';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const resolvedParams = await searchParams;

  if (!resolvedParams.clientId) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" mb={2}>ไม่พบข้อมูลลูกค้านี้ (No Client ID)</Typography>
        <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
          <Button variant="contained">กลับไปหน้าลูกค้ารวม</Button>
        </Link>
      </Box>
    );
  }

  const client = await prisma.client.findUnique({
    where: { id: resolvedParams.clientId }
  });

  if (!client) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" mb={2}>ไม่พบข้อมูลลูกค้านี้ในระบบ</Typography>
        <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
          <Button variant="contained">กลับไปหน้าลูกค้ารวม</Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>

        <Box>
          <Typography variant="h4" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>Card Builder: {client.groomName} & {client.brideName}</Typography>
          <Typography variant="body1" color="text.secondary">จัดเรียงลำดับการแสดงผล E-Card และตั้งค่าของคู่บ่าวสาว</Typography>
        </Box>
      </Box>

      <BuilderEditor key={client.id + '-' + client.updatedAt.getTime()} client={client} />
    </Box>
  );
}
