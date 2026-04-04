'use client';

import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง');
        setLoading(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่ภายหลัง');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
      <Paper sx={{ p: { xs: 4, md: 5 }, width: '100%', maxWidth: 450, borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
          E-Card System Portal
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
          กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบจัดการหลังบ้าน
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="ชื่อผู้ใช้งาน (Username)"
            variant="outlined"
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="รหัสผ่าน (Password)"
            variant="outlined"
            sx={{ mb: 3 }}
            error={!!error}
            helperText={error}
            disabled={loading}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.8,
              bgcolor: '#0f172a',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              color: 'white',
              '&:hover': {
                bgcolor: '#1e293b',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                transform: 'translateY(-1px)'
              },
              '&.Mui-disabled': { bgcolor: '#94a3b8', color: '#f8fafc' }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In to Portal'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
