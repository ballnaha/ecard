'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

export default function GiftSection() {
  const bankDetails = {
    bankName: 'KASIKORNBANK (KBank)',
    accountNumber: 'xxx-x-x-5678-x',
    accountName: 'Chanya & Thanya'
  };

  const qrPlaceholder = "/simple_qr_mockup_wedding_1774067706323.png";

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            Gifts & Blessings
          </Typography>
          <Typography sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            ของขวัญและคำอวยพร
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Paper elevation={0} sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '32px',
              backgroundColor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(142, 125, 93, 0.1)',
              textAlign: 'center',
              boxShadow: '0 20px 80px rgba(0,0,0,0.03)'
            }}>
              <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: '#333',
                fontStyle: 'italic',
                lineHeight: 1.6,
                mb: 4
              }}>
                "The presence of our family and friends is the greatest gift of all. However, if you wish to honor our new beginning with a gift, a contribution towards our honeymoon would be sincerely appreciated."
              </Typography>

              <Typography sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.6)',
                lineHeight: 1.8,
                mb: 6
              }}>
                การได้เห็นทุกท่านที่รักมาร่วมฉลองในวันเริ่มต้นชีวิตคู่ คือของขวัญที่ล้ำค่าที่สุดสำหรับเรา <br />
                หากท่านมีความประสงค์ที่จะมอบของขวัญเพื่อเป็นสิริมงคลเริ่มต้นชีวิตใหม่ <br />
                เราขอน้อมรับด้วยหัวใจและความขอบคุณอย่างยิ่ง
              </Typography>

              <Stack spacing={4} alignItems="center">
                <Box
                  sx={{
                    width: '240px',
                    height: '240px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(142, 125, 93, 0.1)',
                    p: 1,
                    backgroundColor: '#fff',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
                  }}
                >
                  <Box
                    component="img"
                    src={qrPlaceholder}
                    alt="Wedding Gift QR Code"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                  />
                </Box>

                <Box sx={{ width: '100%' }}>
                  <Divider sx={{ mb: 4, opacity: 0.1 }} />
                  <Typography sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.2rem',
                    color: '#8e7d5d',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    mb: 1
                  }}>
                    {bankDetails.accountName}
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: '1rem',
                    color: '#1a1a1a',
                    letterSpacing: '0.2em',
                    fontWeight: 500,
                    mb: 4
                  }}>
                    {bankDetails.accountNumber}
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em'
                  }}>
                    {bankDetails.bankName}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
