'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Paper, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DrawIcon from '@mui/icons-material/Draw';

export default function GiftSection({ data }: { data?: any }) {
  const bankDetails = {
    bankName: data?.bankName || 'KASIKORNBANK (KBank)',
    accountNumber: data?.accountNumber || 'xxx-x-x-5678-x',
    accountName: data?.accountName || 'Kamonluk'
  };

  const qrPlaceholder = data?.qrCode || "/simple_qr_mockup_wedding_1774067706323.png";

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background text */}
      <Typography
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          fontSize: { xs: '6rem', md: '12rem' },
          fontFamily: '"Pinyon Script", cursive',
          color: 'rgba(142, 125, 93, 0.04)',
          whiteSpace: 'nowrap',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        Blessings
      </Typography>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="overline" sx={{
            color: '#8e7d5d',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            Wedding Gift
          </Typography>
          <Typography sx={{
            fontFamily: '"Bodoni Moda", serif',
            fontSize: { xs: '2rem', md: '3rem' },
            color: '#1a1a1a',
            fontStyle: 'italic',
            lineHeight: 1.2
          }}>
            {data?.title || 'Gifts & Blessings'}
          </Typography>
          <Typography sx={{
            fontFamily: '"Prompt", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            {data?.subtitle || 'ของขวัญและคำอวยพร'}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 5 },
              borderRadius: '32px',
              backgroundColor: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(142, 125, 93, 0.1)',
              textAlign: 'center',
              boxShadow: '0 15px 50px rgba(0,0,0,0.02)'
            }}>
              <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                color: '#333',
                fontStyle: 'italic',
                lineHeight: 1.5,
                mb: 1.5
              }}>
                {data?.message || '"The presence of our family and friends is the greatest gift of all. However, if you wish to honor our new beginning with a gift, a contribution would be sincerely appreciated."'}
              </Typography>

              <Typography sx={{
                fontFamily: '"Prompt", sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(0,0,0,0.5)',
                lineHeight: 1.6,
                mb: 4
              }}>
                หากท่านมีความประสงค์ที่จะมอบของขวัญเพื่อเป็นสิริมงคลเริ่มต้นชีวิตใหม่ <br />
                เราขอน้อมรับด้วยหัวใจและความขอบคุณอย่างยิ่ง
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: data?.qrCode ? 'row' : 'column' }, 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: { xs: 4, md: 8 },
                mb: 2
              }}>
                {/* QR Code */}
                {data?.qrCode && (
                  <Box
                    sx={{
                      width: '160px',
                      height: '160px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      p: 1.5,
                      backgroundColor: '#fff',
                      border: '1px solid rgba(142, 125, 93, 0.08)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Box
                      component="img"
                      src={data.qrCode}
                      alt="Wedding Gift QR Code"
                      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                )}

                {/* Bank Details */}
                <Box sx={{ textAlign: { xs: 'center', md: data?.qrCode ? 'left' : 'center' } }}>
                  <Typography sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.15rem',
                    color: '#8e7d5d',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    mb: 0.5
                  }}>
                    {bankDetails.accountName}
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: '1.05rem',
                    color: '#1a1a1a',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                    mb: 2
                  }}>
                    {bankDetails.accountNumber}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: data?.qrCode ? 'flex-start' : 'center' }, gap: 1.5 }}>
                    <Divider sx={{ width: '20px', borderColor: 'rgba(142, 125, 93, 0.3)' }} />
                    <Typography sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: '0.65rem',
                      color: 'rgba(0,0,0,0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em'
                    }}>
                      {bankDetails.bankName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mt: 5 }}>
                <Button 
                  LinkComponent={Link} 
                  href="/guestbook"
                  variant="outlined" 
                  startIcon={<DrawIcon />}
                  sx={{ 
                    borderRadius: '40px', 
                    px: 3, 
                    py: 1.2,
                    borderColor: 'rgba(142, 125, 93, 0.4)',
                    color: '#8e7d5d',
                    textTransform: 'none',
                    fontFamily: '"Prompt", sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#8e7d5d',
                      backgroundColor: 'rgba(142, 125, 93, 0.05)'
                    }
                  }}
                >
                  ส่งคำอวยพร (Digital Guestbook)
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
