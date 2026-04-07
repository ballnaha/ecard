'use client';

import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  alpha,
  Paper,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Calendar,
  ArrowRight,
  Heart,
  Eye,
  Magicpen
} from 'iconsax-react';

const brandColor = '#f2a1a1';

interface UpcomingWedding {
  id: string;
  slug: string;
  brideName: string;
  groomName: string;
  eventDate: Date;
}

interface UpcomingWeddingsProps {
  weddings: UpcomingWedding[];
}

export default function UpcomingWeddings({ weddings }: UpcomingWeddingsProps) {
  return (
    <Card elevation={0} sx={{ borderRadius: '24px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="900" color="#1a1a1a" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '12px', background: alpha(brandColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar variant="Bulk" size="20" color={brandColor} />
            </Box>
            Upcoming Weddings
          </Typography>
          <Link href="/admin/clients" style={{ textDecoration: 'none' }}>
            <Button
              endIcon={<ArrowRight size="16" variant="Bold" color="#f2a1a1" />}
              sx={{
                color: brandColor,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                '&:hover': { bgcolor: alpha(brandColor, 0.05) }
              }}
            >
              View All
            </Button>
          </Link>
        </Stack>

        {weddings.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px', border: '1px dashed #e2e8f0', bgcolor: '#fafbfc' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(brandColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Heart variant="Bulk" size="32" color={brandColor} />
            </Box>
            <Typography variant="body1" color="#64748b" fontWeight="600">
              No upcoming weddings scheduled
            </Typography>
            <Typography variant="body2" color="#94a3b8" sx={{ mt: 1 }}>
              Create a new wedding card to get started
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {weddings.map((client) => {
              const eventDate = new Date(client.eventDate);
              const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Paper
                  key={client.id}
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9',
                    bgcolor: '#fff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: alpha(brandColor, 0.3),
                      boxShadow: '0 2px 8px rgba(242, 161, 161, 0.1)'
                    }
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #fff5f5 0%, #ffebeb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      flexShrink: 0
                    }}>
                      <Typography variant="h5" fontWeight="900" color={brandColor} sx={{ lineHeight: 1 }}>
                        {eventDate.getDate()}
                      </Typography>
                      <Typography variant="caption" fontWeight="800" color={brandColor} sx={{ textTransform: 'uppercase', fontSize: '0.6rem', lineHeight: 1 }}>
                        {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                      </Typography>
                      <Typography variant="caption" fontWeight="600" color={brandColor} sx={{ fontSize: '0.55rem', opacity: 0.6, mt: 0.2 }}>
                        {eventDate.getFullYear()}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight="800" color="#1a1a1a" noWrap>
                        {client.brideName} & {client.groomName}
                      </Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                        <Chip
                          size="small"
                          label={`/${client.slug}`}
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: alpha('#a18cd1', 0.1),
                            color: '#8b5cf6'
                          }}
                        />
                        {daysUntil <= 7 && (
                          <Chip
                            size="small"
                            label={`${daysUntil} days`}
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              bgcolor: alpha('#fbbf24', 0.1),
                              color: '#f59e0b'
                            }}
                          />
                        )}
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Preview Card" arrow>
                        <IconButton
                          size="small"
                          onClick={() => window.open(`/${client.slug}`, '_blank')}
                          sx={{
                            bgcolor: alpha('#a18cd1', 0.08),
                            '&:hover': { bgcolor: alpha('#a18cd1', 0.15) }
                          }}
                        >
                          <Eye size="18" variant="Bulk" color="#a18cd1" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Builder" arrow>
                        <Link href={`/admin/builder?clientId=${client.id}`} style={{ textDecoration: 'none' }}>
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: alpha(brandColor, 0.08),
                              '&:hover': { bgcolor: alpha(brandColor, 0.15) }
                            }}
                          >
                            <Magicpen size="18" variant="Bulk" color={brandColor} />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}