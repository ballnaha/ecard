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
  Button, 
  Avatar, 
  Stack,
  IconButton,
  Paper,
  Skeleton,
  alpha
} from '@mui/material';
import { 
  SearchNormal1, 
  Call, 
  People, 
  TickCircle, 
  CloseCircle,
  DocumentDownload,
  ArrowRotateLeft,
  Heart,
  Calendar,
  UserMinus
} from 'iconsax-react';
import { useSearchParams } from 'next/navigation';

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
  const slug = searchParams.get('slug');

  const brandColor = '#f2a1a1';
  const primaryGradient = 'linear-gradient(135deg, #f2a1a1 0%, #e89191 100%)';

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
                {clientNames}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage guest responses and attendance
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<DocumentDownload size="20" variant="Bulk" color="#a18cd1" />} 
                onClick={exportCSV}
                sx={{ 
                  borderRadius: '14px', 
                  borderColor: 'rgba(0,0,0,0.08)', 
                  color: '#64748b', 
                  fontWeight: 700, 
                  px: 3, 
                  py: 1.5,
                  textTransform: 'none',
                  '&:hover': { 
                    borderColor: '#a18cd1', 
                    bgcolor: alpha('#a18cd1', 0.05),
                    color: '#a18cd1'
                  } 
                }}
              >
                Export CSV
              </Button>
              <IconButton 
                onClick={() => window.location.reload()}
                sx={{ 
                  width: 48,
                  height: 48,
                  bgcolor: alpha(brandColor, 0.08),
                  borderRadius: '14px',
                  '&:hover': { bgcolor: alpha(brandColor, 0.15) }
                }}
              >
                <ArrowRotateLeft size="22" variant="Bulk" color={brandColor} />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        {/* Search Bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: '20px', 
            border: '1px solid rgba(0,0,0,0.04)',
            mb: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchNormal1 size="22" color="#94a3b8" variant="Bulk" />
            <TextField
              fullWidth
              placeholder="Search guest name or phone..."
              variant="standard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ disableUnderline: true }}
              sx={{ 
                '& input': { 
                  fontSize: '0.95rem', 
                  fontWeight: 500,
                  color: '#1a1a1a',
                  '&::placeholder': { color: '#94a3b8' }
                }
              }}
            />
            {searchTerm && (
              <Chip 
                label={`${filteredRsvps.length} results`}
                size="small"
                sx={{ 
                  height: 28,
                  fontWeight: 600,
                  bgcolor: alpha(brandColor, 0.1),
                  color: brandColor
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Stats Summary */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
          gap: 2, 
          mb: 4 
        }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '14px', 
                background: primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart variant="Bulk" size="24" color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">{stats.total}</Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Total Responses</Typography>
              </Box>
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TickCircle variant="Bulk" size="24" color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">{stats.attending}</Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Confirmed</Typography>
              </Box>
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <People variant="Bulk" size="24" color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">{stats.guests}</Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Guest Count</Typography>
              </Box>
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserMinus variant="Bulk" size="24" color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">{stats.notAttending}</Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Declined</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* RSVP List */}
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper key={i} elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Skeleton variant="circular" width={50} height={50} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={200} height={28} />
                    <Skeleton variant="text" width={150} height={20} />
                  </Box>
                  <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: '14px' }} />
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : filteredRsvps.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 8, 
              textAlign: 'center', 
              borderRadius: '24px', 
              border: '1px dashed #e2e8f0',
              bgcolor: '#fff'
            }}
          >
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(brandColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <Calendar variant="Bulk" size="40" color={brandColor} />
            </Box>
            <Typography variant="h6" fontWeight="800" color="#1a1a1a" sx={{ mb: 1 }}>
              {searchTerm ? 'No matches found' : 'No responses yet'}
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              {searchTerm ? 'Try a different search term' : 'Guest responses will appear here once they submit their RSVP'}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filteredRsvps.map((rsvp) => (
              <Card 
                key={rsvp.id} 
                elevation={0}
                sx={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(0,0,0,0.04)', 
                  bgcolor: '#fff',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    borderColor: alpha(brandColor, 0.3)
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    {/* Status Avatar */}
                    <Avatar sx={{ 
                      width: 50, 
                      height: 50, 
                      bgcolor: rsvp.attending ? alpha('#10b981', 0.1) : alpha('#f43f5e', 0.1),
                      flexShrink: 0
                    }}>
                      {rsvp.attending 
                        ? <TickCircle variant="Bulk" size="28" color="#10b981" /> 
                        : <CloseCircle variant="Bulk" size="28" color="#f43f5e" />
                      }
                    </Avatar>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                      <Typography variant="h6" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>
                        {rsvp.name}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {rsvp.phone && (
                          <Chip 
                            size="small" 
                            icon={<Call size="14" variant="Bulk" color="#4facfe" />}
                            label={rsvp.phone}
                            sx={{ 
                              height: 26, 
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              bgcolor: alpha('#4facfe', 0.1), 
                              color: '#4facfe',
                              '& .MuiChip-icon': { ml: 0.5 }
                            }}
                          />
                        )}
                        <Chip 
                          size="small" 
                          icon={<People size="14" variant="Bulk" color="#fbbf24" />}
                          label={`${rsvp.guestCount} Guests`}
                          sx={{ 
                            height: 26, 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            bgcolor: alpha('#fbbf24', 0.1), 
                            color: '#fbbf24',
                            '& .MuiChip-icon': { ml: 0.5 }
                          }}
                        />
                        <Chip 
                          size="small" 
                          label={new Date(rsvp.createdAt).toLocaleDateString('th-TH')}
                          sx={{ 
                            height: 26, 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            bgcolor: alpha('#94a3b8', 0.1), 
                            color: '#64748b'
                          }}
                        />
                      </Stack>
                      {rsvp.dietary && (
                        <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.85rem', mt: 1 }}>
                          " {rsvp.dietary} "
                        </Typography>
                      )}
                    </Box>

                    {/* Status Chip */}
                    <Chip 
                      label={rsvp.attending ? "Joining" : "Declined"} 
                      sx={{ 
                        borderRadius: '14px', 
                        fontWeight: 800, 
                        fontSize: '0.8rem',
                        px: 1,
                        bgcolor: rsvp.attending ? alpha('#10b981', 0.1) : alpha('#f43f5e', 0.1),
                        color: rsvp.attending ? '#10b981' : '#f43f5e',
                        flexShrink: 0
                      }} 
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}