'use client';

import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import { changePassword } from './actions';

export default function SettingsPage() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(''); 
    setSuccess('');
    
    const res = await changePassword(formData);
    
    if (res?.error) setError(res.error);
    if (res?.success) {
      setSuccess('เปลี่ยนแปลงรหัสผ่านสำเร็จ! กรุณาจดจำรหัสผ่านใหม่ไว้ให้ดีครับ');
      formData.set('currentPassword', '');
      formData.set('newPassword', '');
    }
    
    setLoading(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="#1a1a1a" sx={{ mb: 0.5 }}>ตั้งค่าระบบ (Settings)</Typography>
        <Typography variant="body1" color="text.secondary">จัดการความปลอดภัยและตั้งค่าบัญชีแอดมินสำหรับ e-card</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: {xs: 3, md: 4}, borderRadius: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#333' }}>
              เปลี่ยนรหัสผ่าน
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
              รหัสผ่านของคุณจะถูกเข้ารหัสผ่านและบันทึกสู่ Database อย่างปลอดภัย
            </Typography>

            <form action={handleSubmit}>
              <TextField 
                fullWidth 
                type="password" 
                name="currentPassword" 
                label="รหัสผ่านปัจจุบัน" 
                variant="outlined"
                sx={{ mb: 3 }}
              />
              <TextField 
                fullWidth 
                type="password" 
                name="newPassword" 
                label="รหัสผ่านใหม่" 
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {error && <Typography color="error" variant="body2" sx={{ mb: 2, fontWeight: 500 }}>{error}</Typography>}
              {success && <Typography color="success.main" variant="body2" sx={{ mb: 2, fontWeight: 500 }}>{success}</Typography>}

              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 1, fontWeight: 600, bgcolor: '#111216', '&:hover': { bgcolor: '#2b2c33' } }}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
