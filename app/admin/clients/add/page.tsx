'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import { ArrowLeft, Heart, DirectNormal, Calendar } from 'iconsax-react';
import { useRouter } from 'next/navigation';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

export default function AddClient() {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    slug: '',
  });
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'brideName' && !formData.slug ? value.toLowerCase().replace(/\s+/g, '-') :
        name === 'slug' ? value.toLowerCase().replace(/\s+/g, '-') : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) {
      setStatus({ type: 'error', message: 'กรุณาเลือกวันที่จัดงาน' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/admin/client/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventDate: eventDate.toISOString()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create client');

      setStatus({ type: 'success', message: 'ลงทะเบียนสำเร็จ! กำลังพากลับหน้าหลัก...' });
      setTimeout(() => router.push('/admin/clients'), 2000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', pb: 10 }}>
        {/* Header section identical to other pages */}
        <Box sx={{ backgroundColor: '#ffffff', pt: 6, pb: 4 }}>
          <Container maxWidth="lg">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Button
                startIcon={<ArrowLeft size="18" />}
                onClick={() => router.push('/admin/clients')}
                sx={{ color: '#f2a1a1', fontWeight: 700, p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#e89191' } }}
              >
                Back to Dashboard
              </Button>
            </Stack>
            <Typography variant="h3" sx={{ fontFamily: '"Parisienne", cursive', fontWeight: 400, color: '#1a1a1a', fontSize: '3rem' }}>
              Add New Card
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
              Create a new celebration journey
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Paper elevation={0} sx={{
            p: { xs: 4, md: 5 },
            borderRadius: '40px',
            border: '1px solid #f8f8f8',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 50px rgba(242, 161, 161, 0.08)'
          }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="overline" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#f2a1a1', fontWeight: 800, letterSpacing: '0.15em' }}>
                    <Heart size="18" variant="Bulk" color="#f2a1a1" /> LOVEBIRDS INFORMATION
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3
                  }}>
                    <TextField
                      fullWidth label="Bride's Name" name="brideName" required
                      value={formData.brideName} onChange={handleChange}
                      variant="standard"
                      sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#f2a1a1' }, '& label.Mui-focused': { color: '#f2a1a1' } }}
                    />
                    <TextField
                      fullWidth label="Groom's Name" name="groomName" required
                      value={formData.groomName} onChange={handleChange}
                      variant="standard"
                      sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#f2a1a1' }, '& label.Mui-focused': { color: '#f2a1a1' } }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#a18cd1', fontWeight: 800, letterSpacing: '0.15em' }}>
                    <DirectNormal size="18" variant="Bulk" color="#a18cd1" /> INVITATION LINK (SLUG)
                  </Typography>
                  <TextField
                    fullWidth placeholder="e.g. smith-wedding" name="slug" required
                    value={formData.slug} onChange={handleChange}
                    variant="standard"
                    slotProps={{
                      input: {
                        startAdornment: <Typography sx={{ color: '#ccc', mr: 0.5, fontWeight: 300 }}>mywedding.com/</Typography>
                      }
                    }}
                    sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#a18cd1' }, '& label.Mui-focused': { color: '#a18cd1' } }}
                  />
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#f6d365', fontWeight: 800, letterSpacing: '0.15em' }}>
                    <Calendar size="18" variant="Bulk" color="#f6d365" /> CELEBRATION DATE
                  </Typography>
                  <DatePicker
                    value={eventDate}
                    onChange={(newValue) => setEventDate(newValue)}
                    format="DD / MM / YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'standard',
                        sx: { '& .MuiInput-underline:after': { borderBottomColor: '#f6d365' }, '& label.Mui-focused': { color: '#f6d365' } }
                      }
                    }}
                  />
                </Box>

                <Button
                  fullWidth type="submit" variant="contained" disabled={loading}
                  sx={{
                    py: 2,
                    borderRadius: '50px',
                    backgroundColor: '#f2a1a1',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    mt: 2,
                    textTransform: 'none',
                    boxShadow: '0 10px 30px rgba(242, 161, 161, 0.3)',
                    '&:hover': { backgroundColor: '#e89191', boxShadow: '0 15px 40px rgba(242, 161, 161, 0.4)' }
                  }}
                >
                  {loading ? 'Registering...' : 'Create Wedding Card'}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>

        <Snackbar open={!!status} autoHideDuration={4000} onClose={() => setStatus(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={status?.type} sx={{ borderRadius: '50px', width: '100%', px: 4, bgcolor: '#fff', color: '#1a1a1a', border: '1px solid #f5f5f5', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>{status?.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
