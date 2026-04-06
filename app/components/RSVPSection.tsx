'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TickCircle } from 'iconsax-react';
import { getFontFamily, isThai } from '../utils/fontHelper';

export default function RSVPSection({ clientId, primaryColor = '#8e7d5d' }: { clientId?: string, primaryColor?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: 'yes',
    guestCount: '1',
    note: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      console.error('Missing clientId for RSVP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          ...formData
        }),
      });

      if (!response.ok) throw new Error('Failed to submit RSVP');

      setSubmitted(true);
      setFormData({ name: '', phone: '', attending: 'yes', guestCount: '1', note: '' });
    } catch (error) {
      console.error('RSVP Error:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: '#fafaf9',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background text */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          fontSize: { xs: '6rem', md: '12rem' },
          fontFamily: getFontFamily('Celebration'),
          color: 'rgba(142, 125, 93, 0.04)',
          whiteSpace: 'nowrap',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        Celebration
      </Typography>

      {/* Decorative background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(142, 125, 93, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="overline" sx={{
            color: primaryColor,
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            RSVP
          </Typography>
          <Typography sx={{
            fontFamily: getFontFamily('Join Our Celebration'),
            fontSize: isThai('Join Our Celebration') ? { xs: '2rem', md: '3.2rem' } : { xs: '3.2rem', md: '4.5rem' },
            color: '#1a1a1a',
            fontWeight: isThai('Join Our Celebration') ? 600 : 400,
            lineHeight: 1.2
          }}>
            Join Our Celebration
          </Typography>
          <Typography sx={{
            fontFamily: '"Prompt", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            กรุณาตอบกลับเพื่อยืนยันการร่วมงาน
          </Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Paper elevation={0} sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '24px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(142, 125, 93, 0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
          }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <TextField
                fullWidth
                label="Full Name / ชื่อ-นามสกุล"
                name="name"
                variant="standard"
                required
                value={formData.name}
                onChange={handleChange}
                sx={{ '& .MuiInput-underline:after': { borderBottomColor: 'var(--primary-color)' }, '& label.Mui-focused': { color: 'var(--primary-color)' } }}
              />

              <TextField
                fullWidth
                label="Phone Number / เบอร์โทรศัพท์"
                name="phone"
                variant="standard"
                required
                value={formData.phone}
                onChange={handleChange}
                sx={{ '& .MuiInput-underline:after': { borderBottomColor: 'var(--primary-color)' }, '& label.Mui-focused': { color: 'var(--primary-color)' } }}
              />

              <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2, fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>
                    ATTENDANCE / ยืนยันการร่วมงาน
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
                      <Box
                        component={motion.div}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFormData(prev => ({ ...prev, attending: 'yes' }))}
                        sx={{
                          p: 2.5,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '2px solid',
                          borderColor: formData.attending === 'yes' ? primaryColor : 'rgba(0, 0, 0, 0.06)',
                          bgcolor: formData.attending === 'yes' ? `${primaryColor}15` : 'white', // 15 = hex for 8% opacity
                          color: formData.attending === 'yes' ? primaryColor : 'rgba(0,0,0,0.4)',
                          boxShadow: formData.attending === 'yes' ? `0 10px 25px ${primaryColor}20` : 'none',
                          '&:hover': { borderColor: primaryColor, bgcolor: `${primaryColor}08` }
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>ไปร่วมงาน</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Attend</Typography>
                      </Box>
                      <Box
                        component={motion.div}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFormData(prev => ({ ...prev, attending: 'no' }))}
                        sx={{
                          p: 2.5,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '2px solid',
                          borderColor: formData.attending === 'no' ? '#f2a1a1' : 'rgba(0, 0, 0, 0.06)',
                          bgcolor: formData.attending === 'no' ? '#f2a1a115' : 'white',
                          color: formData.attending === 'no' ? '#f2a1a1' : 'rgba(0,0,0,0.4)',
                          boxShadow: formData.attending === 'no' ? '0 10px 25px rgba(242, 161, 161, 0.2)' : 'none',
                          '&:hover': { borderColor: '#f2a1a1', bgcolor: '#f2a1a108' }
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>ไม่สะดวกไปร่วมงาน</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unable to attend</Typography>
                      </Box>
                  </Box>
              </Box>

              <AnimatePresence mode="wait">
                {formData.attending === 'yes' && (
                  <Box>
                    <motion.div
                      key="guest-count-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2, fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600, mt: 1 }}>
                        NUMBER OF GUESTS / จำนวนผู้ร่วมงาน
                      </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(5, 1fr)', 
                        gap: { xs: 1, sm: 1.5 },
                        mb: 2 
                      }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <Box
                            key={num}
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({ ...prev, guestCount: num.toString() }))}
                            sx={{
                              height: { xs: 45, md: 55 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              fontSize: '1.1rem',
                              fontFamily: '"Prompt", sans-serif',
                              fontWeight: 700,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              border: '2px solid',
                              borderColor: formData.guestCount === num.toString() ? primaryColor : 'rgba(0, 0, 0, 0.06)',
                              bgcolor: formData.guestCount === num.toString() ? primaryColor : 'white',
                              color: formData.guestCount === num.toString() ? '#fff' : 'rgba(0,0,0,0.7)',
                              boxShadow: formData.guestCount === num.toString() ? `0 10px 20px ${primaryColor}25` : 'none',
                              '&:hover': {
                                borderColor: primaryColor,
                                bgcolor: formData.guestCount === num.toString() ? primaryColor : `${primaryColor}05`,
                              }
                            }}
                          >
                            {num}
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'rgba(142, 125, 93, 0.5)', textAlign: 'center', display: 'block', mt: 1, mb: 1, fontStyle: 'italic' }}>
                        ระบุจำนวนคน (Number of persons)
                      </Typography>
                    </motion.div>
                  </Box>
                )}
              </AnimatePresence>

              <TextField
                fullWidth
                label="Special Note / ข้อความถึงคู่บ่าวสาว"
                name="note"
                multiline
                rows={3}
                variant="standard"
                value={formData.note}
                onChange={handleChange}
                sx={{ '& .MuiInput-underline:after': { borderBottomColor: primaryColor }, '& label.Mui-focused': { color: primaryColor } }}
              />

              <Box sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    backgroundColor: primaryColor,
                    color: '#fff',
                    borderRadius: '50px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    boxShadow: `0 10px 30px ${primaryColor}25`,
                    '&:hover': {
                      backgroundColor: primaryColor,
                      filter: 'brightness(0.9)',
                      boxShadow: `0 15px 40px ${primaryColor}35`
                    }
                  }}
                >
                  {loading ? 'Sending...' : 'Confirm RSVP'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <Typography sx={{
          textAlign: 'center',
          mt: 4,
          fontFamily: getFontFamily('Thank you for being a part of our love story.'),
          fontSize: isThai('Thank you for being a part of our love story.') ? '1.1rem' : '1.45rem',
          fontWeight: isThai('Thank you for being a part of our love story.') ? 500 : 400,
          color: 'var(--primary-color)'
        }}>
          Thank you for being a part of our love story.
        </Typography>
      </Container>

      <Snackbar
        open={submitted}
        autoHideDuration={6000}
        onClose={() => setSubmitted(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert
          onClose={() => setSubmitted(false)}
          severity="success"
          variant="filled"
          icon={<Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}><motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}><TickCircle size="24" color="#fff" variant="Bulk" /></motion.div></Box>}
          sx={{
            width: '100%',
            borderRadius: '50px',
            backgroundColor: '#10b981', // Premium Emerald Green
            color: '#fff',
            px: 4,
            py: 1,
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.25)',
            fontFamily: '"Prompt", sans-serif',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            },
            '& .MuiAlert-action': {
              color: '#fff'
            }
          }}
        >
          ลงทะเบียนสำเร็จ! ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเราครับ
        </Alert>
      </Snackbar>
    </Box>
  );
}
