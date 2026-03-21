'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import CalendarButton from './CalendarButton';

const TARGET_DATE = new Date('2026-05-14T00:00:00').getTime();

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <Box sx={{ 
      textAlign: 'center', 
      minWidth: { xs: '80px', md: '120px' },
      px: 2
    }}>
      <Typography sx={{ 
        fontFamily: '"Playfair Display", serif', 
        fontSize: { xs: '2.5rem', md: '4.5rem' }, 
        color: '#1a1a1a',
        lineHeight: 1,
        fontWeight: 400
      }}>
        {value.toString().padStart(2, '0')}
      </Typography>
      <Typography sx={{ 
        fontFamily: '"Montserrat", sans-serif', 
        fontSize: '0.65rem', 
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#8e7d5d',
        mt: 1,
        fontWeight: 600
      }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 10 }, 
        backgroundColor: '#faf9f6',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Pattern */}
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: 0.03,
        backgroundImage: 'radial-gradient(#8e7d5d 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{ 
            color: '#8e7d5d', 
            letterSpacing: '0.6em', 
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            Counting Down Today
          </Typography>
          <Typography sx={{ 
            fontFamily: '"Bodoni Moda", serif', 
            fontSize: { xs: '2rem', md: '3rem' }, 
            color: '#1a1a1a',
            fontStyle: 'italic'
          }}>
            Until Forever Begins
          </Typography>
        </Box>

        <Stack 
          direction="row" 
          justifyContent="center" 
          alignItems="center" 
          spacing={{ xs: 1, md: 4 }}
          sx={{ mb: 6 }}
        >
          <TimeUnit label="Days" value={timeLeft.days} />
          <Box sx={{ height: '40px', width: '1px', backgroundColor: 'rgba(142,125,93,0.3)', mt: -4 }} />
          <TimeUnit label="Hours" value={timeLeft.hours} />
          <Box sx={{ height: '40px', width: '1px', backgroundColor: 'rgba(142,125,93,0.3)', mt: -4 }} />
          <TimeUnit label="Mins" value={timeLeft.minutes} />
          <Box sx={{ height: '40px', width: '1px', backgroundColor: 'rgba(142,125,93,0.3)', mt: -4 }} />
          <TimeUnit label="Secs" value={timeLeft.seconds} />
        </Stack>

        <Box sx={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Typography sx={{ 
              fontFamily: '"Montserrat", sans-serif', 
              fontSize: '0.7rem', 
              letterSpacing: '0.4em', 
              color: 'rgba(0,0,0,0.4)',
              textTransform: 'uppercase'
            }}>
              MAY 14, 2026 • CHIANG MAI
            </Typography>
          </motion.div>
          
          <CalendarButton />
        </Box>
      </Container>
    </Box>
  );
}
