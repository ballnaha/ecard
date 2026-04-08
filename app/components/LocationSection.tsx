'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Map as MapIcon } from 'iconsax-react';
import { getFontFamily, isThai } from '../utils/fontHelper';

export interface LocationData {
  venueName?: string;
  venueAddress?: string;
  googleMapExternal?: string;
  googleMapEmbed?: string;
}

export default function LocationSection({ data }: { data?: LocationData }) {
  const mapUrl = data?.googleMapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.2435422830887!2d100.8809428!3d12.95627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102beab977fc641%3A0x67ee1c742cf6b5e0!2sCape%20Dara%20Resort%20Pattaya!5e0!3m2!1sen!2sth!4v1711000000000!5m2!1sen!2sth";
  const googleMapsLink = data?.googleMapExternal || "https://www.google.com/maps/search/?api=1&query=Cape+Dara+Resort+Pattaya";

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 8 }, // Decreased padding for more compact layout
        backgroundColor: '#ffffff', // Changed to white for contrast
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Background Decoration */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(142, 125, 93, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{
            color: '#8e7d5d',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block',
            fontWeight: 400
          }}>
            THE VENUE
          </Typography>
          <Typography sx={{
            fontFamily: getFontFamily('Location & Map'),
            fontSize: isThai('Location & Map') ? { xs: '2.5rem', md: '3.5rem' } : { xs: '3.5rem', md: '5rem' },
            color: '#1a1a1a',
            fontWeight: isThai('Location & Map') ? 600 : 400,
            lineHeight: 1.2
          }}>
            Location & Map
          </Typography>
          <Box sx={{ height: '1px', width: '60px', bgcolor: '#8e7d5d', opacity: 0.5, mx: 'auto', mt: 3 }} />
          <Typography sx={{
            fontFamily: '"Prompt", sans-serif',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            สถานที่จัดงานและแผนที่
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center'
        }}>
          {/* Venue Info */}
          <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 45%' }, width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography sx={{
                fontFamily: 'Prompt',
                fontSize: isThai(data?.venueName || "Cape Dara Resort Pattaya") ? { xs: '2rem', md: '3.2rem' } : { xs: '2.5rem', md: '3.5rem' },
                color: '#1a1a1a',
                mb: 1,
                fontWeight: isThai(data?.venueName || "Cape Dara Resort Pattaya") ? 600 : 400,
                lineHeight: 1.2
              }}>
                {data?.venueName || "Cape Dara Resort Pattaya"}
              </Typography>

              <Box sx={{ width: '80px', height: '2px', bgcolor: '#8e7d5d', mb: 4, mx: { xs: 'auto', md: 0 } }} />

              <Typography sx={{
                fontFamily: '"Prompt", sans-serif',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(0,0,0,0.6)',
                mb: 6,
                maxWidth: { xs: '100%', md: '90%' },
                whiteSpace: 'pre-line' // Preserve line breaks
              }}>
                {data?.venueAddress || `256 Dara Beach, Soi 20, Pattaya-Naklua Road,\nPattaya City, Bang Lamung District, Chonburi 20150\nเมืองพัทยา อำเภอบางละมุง ชลบุรี 20150`}
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<MapIcon size={20} variant="Bold" color="currentColor" />}
                href={googleMapsLink}
                target="_blank"
                sx={{
                  borderRadius: '12px',
                  px: 5,
                  py: 2,
                  bgcolor: '#1a1a1a', // Black button for premium feel
                  color: '#fff',
                  fontFamily: '"Prompt", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: '#333',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Open in Google Maps
              </Button>
            </motion.div>
          </Box>

          {/* Map */}
          <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 auto' }, width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '32px',
                  overflow: 'hidden',
                  height: { xs: '350px', md: '550px' },
                  boxShadow: '0 30px 70px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(142, 125, 93, 0.12)',
                  position: 'relative'
                }}
              >
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
