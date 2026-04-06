'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Divider,
  alpha
} from '@mui/material';
import {
  SearchNormal1,
  Heart,
  Eye,
  Calendar,
  DirectNormal,
  Magicpen,
  Trash,
  Link1,
  People
} from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useConfirm } from '../components/ConfirmProvider';
import { useSnackbar } from '../components/SnackbarProvider';

interface ClientData {
  id: string;
  slug: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  primaryColor: string;
  _count: {
    rsvps: number;
  };
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { confirm } = useConfirm();
  const { showSnackbar } = useSnackbar();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/client/list');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Fetch Error:', error);
      showSnackbar('Error fetching clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = (client: ClientData) => {
    confirm({
      title: 'ลบข้อมูลลูกค้า?',
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ ${client.brideName} & ${client.groomName}? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      confirmLabel: 'ลบข้อมูล',
      cancelLabel: 'ยกเลิก',
      severity: 'error',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/client/delete?id=${client.id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete client');
          }

          showSnackbar('ลบข้อมูลบ่าวสาวเรียบร้อยแล้ว', 'success');
          fetchClients();
        } catch (error: any) {
          showSnackbar(error.message, 'error');
        }
      }
    });
  };
    
  const handleCopyDashboardLink = (slug: string) => {
    const url = `${window.location.origin}/dashboard/${slug}`;
    navigator.clipboard.writeText(url);
    showSnackbar('คัดลอกลิงก์ Dashboard ส่งให้ลูกค้าเรียบร้อย!', 'success');
  };

  const filteredClients = clients.filter(client =>
    client.brideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.groomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', pb: 10 }}>
      {/* Header section */}
      <Box sx={{ backgroundColor: '#ffffff', pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: '"Parisienne", cursive', fontWeight: 400, color: '#1a1a1a', fontSize: '3rem' }}>
                Wedding Clients
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Heart variant="Bulk" size="20" color="#fff" />}
              sx={{
                py: 1.2, px: 4, borderRadius: '50px', backgroundColor: '#f2a1a1', color: '#fff',
                textTransform: 'none', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 30px rgba(242, 161, 161, 0.3)',
                '&:hover': { backgroundColor: '#e89191', transform: 'translateY(-2px)' },
                transition: 'all 0.3s ease'
              }}
              onClick={() => router.push('/admin/clients/add')}
            >
              Add Client
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <TextField
          fullWidth placeholder="ค้นหาคู่บ่าวสาว..." variant="outlined" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1.5 }}>
                  <SearchNormal1 size="18" color="#f2a1a1" variant="Bulk" />
                </InputAdornment>
              ),
              sx: { borderRadius: '50px', height: '45px', backgroundColor: '#fff', '& fieldset': { borderColor: '#f0f0f0' }, '&:hover fieldset': { borderColor: '#f2a1a1' } }
            }
          }}
        />

        {loading ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ color: '#ccc', letterSpacing: '0.1em' }}>LOADING JOURNEYS...</Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex', flexDirection: 'column', gap: 1.5
          }}>
            {filteredClients.map((client) => (
              <Box key={client.id} sx={{ minWidth: 0 }}>
                <Card elevation={0} sx={{
                  borderRadius: '16px', border: '1px solid #f1f5f9', backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  '&:hover': { borderColor: '#f2a1a1', bgcolor: '#fffdfd' },
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ p: '12px 20px', '&:last-child': { pb: '12px' } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: '12px', bgcolor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Heart variant="Bulk" size="20" color="#f2a1a1" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>
                            {client.brideName} & {client.groomName}
                          </Typography>
                          <Stack direction="row" spacing={1.5} sx={{ mt: -0.2 }} alignItems="center">
                            <Typography noWrap variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                               <DirectNormal size="12" variant="Bulk" color="#a18cd1" /> {client.slug}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                               <Calendar size="12" variant="Bulk" color="#fbbf24" /> {new Date(client.eventDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                            <Chip 
                               label={`${client._count.rsvps} RSVPs`} 
                               size="small" 
                               sx={{ height: '18px', fontSize: '10px', bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, border: 'none' }} 
                            />
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton size="small" onClick={() => window.open(`/${client.slug}`, '_blank')} sx={{ bgcolor: alpha('#a18cd1', 0.05), '&:hover': { bgcolor: alpha('#a18cd1', 0.15) } }} title="View E-Card">
                          <Eye size="18" variant="Bulk" color="#a18cd1" />
                        </IconButton>
                        <IconButton size="small" onClick={() => router.push(`/admin/builder?clientId=${client.id}`)} sx={{ bgcolor: alpha('#4facfe', 0.05), '&:hover': { bgcolor: alpha('#4facfe', 0.15) } }} title="Edit Builder">
                          <Magicpen size="18" variant="Bulk" color="#4facfe" />
                        </IconButton>
                        <IconButton size="small" onClick={() => router.push(`/admin/rsvp?slug=${client.slug}`)} sx={{ bgcolor: alpha('#f2a1a1', 0.05), '&:hover': { bgcolor: alpha('#f2a1a1', 0.15) } }} title="Manage RSVPs">
                          <People size="18" variant="Bulk" color="#f2a1a1" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleCopyDashboardLink(client.slug)} sx={{ bgcolor: alpha('#fbbf24', 0.05), '&:hover': { bgcolor: alpha('#fbbf24', 0.15) } }} title="Copy Dashboard Link">
                          <Link1 size="18" variant="Bulk" color="#fbbf24" />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, my: 'auto', borderColor: '#f1f5f9' }} />
                        <IconButton size="small" onClick={() => handleDelete(client)} sx={{ bgcolor: alpha('#f87171', 0.05), '&:hover': { bgcolor: alpha('#f87171', 0.15) } }} title="Delete Client">
                          <Trash size="18" variant="Bulk" color="#f87171" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
