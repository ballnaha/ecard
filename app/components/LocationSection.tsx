'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Map as MapIcon } from 'iconsax-react';

export default function LocationSection() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.657512297121!2d98.998492!3d18.799797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3007f3521d91%3A0xe21689104084bd2e!2sCross%20Chiang%20Mai%20Riverside!5e0!3m2!1sen!2sth!4v1711000000000!5m2!1sen!2sth";
  const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=Cross+Chiang+Mai+Riverside";

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
      {/* Decorative Background Decoration */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(142, 125, 93, 0.03) 0%, transparent 70%)',
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
            The Venue
          </Typography>
          <Typography sx={{
            fontFamily: '"Bodoni Moda", serif',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#1a1a1a',
            fontStyle: 'italic',
            lineHeight: 1.2
          }}>
            Our Wedding Location
          </Typography>
          <Typography sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            สถานที่จัดงานมงคลสมรส
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          alignItems: 'center'
        }}>
          {/* Venue Info */}
          <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 40%' }, width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                color: '#1a1a1a',
                mb: 2,
                fontWeight: 500
              }}>
                Cross Chiang Mai Riverside
              </Typography>
              <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.2rem',
                color: '#8e7d5d',
                mb: 4,
                fontStyle: 'italic',
                fontWeight: 600
              }}>
                Chiang Mai, Thailand
              </Typography>

              <Typography sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '0.9rem',
                lineHeight: 1.8,
                color: 'rgba(0,0,0,0.6)',
                mb: 6,
                maxWidth: { xs: '100%', md: '400px' }
              }}>
                369/1 Charoenraj Road, Wat Ket, <br />
                Amphoe Muang, Chiang Mai 50000 <br />
                อำเภอเมือง จังหวัดเชียงใหม่ 50000
              </Typography>

              <Button
                variant="outlined"
                size="large"
                startIcon={<MapIcon size={20} variant="Outline" color="#8e7d5d" />}
                href={googleMapsLink}
                target="_blank"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  color: '#8e7d5d',
                  borderColor: 'rgba(142, 125, 93, 0.4)',
                  fontFamily: '"Montserrat", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#8e7d5d',
                    backgroundColor: 'rgba(142, 125, 93, 0.05)'
                  }
                }}
              >
                Get Directions
              </Button>
            </motion.div>
          </Box>

          {/* Map */}
          <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 auto' }, width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: { xs: '300px', md: '450px' },
                  boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(142, 125, 93, 0.1)'
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
