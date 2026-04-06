import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Switch, 
  Avatar, 
  IconButton,
  Stack,
  Container,
  alpha
} from '@mui/material';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import {
  Category,
  Heart,
  People,
  Eye,
  Calendar,
  ArrowRight,
  DirectNormal,
  NotificationCircle,
  Data
} from 'iconsax-react';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  let clientsCount = 0;
  let totalRSVPs = 0;
  let recentClients: any[] = [];

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        _count: {
          select: { rsvps: true }
        }
      }
    });
    recentClients = clients;
    clientsCount = await prisma.client.count();
    totalRSVPs = await prisma.rSVP.count();
  } catch (e: any) {
    console.error("Dashboard DB Error:", e.message);
  }

  const brandColor = '#f2a1a1';

  const stats = [
    { label: 'Total Weddings', value: clientsCount.toString(), sub: 'Active celebrations', color: '#f2a1a1', icon: <Heart variant="Bulk" size="32" color="#f2a1a1" /> },
    { label: 'Global RSVPs', value: totalRSVPs.toString(), sub: 'Guest responses', color: '#2e7d32', icon: <People variant="Bulk" size="32" color="#2e7d32" /> },
    { label: 'System Uptime', value: '99.9%', sub: 'Healthy connection', color: '#4facfe', icon: <Data variant="Bulk" size="32" color="#4facfe" /> },
    { label: 'Server Load', value: 'Low', sub: 'Optimal performance', color: '#f6d365', icon: <Category variant="Bulk" size="32" color="#f6d365" /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', pb: 10 }}>
      {/* Header section identical to other pages for consistency */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: '"Parisienne", cursive', fontWeight: 400, color: '#1a1a1a', fontSize: '3.2rem' }}>
                Wedding Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: '#777', mt: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
                 Welcome back, {session?.user?.name || 'Administrator'}. Here's what's happening.
              </Typography>
            </Box>
            <Link href="/admin/clients/add" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                startIcon={<Heart variant="Bulk" size="20" color="#fff" />}
                sx={{
                  py: 1.5, px: 4, borderRadius: '50px', backgroundColor: brandColor, color: '#fff',
                  textTransform: 'none', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 30px rgba(242, 161, 161, 0.3)',
                  '&:hover': { backgroundColor: '#e89191', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s'
                }}
              >
                + New Journey
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {/* Analytics Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 6 }}>
          {stats.map((stat, i) => (
            <Card key={i} elevation={0} sx={{ 
              borderRadius: '32px', 
              border: '1px solid #f8f8f8', 
              bgcolor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 20px 40px ${alpha(stat.color, 0.08)}`, borderColor: stat.color },
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ mb: 2.5 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" fontWeight="900" color="#1a1a1a" sx={{ letterSpacing: -1, fontSize: '2rem' }}>{stat.value}</Typography>
                <Typography variant="body2" fontWeight="700" color="#888" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', mt: 0.5 }}>{stat.label}</Typography>
                <Typography variant="caption" sx={{ color: '#ccc', mt: 1, display: 'block', fontWeight: 600 }}>{stat.sub}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.8fr 1fr' }, gap: 4 }}>
          {/* Recent Clients Section */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="800" color="#1a1a1a">Recent Love Stories</Typography>
              <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
                <Button 
                  endIcon={<ArrowRight size="18" />} 
                  sx={{ color: brandColor, fontWeight: 700, borderRadius: '50px', textTransform: 'none' }}
                >
                  View all journeys
                </Button>
              </Link>
            </Stack>

            <Stack spacing={2}>
              {recentClients.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center', borderRadius: '32px', border: '1px dashed #eee', bgcolor: '#fafafa' }}>
                  <Typography variant="body2" color="#aaa" fontWeight="600">No wedding journeys initialized yet.</Typography>
                </Box>
              ) : recentClients.map((client: any) => (
                <Card key={client.id} elevation={0} sx={{ 
                  borderRadius: '24px', 
                  border: '1px solid #f8f8f8', 
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                  '&:hover': { bgcolor: '#fffcfc', transform: 'scale(1.01)' }, 
                  transition: 'all 0.3s ease' 
                }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ 
                      width: 50, height: 50, borderRadius: '18px', 
                      bgcolor: '#fff5f5', color: brandColor, border: '1px solid #ffebeb' 
                    }}>
                      <Heart variant="Bulk" size="24" color={brandColor} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1rem' }}>{client.brideName} & {client.groomName}</Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DirectNormal size="12" variant="Bulk" color="#a18cd1" /> /{client.slug}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <People size="12" variant="Bulk" color="#2e7d32" /> {client._count?.rsvps || 0} RSVPs
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ textAlign: 'right', mr: 2, display: { xs: 'none', sm: 'block' } }}>
                      <Typography variant="caption" color="#aaa" display="block" fontWeight="800" sx={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CEREMONY DATE</Typography>
                      <Typography variant="body2" fontWeight="800" color="#1a1a1a">{new Date(client.eventDate).toLocaleDateString('en-GB')}</Typography>
                    </Box>
                    <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
                      <IconButton size="small" sx={{ bgcolor: '#ffffff', border: '1px solid #f5f5f5', color: brandColor }}>
                        <ArrowRight size="18" />
                      </IconButton>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* System Control Section */}
          <Box>
            <Typography variant="h5" fontWeight="800" color="#1a1a1a" sx={{ mb: 3 }}>Quick Settings</Typography>
            
            <Stack spacing={3}>
              <Card elevation={0} sx={{ borderRadius: '32px', border: '1px solid #f5f5f5', bgcolor: '#ffffff' }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                    <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 48, height: 48, borderRadius: '16px' }}>
                      <NotificationCircle variant="Bulk" size="24" />
                    </Avatar>
                    <Box>
                       <Typography sx={{ fontWeight: 800, color: '#1a1a1a' }}>Email Notifications</Typography>
                       <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>Get guest alerts in real-time</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }} />
                    <Switch defaultChecked sx={{ 
                      '& .MuiSwitch-switchBase.Mui-checked': { color: brandColor },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: brandColor }
                    }} />
                  </Stack>
                  <Button fullWidth variant="outlined" sx={{ borderRadius: '50px', py: 1.2, color: '#1a1a1a', borderColor: '#eee', fontWeight: 700, textTransform: 'none' }}>
                    Configure SMTP
                  </Button>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: '32px', border: '1px solid #f3e5f5', bgcolor: '#fbfaff' }}>
                <CardContent sx={{ p: 4 }}>
                   <Typography sx={{ fontWeight: 800, mb: 1, fontSize: '0.9rem' }}>Storage Capacity</Typography>
                   <Box sx={{ height: 8, bgcolor: '#eee', borderRadius: 4, position: 'relative', overflow: 'hidden', mb: 1 }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '35%', bgcolor: brandColor, borderRadius: 4 }} />
                   </Box>
                   <Typography variant="caption" sx={{ color: '#888', fontWeight: 700 }}>1.2 GB / 5.0 GB Used</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
