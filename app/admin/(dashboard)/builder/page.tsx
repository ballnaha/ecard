import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { Box, Typography, Button, IconButton, Breadcrumbs } from '@mui/material';
import BuilderEditor from './BuilderEditor';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft2 } from 'iconsax-react';

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
    <Box sx={{ p: { xs: 3, md: 4, lg: 5 } }}>
      <Box sx={{ mb: 4 }}>
        <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowLeft2 size="18" variant="Bold" color="#94a3b8" />}
            sx={{
              color: '#94a3b8',
              mb: 1,
              '&:hover': { color: '#f2a1a1', bgcolor: 'transparent' },
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              pl: 0
            }}
          >
            Back to Client List
          </Button>
        </Link>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              fontWeight="900"
              color="#1a1a1a"
              sx={{
                mb: 1,
                lineHeight: 1.1,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                letterSpacing: '-0.02em'
              }}
            >
              Card Builder
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' }, fontWeight: 500, opacity: 0.8 }}>
              {client.groomName} & {client.brideName} — จัดเรียงและตั้งค่า E-Card
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href={`/${client.slug}`} target="_blank" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: '12px',
                  borderWidth: '2px',
                  fontWeight: 700,
                  textTransform: 'none',
                  color: '#64748b',
                  borderColor: '#e2e8f0',
                  '&:hover': {
                    borderColor: '#f2a1a1',
                    color: '#f2a1a1',
                    borderWidth: '2px',
                  }
                }}
              >
                ดูพรีวิวการ์ด
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      <BuilderEditor key={client.id + '-' + client.updatedAt.getTime()} client={client} />
    </Box>
  );
}
