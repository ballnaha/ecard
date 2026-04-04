'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

interface DressCodeData {
  title?: string;
  subtitle?: string;
  colors?: string[]; // Array of hex colors like ['#f472b6', '#8e7d5d']
}

export default function DressCodeSection({ data }: { data?: DressCodeData }) {
  const colors = data?.colors || ['#e0d7c6', '#bbaa99', '#8e7970', '#5c4d44']; // Neutral placeholders
  const title = data?.title || 'DRESS CODE';
  const subtitle = data?.subtitle || 'WE WOULD LOVE TO SEE YOU IN OUR WEDDING THEME';

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#fff', textAlign: 'center' }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <Typography variant="overline" sx={{ color: '#8e7d5d', letterSpacing: '0.6em', fontSize: '0.75rem', mb: 1, display: 'block' }}>
            {title}
          </Typography>
          <Typography sx={{ fontFamily: '"Bodoni Moda", serif', fontSize: { xs: '1.8rem', md: '2.5rem' }, color: '#1a1a1a', fontStyle: 'italic', mb: 2 }}>
            Wedding Theme & Colors
          </Typography>
          <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', mb: 6, textTransform: 'uppercase' }}>
            {subtitle}
          </Typography>

          <Stack direction="row" justifyContent="center" spacing={{ xs: 2, md: 4 }} flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
            {colors.map((color, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                >
                  <Box sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, borderRadius: '50%', backgroundColor: color, border: '4px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', mb: 1.5 }} />
                </motion.div>
                <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
                  {color}
                </Typography>
              </Box>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
