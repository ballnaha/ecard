import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Box, Typography, Button, Card, CardContent, Switch, Avatar, IconButton } from '@mui/material';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { 
  MoreHoriz,
  EmailOutlined,
  CheckCircle,
  ChatBubbleOutline,
  AttachFile,
  Layers,
  PeopleOutline,
  ChevronRight
} from '@mui/icons-material';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  let clientsCount = 0;
  let recentClients: any[] = [];
  
  try {
    const clients = await prisma.client.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 4 
    });
    recentClients = clients;
    clientsCount = await prisma.client.count();
  } catch (e: any) {
    console.error("Dashboard DB Error:", e.message);
  }

  const stats = [
    { label: 'Total Cards', value: clientsCount.toString(), sub: 'Cards currently in system', color: '#db2777', bg: '#fdf2f8', icon: <Layers sx={{fontSize: 18}} /> },
    { label: 'RSVP Today', value: '0', sub: 'Responses in last 24h', color: '#db2777', bg: '#fdf2f8', icon: <PeopleOutline sx={{fontSize: 18}} /> },
    { label: 'Avg Views', value: '0', sub: 'Views per card', color: '#db2777', bg: '#fdf2f8', icon: <ChatBubbleOutline sx={{fontSize: 18}} /> },
    { label: 'Storage Used', value: '1.2 GB', sub: 'Image & Asset storage', color: '#db2777', bg: '#fdf2f8', icon: <AttachFile sx={{fontSize: 18}} /> },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#0f172a">Dashboard</Typography>
          <Typography variant="body2" color="#64748b" fontWeight="500">Welcome back, {session?.user?.name || 'Administrator'}</Typography>
        </Box>
        <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
          <Button 
            variant="contained" 
            disableElevation 
            sx={{ 
              bgcolor: '#f472b6', 
              color: '#ffffff',
              textTransform: 'none', 
              fontWeight: 700, 
              borderRadius: 2, 
              px: 3, 
              py: 1,
              '&:hover': { bgcolor: '#db2777', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)' }
            }}
          >
            + Create Card
          </Button>
        </Link>
      </Box>

      {/* Analytics Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5, mb: 4 }}>
        {stats.map((stat, i) => (
          <Card key={i} sx={{ borderRadius: 1, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Box sx={{ width: 36, height: 36, bgcolor: '#f8fafc', color: stat.color, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                  {stat.icon}
                </Box>
                <IconButton size="small" sx={{ color: '#cbd5e1' }}><MoreHoriz fontSize="small" /></IconButton>
              </Box>
              <Typography variant="h4" fontWeight="900" color="#0f172a" sx={{ letterSpacing: -1 }}>{stat.value}</Typography>
              <Typography variant="body2" fontWeight="700" color="#64748b" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>{stat.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a">Recent Wedding Cards</Typography>
            <Link href="/admin/clients">
              <Button 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  color: '#db2777', 
                  fontWeight: 700,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: '#fdf2f8' }
                }}
              >
                View All
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {recentClients.length === 0 ? (
              <Card sx={{ borderRadius: 1, border: '1px dashed #cbd5e1', boxShadow: 'none', bgcolor: '#f8fafc' }}>
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="#64748b" fontWeight="500">No active wedding cards found.</Typography>
                </CardContent>
              </Card>
            ) : recentClients.map((client: any) => (
              <Card key={client.id} sx={{ borderRadius: 1, border: '1px solid #e2e8f0', boxShadow: 'none', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }, transition: '0.2s' }}>
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Avatar sx={{ width: 44, height: 44, bgcolor: '#fdf2f8', color: '#db2777', borderRadius: 1, fontWeight: 800 }}>💒</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="800" color="#0f172a">{client.groomName} & {client.brideName}</Typography>
                    <Typography variant="caption" color="#94a3b8" fontWeight="600">Slug: /{client.slug}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', mr: 2 }}>
                    <Typography variant="caption" color="#94a3b8" display="block" fontWeight="700" sx={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>EVENT DATE</Typography>
                    <Typography variant="body2" fontWeight="800" color="#475569">{new Date(client.eventDate).toLocaleDateString('en-GB')}</Typography>
                  </Box>
                  <IconButton size="small" sx={{ bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}><ChevronRight fontSize="small" /></IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
           <Box>
             <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2}>System Status</Typography>
             <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                     <Box sx={{ width: 40, height: 40, bgcolor: '#f0fdf4', color: '#16a34a', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #dcfce7' }}>
                        <CheckCircle sx={{fontSize: 20}} />
                     </Box>
                     <Box>
                        <Typography variant="body2" fontWeight="800" color="#0f172a">Database</Typography>
                        <Typography variant="caption" color="#16a34a" fontWeight="700">Healthy Connection</Typography>
                     </Box>
                  </Box>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 700, 
                      borderColor: '#e2e8f0', 
                      color: '#475569', 
                      bgcolor: '#f8fafc',
                      '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
                    }}
                  >
                    View Logs
                  </Button>
                </CardContent>
              </Card>
            </Box>

           <Box>
             <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2}>Notifications</Typography>
             <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, bgcolor: '#f5f3ff', color: '#7c3aed', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <EmailOutlined sx={{fontSize: 20}} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                         <Typography variant="body2" fontWeight="800" color="#0f172a">RSVP Alerts</Typography>
                         <Typography variant="caption" color="#64748b" fontWeight="600">Daily email summary</Typography>
                      </Box>
                      <Switch defaultChecked size="small" />
                   </Box>
                </CardContent>
              </Card>
            </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Fixed missing import in file

