'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const themeColors = [
  { hex: '#d4a5a5', name: 'Dusty Rose' },
  { hex: '#9eac8a', name: 'Sage Green' },
  { hex: '#e1cfb4', name: 'Champagne' },
];

export default function ColorThemeSection() {
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
          top: '5%',
          left: '-5%',
          fontSize: { xs: '6rem', md: '12rem' },
          fontFamily: '"Parisienne", "Prompt", cursive',
          color: 'rgba(142, 125, 93, 0.04)',
          whiteSpace: 'nowrap',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        Elegance
      </Typography>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{
            color: '#8e7d5d',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            Dress Code
          </Typography>
          <Typography sx={{
            fontFamily: '"Bodoni Moda", "Prompt", serif',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#1a1a1a',
            fontStyle: 'italic',
            lineHeight: 1.2
          }}>
            Our Color Palette
          </Typography>
          <Typography sx={{
            fontFamily: '"Prompt", "Montserrat", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            ธีมแต่งกายและสีงานแต่ง
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={{ xs: 2, md: 4 }}
            sx={{ flexWrap: 'wrap', gap: 2, mb: 8 }}
          >
            {themeColors.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    width: { xs: '60px', md: '80px' },
                    height: { xs: '60px', md: '80px' },
                    borderRadius: '50%',
                    backgroundColor: item.hex,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    border: '4px solid white',
                    mb: 1
                  }}
                />
                <Typography sx={{
                  fontFamily: '"Prompt", "Montserrat", sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(0,0,0,0.4)',
                  textTransform: 'uppercase'
                }}>
                  {item.name}
                </Typography>
              </motion.div>
            ))}
          </Stack>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Typography sx={{
              fontFamily: '"Cormorant Garamond", "Prompt", serif',
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              color: '#333',
              lineHeight: 1.5,
              mb: 3,
              fontStyle: 'italic'
            }}>
              "We would love for you to celebrate this day with us in our chosen color palette. We kindly request that guests avoid wearing black or dark tones."
            </Typography>

            <Typography sx={{
              fontFamily: '"Prompt", "Montserrat", sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'rgba(0,0,0,0.4)',
              textTransform: 'uppercase'
            }}>
              THANK YOU FOR YOUR RESPECT AND LOVE
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
