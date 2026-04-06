'use client';

import React from 'react';
import { Box, Container, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GuestWishesForm from '@/app/components/GuestWishesForm';

export default function GuestbookPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.client as string;

  const [clientData, setClientData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/client/${slug}`)
      .then(res => res.json())
      .then(data => {
        setClientData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const fontFamily = clientData?.fontFamily || 'Prompt';
  const primaryColor = clientData?.primaryColor || '#8e7d5d';

  if (loading) return null;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#faf9f6',
        py: { xs: 4, md: 8 },
        backgroundImage: 'radial-gradient(circle at center, rgba(142,125,93,0.03) 0%, transparent 70%)',
        fontFamily: `"${fontFamily}", sans-serif`
      }}
    >
      <Container maxWidth="md">
        <Tooltip title="กลับไปหน้าแรก (Home)">
          <IconButton 
            onClick={() => router.push(`/${params.client}`)} 
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
              color: primaryColor,
              letterSpacing: '0.4em',
              fontSize: '0.85rem',
              mb: 2,
              display: 'block'
            }}>
              Digital Guestbook
            </Typography>
            <Typography sx={{
              fontFamily: '"Parisienne", cursive',
              fontSize: { xs: '3.5rem', md: '5.5rem' },
              color: '#1a1a1a',
              lineHeight: 1,
              mb: 2,
              mt: -1 // Adjust for script font baseline
            }}>
              Wishes & Blessings
            </Typography>
            <Typography sx={{
              fontSize: '1rem',
              color: 'rgba(0,0,0,0.6)',
              fontFamily: `"${fontFamily}", sans-serif`
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
            <GuestWishesForm fontFamily={fontFamily} />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
