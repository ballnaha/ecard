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
  alpha,
  Tooltip,
  Paper,
  Skeleton
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
  People,
  AddCircle,
  ArrowRight,
  Filter,
  Sort
} from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useConfirm } from '../../components/ConfirmProvider';
import { useSnackbar } from '../../components/SnackbarProvider';

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

  const brandColor = '#f2a1a1';
  const primaryGradient = 'linear-gradient(135deg, #f2a1a1 0%, #e89191 100%)';

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
      title: 'Delete Client?',
      message: `Are you sure you want to delete ${client.brideName} & ${client.groomName}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
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

          showSnackbar('Client deleted successfully', 'success');
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
    showSnackbar('Dashboard link copied to clipboard!', 'success');
  };

  const filteredClients = clients.filter(client =>
    client.brideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.groomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

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
                Wedding Cards ✨
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage all wedding invitations and e-cards
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircle variant="Bold" size="20" color="#fff" />}
              onClick={() => router.push('/admin/clients/add')}
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
              Add New Wedding
            </Button>
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
              placeholder="Search couples, names, or slugs..."
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
                label={`${filteredClients.length} results`}
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
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
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
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">{clients.length}</Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Total Cards</Typography>
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
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">
                  {clients.reduce((acc, c) => acc + (c._count?.rsvps || 0), 0)}
                </Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Total RSVPs</Typography>
              </Box>
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar variant="Bulk" size="24" color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="900" color="#1a1a1a">
                  {clients.filter(c => {
                    const days = getDaysUntil(c.eventDate);
                    return days >= 0 && days <= 30;
                  }).length}
                </Typography>
                <Typography variant="caption" color="#94a3b8" fontWeight="600">Upcoming (30d)</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Clients List */}
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Paper key={i} elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: '14px' }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={200} height={28} />
                    <Skeleton variant="text" width={150} height={20} />
                  </Box>
                  <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: '12px' }} />
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : filteredClients.length === 0 ? (
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
              <Heart variant="Bulk" size="40" color={brandColor} />
            </Box>
            <Typography variant="h6" fontWeight="800" color="#1a1a1a" sx={{ mb: 1 }}>
              {searchTerm ? 'No matches found' : 'No wedding cards yet'}
            </Typography>
            <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>
              {searchTerm ? 'Try a different search term' : 'Create your first wedding invitation'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddCircle variant="Bold" size="20" />}
                onClick={() => router.push('/admin/clients/add')}
                sx={{
                  py: 1.5, 
                  px: 4, 
                  borderRadius: '14px', 
                  background: primaryGradient,
                  textTransform: 'none', 
                  fontWeight: 700
                }}
              >
                Create First Wedding
              </Button>
            )}
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filteredClients.map((client) => {
              const daysUntil = getDaysUntil(client.eventDate);
              const isUpcoming = daysUntil >= 0 && daysUntil <= 30;
              const isPast = daysUntil < 0;

              return (
                <Card 
                  key={client.id} 
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
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                      {/* Date Badge */}
                      <Box 
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: '16px', 
                          background: isPast 
                            ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
                            : 'linear-gradient(135deg, #fff5f5 0%, #ffebeb 100%)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexDirection: 'column',
                          flexShrink: 0
                        }}
                      >
                        <Typography 
                          variant="h5" 
                          fontWeight="900" 
                          color={isPast ? '#94a3b8' : brandColor}
                          sx={{ lineHeight: 1 }}
                        >
                          {new Date(client.eventDate).getDate()}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="800" 
                          color={isPast ? '#94a3b8' : brandColor}
                          sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}
                        >
                          {new Date(client.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                        </Typography>
                      </Box>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                        <Typography variant="h6" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>
                          {client.brideName} & {client.groomName}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip 
                            size="small" 
                            icon={<DirectNormal size="14" variant="Bulk" color="#8b5cf6" />}
                            label={`/${client.slug}`}
                            sx={{ 
                              height: 26, 
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              bgcolor: alpha('#8b5cf6', 0.1), 
                              color: '#8b5cf6',
                              '& .MuiChip-icon': { ml: 0.5 }
                            }}
                          />
                          <Chip 
                            size="small" 
                            icon={<Calendar size="14" variant="Bulk" color={isPast ? '#94a3b8' : '#f59e0b'} />}
                            label={formatDate(client.eventDate)}
                            sx={{ 
                              height: 26, 
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              bgcolor: alpha(isPast ? '#94a3b8' : '#f59e0b', 0.1), 
                              color: isPast ? '#64748b' : '#f59e0b',
                              '& .MuiChip-icon': { ml: 0.5 }
                            }}
                          />
                          {isUpcoming && (
                            <Chip 
                              size="small" 
                              label={`${daysUntil} days`}
                              sx={{ 
                                height: 26, 
                                fontSize: '0.75rem', 
                                fontWeight: 600,
                                bgcolor: alpha('#10b981', 0.1), 
                                color: '#10b981'
                              }}
                            />
                          )}
                          {isPast && (
                            <Chip 
                              size="small" 
                              label="Past"
                              sx={{ 
                                height: 26, 
                                fontSize: '0.75rem', 
                                fontWeight: 600,
                                bgcolor: alpha('#94a3b8', 0.1), 
                                color: '#64748b'
                              }}
                            />
                          )}
                          <Chip 
                            size="small" 
                            icon={<People size="14" variant="Bulk" color="#4facfe" />}
                            label={`${client._count.rsvps} RSVPs`}
                            sx={{ 
                              height: 26, 
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              bgcolor: alpha('#4facfe', 0.1), 
                              color: '#4facfe',
                              '& .MuiChip-icon': { ml: 0.5 }
                            }}
                          />
                        </Stack>
                      </Box>

                      {/* Actions */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="Preview Card" arrow>
                          <IconButton 
                            onClick={() => window.open(`/${client.slug}`, '_blank')}
                            sx={{ 
                              width: 40,
                              height: 40,
                              bgcolor: alpha('#a18cd1', 0.08),
                              borderRadius: '12px',
                              '&:hover': { bgcolor: alpha('#a18cd1', 0.15) }
                            }}
                          >
                            <Eye size="20" variant="Bulk" color="#a18cd1" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Builder" arrow>
                          <IconButton 
                            onClick={() => router.push(`/admin/builder?clientId=${client.id}`)}
                            sx={{ 
                              width: 40,
                              height: 40,
                              bgcolor: alpha('#4facfe', 0.08),
                              borderRadius: '12px',
                              '&:hover': { bgcolor: alpha('#4facfe', 0.15) }
                            }}
                          >
                            <Magicpen size="20" variant="Bulk" color="#4facfe" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage RSVP" arrow>
                          <IconButton 
                            onClick={() => router.push(`/admin/rsvp?slug=${client.slug}`)}
                            sx={{ 
                              width: 40,
                              height: 40,
                              bgcolor: alpha(brandColor, 0.08),
                              borderRadius: '12px',
                              '&:hover': { bgcolor: alpha(brandColor, 0.15) }
                            }}
                          >
                            <People size="20" variant="Bulk" color={brandColor} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Dashboard Link" arrow>
                          <IconButton 
                            onClick={() => handleCopyDashboardLink(client.slug)}
                            sx={{ 
                              width: 40,
                              height: 40,
                              bgcolor: alpha('#fbbf24', 0.08),
                              borderRadius: '12px',
                              '&:hover': { bgcolor: alpha('#fbbf24', 0.15) }
                            }}
                          >
                            <Link1 size="20" variant="Bulk" color="#fbbf24" />
                          </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, borderColor: '#f1f5f9' }} />
                        <Tooltip title="Delete" arrow>
                          <IconButton 
                            onClick={() => handleDelete(client)}
                            sx={{ 
                              width: 40,
                              height: 40,
                              bgcolor: alpha('#f43f5e', 0.08),
                              borderRadius: '12px',
                              '&:hover': { bgcolor: alpha('#f43f5e', 0.15) }
                            }}
                          >
                            <Trash size="20" variant="Bulk" color="#f43f5e" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}