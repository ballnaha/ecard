'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { getFontFamily } from '../utils/fontHelper';

interface DressCodeData {
  title?: string;
  subtitle?: string;
  colors?: string[]; // Array of hex colors like ['#f2a1a1', '#8e7d5d']
}

export default function DressCodeSection({ data }: { data?: DressCodeData }) {
  const colors = data?.colors || ['#e0d7c6', '#bbaa99', '#8e7970', '#5c4d44']; // Neutral placeholders
  const title = data?.title || 'DRESS CODE';
  const subtitle = data?.subtitle || 'WE WOULD LOVE TO SEE YOU IN OUR WEDDING THEME';

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#fff', textAlign: 'center' }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <Typography variant="overline" sx={{
            color: 'var(--primary-color, #8e7d5d)',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 1,
            display: 'block',
            fontFamily: '"Prompt", sans-serif',
            fontWeight: 400
          }}>
            {title}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--script-font, "Parisienne", cursive)', fontSize: { xs: '2.2rem', md: '3.2rem' }, color: '#1a1a1a', fontStyle: 'italic', mb: 1 }}>
            Wedding Theme & Colors
          </Typography>
          <Box sx={{ height: '1px', width: '60px', bgcolor: '#8e7d5d', opacity: 0.5, mx: 'auto', mt: 2, mb: 3 }} />
          <Typography sx={{
            fontFamily: '"Prompt", sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mb: 6,
            textTransform: 'uppercase'
          }}>
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
                  <Box sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, borderRadius: '50%', backgroundColor: color, border: '4px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                </motion.div>
              </Box>            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
