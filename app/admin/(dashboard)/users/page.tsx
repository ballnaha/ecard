import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UserList from './UserList';
import { Box, Typography, Container, Stack } from '@mui/material';
import { People } from 'iconsax-react';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const users = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, username: true, role: true, status: true, createdAt: true }
  });

  const brandColor = '#f2a1a1';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #fff 0%, #fff9f9 50%, #fff5f5 100%)',
        borderBottom: '1px solid rgba(242, 161, 161, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
            <Box>
              <Typography variant="h3" sx={{ 
                fontFamily: '"Parisienne", cursive', 
                fontWeight: 400, 
                color: '#1a1a1a', 
                fontSize: { xs: '2.5rem', md: '3rem' },
                mb: 1 
              }}>
                User Management ✨
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage administrative access and system roles
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              px: 3,
              py: 1.5,
              borderRadius: '14px',
              bgcolor: 'rgba(242, 161, 161, 0.08)',
              border: '1px solid rgba(242, 161, 161, 0.15)'
            }}>
              <People variant="Bulk" size="24" color={brandColor} />
              <Box>
                <Typography variant="h5" fontWeight="900" color="#1a1a1a" sx={{ lineHeight: 1 }}>
                  {users.length}
                </Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">
                  Team Members
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <UserList initialUsers={users} />
      </Container>
    </Box>
  );
}