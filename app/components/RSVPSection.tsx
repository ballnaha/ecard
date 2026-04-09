'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  alpha,
  Stack
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

  const [isReturning, setIsReturning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previousData, setPreviousData] = useState<any>(null);

  React.useEffect(() => {
    if (!clientId) return;
    const saved = localStorage.getItem(`rsvp_data_${clientId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreviousData(parsed);
        setIsReturning(true);
      } catch (e) {
        console.error('Error parsing saved RSVP data');
      }
    }
  }, [clientId]);

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
          ...formData,
          guestCount: formData.attending === 'no' ? '0' : formData.guestCount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          setErrorMsg(errorData.error || 'เบอร์โทรศัพท์นี้ได้ลงทะเบียนไว้แล้วครับ');
          setErrorOpen(true);
          return;
        }
        throw new Error('Failed to submit RSVP');
      }

      // Save to local storage for returning visit
      localStorage.setItem(`rsvp_data_${clientId}`, JSON.stringify({
        attending: formData.attending,
        guestCount: formData.guestCount,
        name: formData.name,
        phone: formData.phone,
        note: formData.note
      }));
      setPreviousData(formData);
      setIsReturning(true);

      setSubmitted(true);
      // Scroll back to RSVP section title
      setTimeout(() => {
        const rsvpEl = document.getElementById('rsvp');
        if (rsvpEl) {
          const topOffset = rsvpEl.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: topOffset - 2, behavior: 'smooth' });
        }
      }, 100);
      // Delay form collapse so notification appears first (reduces layout jank)
      setTimeout(() => {
        setShowForm(false);
        setFormData({ name: '', phone: '', attending: 'yes', guestCount: '1', note: '' });
      }, 300);
    } catch (error) {
      console.error('RSVP Error:', error);
      setErrorMsg('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Auto-dismiss notifications
  React.useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  React.useEffect(() => {
    if (errorOpen) {
      const timer = setTimeout(() => setErrorOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorOpen]);

  return (
    <>
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
          <Box sx={{ height: '1px', width: '60px', bgcolor: '#8e7d5d', opacity: 0.5, mx: 'auto', mt: 3 }} />
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
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        >
          <Paper elevation={0} sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Increased opacity
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 25px 65px rgba(0,0,0,0.05)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: '32px',
              padding: '1.5px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%, transparent 60%, rgba(142,125,93,0.1) 100%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              pointerEvents: 'none',
              zIndex: 1
            }
          }}>
            {isReturning && previousData && (
              <Box sx={{ mb: 4, p: 3, bgcolor: alpha(primaryColor, 0.05), borderRadius: '24px', border: '1px dashed', borderColor: alpha(primaryColor, 0.3), textAlign: 'center' }}>
                <Typography sx={{ color: primaryColor, fontWeight: 700, mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                  สวัสดีครับ คุณ{previousData.name}
                </Typography>
                <Typography sx={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', mb: 2, fontFamily: '"Prompt", sans-serif' }}>
                  เราได้รับข้อมูลการลงทะเบียนของคุณแล้ว:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ px: 2, py: 1, bgcolor: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>สถานะ</Typography>
                    <Typography sx={{ color: previousData.attending === 'yes' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                      {previousData.attending === 'yes' ? 'ไปร่วมงาน' : 'ไม่สะดวกไป'}
                    </Typography>
                  </Box>
                  {previousData.attending === 'yes' && (
                    <Box sx={{ px: 2, py: 1, bgcolor: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>จำนวน</Typography>
                      <Typography sx={{ color: primaryColor, fontWeight: 700 }}>{previousData.guestCount} ท่าน</Typography>
                    </Box>
                  )}
                </Box>

                {!showForm && (
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.75rem', fontStyle: 'italic', mb: 2 }}>
                      * คุณสามารถแก้ไขข้อมูล หรือลงทะเบียนเพิ่มได้ครับ
                    </Typography>
                    <Stack direction="row" spacing={1.5} justifyContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setFormData({
                            name: previousData.name,
                            phone: previousData.phone || '',
                            attending: previousData.attending,
                            guestCount: previousData.guestCount,
                            note: previousData.note || ''
                          });
                          setShowForm(true);
                        }}
                        sx={{
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          borderColor: primaryColor,
                          color: primaryColor,
                          textTransform: 'none',
                          fontWeight: 500,
                          fontFamily: '"Prompt", sans-serif'
                        }}
                      >
                        แก้ไขข้อมูล (Edit)
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setFormData({ name: '', phone: '', attending: 'yes', guestCount: '1', note: '' });
                          setShowForm(true);
                        }}
                        sx={{
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          bgcolor: primaryColor,
                          textTransform: 'none',
                          fontFamily: '"Prompt", sans-serif',
                          color: '#fff',
                          fontWeight: 500,
                          '&:hover': { bgcolor: primaryColor, filter: 'brightness(0.9)' }
                        }}
                      >
                        ลงทะเบียนเพิ่ม (Add Another)
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            <AnimatePresence>
              {(!isReturning || showForm) && (
                <motion.div
                  key="rsvp-form"
                  initial={isReturning ? { opacity: 0, height: 0 } : false}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div id="rsvp-form-top" />
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <TextField
                id="rsvp-name"
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
                id="rsvp-phone"
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
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, attending: 'yes' }))}
                    sx={{
                      p: 2.5,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: formData.attending === 'yes' ? primaryColor : 'rgba(0, 0, 0, 0.06)',
                      bgcolor: formData.attending === 'yes' ? `${primaryColor}15` : 'white',
                      color: formData.attending === 'yes' ? primaryColor : 'rgba(0,0,0,0.4)',
                      boxShadow: formData.attending === 'yes' ? `0 10px 25px ${primaryColor}20` : 'none',
                      transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>ไปร่วมงาน</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Attend</Typography>
                  </Box>
                  <Box
                    component={motion.div}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, attending: 'no' }))}
                    sx={{
                      p: 2.5,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: formData.attending === 'no' ? '#f2a1a1' : 'rgba(0, 0, 0, 0.06)',
                      bgcolor: formData.attending === 'no' ? '#f2a1a115' : 'white',
                      color: formData.attending === 'no' ? '#f2a1a1' : 'rgba(0,0,0,0.4)',
                      boxShadow: formData.attending === 'no' ? '0 10px 25px rgba(242, 161, 161, 0.2)' : 'none',
                      transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>ไม่สะดวกไปร่วมงาน</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unable to attend</Typography>
                  </Box>
                </Box>
              </Box>

              <AnimatePresence>
                {formData.attending === 'yes' && (
                  <motion.div
                    key="guest-count-section"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
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
                )}
              </AnimatePresence>

              <TextField
                id="rsvp-note"
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
                </motion.div>
              )}
            </AnimatePresence>
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
    </Box>

      {/* Success/Error Notifications - rendered via Portal to escape overflow:hidden */}
      {typeof document !== 'undefined' && ReactDOM.createPortal(
        <AnimatePresence>
          {submitted && (
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed',
                top: 24,
                left: 0,
                right: 0,
                zIndex: 99999,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Alert
                onClose={() => setSubmitted(false)}
                severity="success"
                variant="filled"
                icon={<TickCircle size="24" color="#fff" variant="Bulk" />}
                sx={{
                  borderRadius: '50px',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  width: '90%',
                  maxWidth: 420,
                  pointerEvents: 'auto',
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.35)',
                  fontFamily: '"Prompt", sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '& .MuiAlert-action': { color: '#fff' }
                }}
              >
                ลงทะเบียนสำเร็จ! ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเราครับ
              </Alert>
            </motion.div>
          )}
          {errorOpen && (
            <motion.div
              key="rsvp-error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed',
                top: 24,
                left: 0,
                right: 0,
                zIndex: 99999,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Alert
                onClose={() => setErrorOpen(false)}
                severity="error"
                variant="filled"
                sx={{
                  borderRadius: '50px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  width: '90%',
                  maxWidth: 420,
                  pointerEvents: 'auto',
                  boxShadow: '0 20px 40px rgba(239, 68, 68, 0.35)',
                  fontFamily: '"Prompt", sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '& .MuiAlert-action': { color: '#fff' }
                }}
              >
                {errorMsg}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
