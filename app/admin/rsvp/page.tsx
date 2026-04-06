'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  TextField, 
  InputAdornment, 
  Button, 
  Avatar, 
  Stack,
  IconButton
} from '@mui/material';
import { 
  SearchNormal1, 
  Call, 
  People, 
  TickCircle, 
  CloseCircle,
  DocumentDownload,
  ArrowRotateLeft,
  ArrowLeft
} from 'iconsax-react';
import { useSearchParams, useRouter } from 'next/navigation';

interface RSVPData {
  id: string;
  name: string;
  attending: boolean;
  phone: string;
  guestCount: number;
  dietary?: string;
  client?: {
    brideName: string;
    groomName: string;
  };
  createdAt: string;
}

export default function AdminRSVP() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');

  useEffect(() => {
    async function fetchRSVPs() {
      setLoading(true);
      try {
        const url = slug ? `/api/admin/rsvp?slug=${slug}` : '/api/admin/rsvp';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch RSVPs');
        const data = await response.json();
        setRsvps(data);
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRSVPs();
  }, [slug]);

  const filteredRsvps = rsvps.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.phone && item.phone.includes(searchTerm))
  );

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attending).length,
    guests: rsvps.reduce((acc, r) => acc + (r.guestCount || 0), 0),
    notAttending: rsvps.filter(r => !r.attending).length
  };

  const exportCSV = () => {
    const headers = ['Name,Attending,Guests,Phone,Notes,Date'];
    const rows = rsvps.map(r => 
      `"${r.name}","${r.attending ? 'Yes' : 'No'}",${r.guestCount},"${r.phone}","${r.dietary || ''}","${new Date(r.createdAt).toLocaleDateString()}"`
    );
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rsvp_list.csv';
    link.click();
  };

  const clientNames = slug && rsvps.length > 0 && rsvps[0].client 
    ? `${rsvps[0].client.brideName} & ${rsvps[0].client.groomName}` 
    : slug ? "Wedding Guest List" : "Global Guest Responses";

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', pb: 10 }}>
      {/* Header section */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
            <Box>
              <Button 
                startIcon={<ArrowLeft size="18" />} 
                onClick={() => router.push('/admin/clients')}
                sx={{ color: '#f2a1a1', fontWeight: 700, p: 0, mb: 1, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#e89191' } }}
              >
                Back to Dashboard
              </Button>
              <Typography variant="h3" sx={{ fontFamily: '"Parisienne", cursive', fontWeight: 400, color: '#1a1a1a', fontSize: '2.8rem' }}>
                {clientNames}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
                 Manage guest responses and attendance for this wedding journey.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<DocumentDownload size="20" variant="Bulk" color="#a18cd1" />} 
                onClick={exportCSV}
                sx={{ borderRadius: '50px', borderColor: '#f3f0ff', color: '#a18cd1', fontWeight: 700, px: 3, '&:hover': { borderColor: '#a18cd1', bgcolor: '#f3f0ff' } }}
              >
                Export Data
              </Button>
              <IconButton 
                onClick={() => window.location.reload()}
                sx={{ bgcolor: '#fff5f5', color: '#f2a1a1', '&:hover': { bgcolor: '#ffebeb' } }}
              >
                <ArrowRotateLeft size="22" variant="Bulk" color="#f2a1a1" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Stats with Colors */}
          <Box sx={{ 
            display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mt: 4 
          }}>
            <Box sx={{ p: 2, borderRadius: '24px', border: '1px solid #f5f5f5', textAlign: 'center', bgcolor: '#ffffff' }}>
              <Typography variant="caption" sx={{ color: '#888', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em' }}>TOTAL RESPONSES</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{stats.total}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: '24px', border: '1px solid #e8f5e9', textAlign: 'center', bgcolor: '#f9fffb' }}>
              <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em' }}>CONFIRMED</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#2e7d32' }}>{stats.attending}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: '24px', border: '1px solid #fff5e6', textAlign: 'center', bgcolor: '#fffcf5' }}>
              <Typography variant="caption" sx={{ color: '#f6d365', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em' }}>GUEST COUNT</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#f6d365' }}>{stats.guests}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: '24px', border: '1px solid #fff0f0', textAlign: 'center', bgcolor: '#fff5f5' }}>
              <Typography variant="caption" sx={{ color: '#f2a1a1', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em' }}>DECLINED</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#f2a1a1' }}>{stats.notAttending}</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <TextField 
          fullWidth placeholder="ค้นหาชื่อแขก..." variant="outlined" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 4 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1.5 }}>
                  <SearchNormal1 size="20" color="#f2a1a1" variant="Bulk" />
                </InputAdornment>
              ),
              sx: { borderRadius: '50px', backgroundColor: '#fff', '& fieldset': { borderColor: '#f0f0f0' } }
            }
          }}
        />

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ color: '#666' }}>Loading Responses...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {filteredRsvps.map((rsvp) => (
              <Card key={rsvp.id} elevation={0} sx={{ borderRadius: '24px', border: '1px solid #f8f8f8', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(242, 161, 161, 0.05)' }, transition: 'all 0.3s ease' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 50, height: 50, bgcolor: rsvp.attending ? '#e8f5e9' : '#fff5f5', color: rsvp.attending ? '#2e7d32' : '#f2a1a1' }}>
                        {rsvp.attending ? <TickCircle variant="Bulk" size="28" color="#2e7d32" /> : <CloseCircle variant="Bulk" size="28" color="#f2a1a1" />}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1rem' }}>{rsvp.name}</Typography>
                        <Stack direction="row" spacing={2.5} sx={{ mt: 0.5 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Call size="14" color="#4facfe" variant="Bulk" />
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 700 }}>{rsvp.phone || 'No Phone'}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <People size="14" color="#f6d365" variant="Bulk" />
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 700 }}>{rsvp.guestCount} Guests</Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: { sm: '200px' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <Chip 
                        label={rsvp.attending ? "Joining" : "Declined"} 
                        size="small" 
                        sx={{ 
                          borderRadius: '50px', fontWeight: 800, fontSize: '0.65rem',
                          bgcolor: rsvp.attending ? '#e8f5e9' : '#fff5f5',
                          color: rsvp.attending ? '#2e7d32' : '#f2a1a1'
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                        {new Date(rsvp.createdAt).toLocaleDateString('th-TH')}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  {rsvp.dietary && (
                    <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '15px', bgcolor: '#fcfcfc', border: '1px solid #f5f5f5' }}>
                      <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic', fontSize: '0.85rem' }}>
                        " {rsvp.dietary} "
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
