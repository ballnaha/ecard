'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const scheduleData = [
  {
    time: '09:09',
    title: 'Engagement Ceremony',
    titleTh: 'พิธีหมั้น',
    description: 'Traditional Thai engagement and khan maak procession.',
    descriptionTh: 'พิธีหมั้นและขบวนขันหมาก'
  },
  {
    time: '10:29',
    title: 'Water Pouring Ceremony',
    titleTh: 'พิธีหลั่งน้ำพระพุทธมนต์',
    description: 'Seeking blessings from parents and respected elders.',
    descriptionTh: 'พิธีหลั่งน้ำพระพุทธมนต์และรับไหว้'
  },
  {
    time: '11:29',
    title: 'Wedding Luncheon',
    titleTh: 'ร่วมรับประทานอาหาร',
    description: 'Celebrating the morning ceremony with a focused lunch.',
    descriptionTh: 'ร่วมรับประทานอาหารกลางวัน'
  },
  {
    time: '18:00',
    title: 'Wedding Reception',
    titleTh: 'ฉลองมงคลสมรส',
    description: 'Grand reception filled with joy, music, and celebration.',
    descriptionTh: 'ร่วมฉลองมงคลสมรส'
  }
];

export default function ScheduleSection() {
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
          bottom: '5%',
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

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{
            color: '#8e7d5d',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            The Schedule
          </Typography>
          <Typography sx={{
            fontFamily: '"Bodoni Moda", serif',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#1a1a1a',
            fontStyle: 'italic',
            lineHeight: 1.2
          }}>
            Our Special Moment
          </Typography>
          <Typography sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            กําหนดการงานมงคลสมรส
          </Typography>
        </Box>

        <Stack spacing={0}>
          {scheduleData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Grid container spacing={2} sx={{
                py: { xs: 3, md: 4 },
                borderBottom: index !== scheduleData.length - 1 ? '1px solid rgba(142, 125, 93, 0.1)' : 'none',
                alignItems: 'center'
              }}>
                <Grid size={{ xs: 3, sm: 3 }}>
                  <Typography sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: { xs: '1.4rem', md: '2.5rem' },
                    color: '#8e7d5d',
                    fontWeight: 300,
                    lineHeight: 1
                  }}>
                    {item.time}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 9, sm: 9 }}>
                  <Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} alignItems="baseline">
                      <Typography sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: { xs: '1.1rem', md: '1.4rem' },
                        color: '#1a1a1a',
                        fontWeight: 500
                      }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#8e7d5d',
                        fontWeight: 600,
                        fontStyle: 'italic'
                      }}>
                        {item.titleTh}
                      </Typography>
                    </Stack>
                    <Typography sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      lineHeight: 1.5,
                      color: 'rgba(0,0,0,0.5)',
                      maxWidth: '450px',
                      mt: 0.5
                    }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
