'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  MenuItem,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';

export default function RSVPSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: 'yes',
    guests: '1',
    note: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', phone: '', attending: 'yes', guests: '1', note: '' });
    }, 1500);
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
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
          fontFamily: '"Pinyon Script", cursive',
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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="overline" sx={{
            color: '#8e7d5d',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            RSVP
          </Typography>
          <Typography sx={{
            fontFamily: '"Bodoni Moda", serif',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#1a1a1a',
            fontStyle: 'italic',
            lineHeight: 1.2
          }}>
            Join Our Celebration
          </Typography>
          <Typography sx={{
            fontFamily: '"Montserrat", sans-serif',
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
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Full Name / ชื่อ-นามสกุล"
                    name="name"
                    variant="standard"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#8e7d5d' }, '& label.Mui-focused': { color: '#8e7d5d' } }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Phone Number / เบอร์โทรศัพท์"
                    name="phone"
                    variant="standard"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#8e7d5d' }, '& label.Mui-focused': { color: '#8e7d5d' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                    ATTENDANCE / ยืนยันการร่วมงาน
                  </Typography>
                  <RadioGroup
                    row
                    name="attending"
                    value={formData.attending}
                    onChange={handleChange}
                  >
                    <FormControlLabel 
                      value="yes" 
                      control={<Radio sx={{ color: '#8e7d5d', '&.Mui-checked': { color: '#8e7d5d' } }} />} 
                      label={<Typography sx={{ fontSize: '0.9rem' }}>ไปร่วมงาน (Attend)</Typography>} 
                    />
                    <FormControlLabel 
                      value="no" 
                      control={<Radio sx={{ color: '#8e7d5d', '&.Mui-checked': { color: '#8e7d5d' } }} />} 
                      label={<Typography sx={{ fontSize: '0.9rem' }}>ไม่สะดวกไปร่วมงาน (Unable to attend)</Typography>} 
                    />
                  </RadioGroup>
                </Grid>

                {formData.attending === 'yes' && (
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      label="Number of Guests / จำนวนผู้ร่วมงาน"
                      name="guests"
                      variant="standard"
                      value={formData.guests}
                      onChange={handleChange}
                      sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#8e7d5d' }, '& label.Mui-focused': { color: '#8e7d5d' } }}
                    >
                      {[1, 2, 3, 4, 5].map(opt => (
                        <MenuItem key={opt} value={opt}>
                          {opt} {opt === 1 ? 'Person' : 'People'}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Special Note / ข้อความถึงคู่บ่าวสาว"
                    name="note"
                    multiline
                    rows={3}
                    variant="standard"
                    value={formData.note}
                    onChange={handleChange}
                    sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#8e7d5d' }, '& label.Mui-focused': { color: '#8e7d5d' } }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      borderRadius: '50px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      '&:hover': {
                        backgroundColor: '#333',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    {loading ? 'Sending...' : 'Confirm RSVP'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>

        <Typography sx={{ 
          textAlign: 'center', 
          mt: 4, 
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '1.2rem', 
          fontStyle: 'italic',
          color: '#8e7d5d'
        }}>
          Thank you for being a part of our love story.
        </Typography>
      </Container>

      <Snackbar 
        open={submitted} 
        autoHideDuration={6000} 
        onClose={() => setSubmitted(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSubmitted(false)} 
          icon={false}
          sx={{ 
            width: '100%', 
            borderRadius: '50px', 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            color: '#1a1a1a',
            border: '1px solid rgba(142, 125, 93, 0.3)',
            boxShadow: '0 15px 50px rgba(142, 125, 93, 0.15)',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            px: 4,
            py: 1,
            mt: 4,
            '& .MuiAlert-message': {
              textAlign: 'center',
              width: '100%',
              color: '#8e7d5d',
              fontWeight: 600
            },
            '& .MuiAlert-action': {
              color: '#8e7d5d'
            }
          }}
        >
          Thank you! Your RSVP has been sent.
        </Alert>
      </Snackbar>
    </Box>
  );
}
