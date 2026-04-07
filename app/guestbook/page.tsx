'use client';

import React from 'react';
import { Box, Container, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GuestWishesForm from '../components/GuestWishesForm';

export default function GuestbookPage() {
  const router = useRouter();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#faf9f6', // matches typical wedding themes
        py: { xs: 4, md: 8 },
        backgroundImage: 'radial-gradient(circle at center, rgba(142,125,93,0.03) 0%, transparent 70%)'
      }}
    >
      <Container maxWidth="md">
        <Tooltip title="กลับไปหน้าแรก (Home)">
          <IconButton 
            onClick={() => router.push('/')} 
            sx={{ mb: 4, bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#f0f0f0' } }}
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="overline" sx={{
              color: '#8e7d5d',
              letterSpacing: '0.4em',
              fontSize: '0.85rem',
              mb: 2,
              display: 'block'
            }}>
              Digital Guestbook
            </Typography>
            <Typography sx={{
              fontFamily: '"Bodoni Moda", "Playfair Display", "Prompt", serif',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#1a1a1a',
              fontStyle: 'italic',
              lineHeight: 1.2,
              mb: 2
            }}>
              Wishes & Blessings
            </Typography>
            <Typography sx={{
              fontFamily: '"Prompt", "Montserrat", sans-serif',
              fontSize: '1rem',
              color: 'rgba(0,0,0,0.6)',
            }}>
              ร่วมเขียนคำอวยพรและแนบรูปภาพเป็นที่ระลึกให้คู่บ่าวสาว
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.9)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '24px', 
              boxShadow: '0 20px 60px rgba(0,0,0,0.04)',
              border: '1px solid rgba(142, 125, 93, 0.1)',
              overflow: 'hidden'
            }}
          >
            <GuestWishesForm clientId="demo-guestbook" />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
