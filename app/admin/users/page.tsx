import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UserList from './UserList';
import { Box, Typography, Container } from '@mui/material';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const users = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, username: true, role: true, status: true, createdAt: true }
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', pb: 10 }}>
       {/* Header section consistent with Dashboard */}
       <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontFamily: '"Parisienne", cursive', fontWeight: 400, color: '#1a1a1a', fontSize: '3rem' }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
            Manage administrative access and system roles
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <UserList initialUsers={users} />
      </Container>
    </Box>
  );
}
