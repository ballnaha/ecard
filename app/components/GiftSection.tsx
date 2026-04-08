'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Paper, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DrawIcon from '@mui/icons-material/Draw';
import { getFontFamily, isThai } from '../utils/fontHelper';

export default function GiftSection({ data, primaryColor = '#8e7d5d' }: { data?: any, primaryColor?: string }) {
  const bankDetails = {
    bankName: data?.bankName || 'KASIKORNBANK (KBank)',
    accountNumber: data?.accountNumber || 'xxx-x-x-5678-x',
    accountName: data?.accountName || 'Kamonluk (Bride)'
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
          fontFamily: getFontFamily('Gratitude'),
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
            fontFamily: getFontFamily(data?.title || 'Gifts & Blessings'),
            fontSize: isThai(data?.title || 'Gifts & Blessings') ? { xs: '1.8rem', md: '2.8rem' } : { xs: '3rem', md: '4rem' },
            color: '#1a1a1a',
            fontWeight: isThai(data?.title || 'Gifts & Blessings') ? 600 : 400,
            lineHeight: 1.2
          }}>
            {data?.title || 'Gifts & Blessings'}
          </Typography>
          <Box sx={{ height: '1px', width: '60px', bgcolor: '#8e7d5d', opacity: 0.5, mx: 'auto', mt: 3 }} />
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
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.7)',
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
                      width: '180px', // slightly larger for better readability with logo
                      height: '180px',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      p: 1.5,
                      backgroundColor: '#fff',
                      border: '1px solid rgba(142, 125, 93, 0.1)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src={qrPlaceholder}
                      alt="Wedding Gift QR Code"
                      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    
                    {/* QR Center Initial Overlay */}
                    {bankDetails.accountName && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '42px',
                          height: '42px',
                          bgcolor: '#fff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          border: '2px solid #fff',
                          zIndex: 2
                        }}
                      >
                        <Box sx={{
                          width: '34px',
                          height: '34px',
                          bgcolor: primaryColor,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 500,
                          fontSize: '1.4rem',
                          fontFamily: getFontFamily('Parisienne'),
                          textTransform: 'uppercase'
                        }}>
                          {(bankDetails.accountName.match(/[a-zA-Z]/) || [bankDetails.accountName.charAt(0)])[0].toUpperCase()}
                        </Box>
                      </Box>
                    )}
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
                    fontFamily: '"Prompt", sans-serif',
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
                      fontFamily: '"Prompt", sans-serif',
                      fontSize: '0.75rem',
                      color: 'rgba(0,0,0,0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em'
                    }}>
                      {bankDetails.bankName}
                    </Typography>
                  </Box>
                </Box>
              </Box>


            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
