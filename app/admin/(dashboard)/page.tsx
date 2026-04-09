import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Container,
  alpha,
  Divider,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import {
  Heart,
  People,
  Calendar,
  MessageText1,
  AddCircle,
  DocumentText,
  Setting2
} from 'iconsax-react';
import UpcomingWeddings from './UpcomingWeddings';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  let clientsCount = 0;
  let totalRSVPs = 0;
  let totalWishes = 0;
  let upcomingWeddings: any[] = [];
  let recentRSVPs: any[] = [];
  let recentWishes: any[] = [];
  let upcomingCount = 0;
  let attendingCount = 0;

  try {
    // Basic stats
    clientsCount = await prisma.client.count();
    totalRSVPs = await prisma.rSVP.count();
    totalWishes = await prisma.wish.count();

    // Attending stats
    attendingCount = await prisma.rSVP.count({ where: { attending: true } });

    // Upcoming weddings (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    upcomingCount = await prisma.client.count({
      where: {
        eventDate: {
          gte: new Date(),
          lte: thirtyDaysFromNow
        }
      }
    });

    upcomingWeddings = await prisma.client.findMany({
      where: {
        eventDate: {
          gte: new Date()
        }
      },
      orderBy: { eventDate: 'asc' },
      take: 5
    });

    // Recent RSVPs
    recentRSVPs = await prisma.rSVP.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        client: {
          select: { brideName: true, groomName: true, slug: true }
        }
      }
    });

    // Recent Wishes
    recentWishes = await prisma.wish.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        client: {
          select: { brideName: true, groomName: true }
        }
      }
    });

  } catch (e: any) {
    console.error("Dashboard DB Error:", e.message);
  }

  const brandColor = '#f2a1a1';
  const primaryGradient = 'linear-gradient(135deg, #f2a1a1 0%, #e89191 100%)';
  const blueGradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  const purpleGradient = 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)';
  const goldGradient = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';

  const stats = [
    {
      label: 'Total Weddings',
      value: clientsCount.toString(),
      sub: 'Active couples',
      color: '#f2a1a1',
      gradient: primaryGradient,
      icon: <Heart variant="Bulk" size="28" color="#fff" />,
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Global RSVPs',
      value: totalRSVPs.toString(),
      sub: `${attendingCount} confirmed`,
      color: '#4facfe',
      gradient: blueGradient,
      icon: <People variant="Bulk" size="28" color="#fff" />,
      trend: '+8%',
      trendUp: true
    },
    {
      label: 'Guest Wishes',
      value: totalWishes.toString(),
      sub: 'Warm messages',
      color: '#a18cd1',
      gradient: purpleGradient,
      icon: <MessageText1 variant="Bulk" size="28" color="#fff" />,
      trend: '+23%',
      trendUp: true
    },
    {
      label: 'Coming Soon',
      value: upcomingCount.toString(),
      sub: 'Next 30 days',
      color: '#fbbf24',
      gradient: goldGradient,
      icon: <Calendar variant="Bulk" size="28" color="#fff" />,
      trend: 'On track',
      trendUp: null
    },
  ];

  const quickActions = [
    { label: 'New Wedding Card', href: '/admin/clients/add', icon: <AddCircle variant="Bulk" size="24" color="#f2a1a1" />, color: '#f2a1a1' },
    { label: 'All Wedding Cards', href: '/admin/clients', icon: <DocumentText variant="Bulk" size="24" color="#4facfe" />, color: '#4facfe' },
    { label: 'Manage Users', href: '/admin/users', icon: <People variant="Bulk" size="24" color="#a18cd1" />, color: '#a18cd1' },
    
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      {/* Hero Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #fff 0%, #fff9f9 50%, #fff5f5 100%)',
        borderBottom: '1px solid rgba(242, 161, 161, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(242, 161, 161, 0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }
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
                Welcome Back ✨
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: primaryGradient,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px rgba(242, 161, 161, 0.3)'
                  }}
                >
                  {session?.user?.name?.[0] || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>
                    {session?.user?.name || 'Administrator'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Stack direction="row" spacing={2}>
              <Link href="/admin/clients/add" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  startIcon={<AddCircle variant="Bold" size="20" color="#fff" />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '16px',
                    background: primaryGradient,
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 24px rgba(242, 161, 161, 0.35)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(242, 161, 161, 0.45)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create New Wedding
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Stats Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {stats.map((stat, i) => (
            <Card
              key={i}
              elevation={0}
              sx={{
                borderRadius: '24px',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                background: stat.gradient,
                borderRadius: '50%',
                opacity: 0.1
              }} />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 14px rgba(${stat.color === '#f2a1a1' ? '242, 161, 161' : stat.color === '#4facfe' ? '79, 172, 254' : stat.color === '#a18cd1' ? '161, 140, 209' : '251, 191, 36'}, 0.25)`
                  }}>
                    {stat.icon}
                  </Box>
                  {stat.trendUp !== null && (
                    <Chip
                      size="small"
                      label={stat.trend}
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: stat.trendUp ? alpha('#10b981', 0.1) : alpha('#64748b', 0.1),
                        color: stat.trendUp ? '#10b981' : '#64748b'
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h3" fontWeight="900" color="#1a1a1a" sx={{ fontSize: '2rem', mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  {stat.sub}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 4 }}>
          {/* Left Column */}
          <Stack spacing={4}>
            {/* Upcoming Weddings */}
            <UpcomingWeddings weddings={upcomingWeddings} />

            {/* Live Activity */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              {/* Recent RSVPs */}
              <Card elevation={0} sx={{ borderRadius: '24px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: blueGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <People variant="Bulk" size="18" color="#fff" />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="800">Latest RSVPs</Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {recentRSVPs.length === 0 ? (
                      <Typography variant="body2" color="#94a3b8" sx={{ py: 4, textAlign: 'center' }}>
                        No RSVPs yet
                      </Typography>
                    ) : recentRSVPs.map((rsvp) => (
                      <Box key={rsvp.id} sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: alpha(rsvp.attending ? '#10b981' : '#f43f5e', 0.03),
                        border: `1px solid ${alpha(rsvp.attending ? '#10b981' : '#f43f5e', 0.1)}`
                      }}>
                        <Avatar sx={{
                          width: 36,
                          height: 36,
                          bgcolor: rsvp.attending ? alpha('#10b981', 0.15) : alpha('#f43f5e', 0.15),
                          color: rsvp.attending ? '#10b981' : '#f43f5e',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {rsvp.name?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight="700" noWrap>
                            {rsvp.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }} noWrap>
                            for {rsvp.client.brideName}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={rsvp.attending ? 'Attending' : 'Declined'}
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: rsvp.attending ? alpha('#10b981', 0.1) : alpha('#f43f5e', 0.1),
                            color: rsvp.attending ? '#10b981' : '#f43f5e'
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Recent Wishes */}
              <Card elevation={0} sx={{ borderRadius: '24px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: purpleGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageText1 variant="Bulk" size="18" color="#fff" />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="800">Guest Wishes</Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {recentWishes.length === 0 ? (
                      <Typography variant="body2" color="#94a3b8" sx={{ py: 4, textAlign: 'center' }}>
                        No wishes yet
                      </Typography>
                    ) : recentWishes.map((wish) => (
                      <Box key={wish.id} sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: alpha('#8b5cf6', 0.03),
                        border: `1px solid ${alpha('#8b5cf6', 0.1)}`
                      }}>
                        <Avatar sx={{
                          width: 36,
                          height: 36,
                          bgcolor: alpha('#8b5cf6', 0.15),
                          color: '#8b5cf6',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {wish.name?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight="700" noWrap>
                            {wish.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748b',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            "{wish.message}"
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Stack>

          {/* Right Sidebar */}
          <Stack spacing={4}>
            {/* Quick Actions */}
            <Card elevation={0} sx={{ borderRadius: '24px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="900" color="#1a1a1a" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  {quickActions.map((action, i) => (
                    <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '14px',
                          bgcolor: alpha(action.color, 0.04),
                          border: `1px solid transparent`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: alpha(action.color, 0.08),
                            borderColor: alpha(action.color, 0.2)
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(action.color, 0.12),
                            flexShrink: 0,
                            lineHeight: 0
                          }}>
                            {action.icon}
                          </Box>
                          <Typography variant="body2" fontWeight="700" color="#1a1a1a">
                            {action.label}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Link>
                  ))}
                </Stack>
              </CardContent>
            </Card>

          </Stack>
        </Box>
      </Container>
    </Box>
  );
}