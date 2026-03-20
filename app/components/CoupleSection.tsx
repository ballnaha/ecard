'use client';

import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { motion, Variants } from 'framer-motion';

const assets = {
  bride: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
  groom: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function CoupleSection() {
  return (
    <Box sx={{ py: { xs: 15, md: 25 }, backgroundColor: '#faf9f6', position: 'relative', overflow: 'hidden' }}>
      
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 10, md: 15 } }}>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Typography variant="overline" sx={{ 
              letterSpacing: '0.6em', 
              color: '#8e7d5d', 
              fontSize: '0.75rem',
              mb: 1.5,
              display: 'block'
            }}>
              A Beautiful Beginning
            </Typography>
            <Typography variant="h2" sx={{ 
              fontFamily: '"Playfair Display", serif', 
              fontWeight: 400,
              fontSize: { xs: '2.8rem', md: '4rem' },
              color: '#1a1a1a',
              fontStyle: 'italic'
            }}>
              The Happy Couple
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: { xs: 5, md: 0 },
          position: 'relative',
          px: 2
        }}>
          
          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{ 
              width: { xs: '100%', sm: '320px', md: '380px' }, 
              maxWidth: '380px',
              position: 'relative',
              mr: { md: -10 },
              mb: { xs: 8, md: 0 } 
            }}>
              <Box sx={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                overflow: 'hidden', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                position: 'relative',
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <img src={assets.bride} alt="Mook" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              
              <Box sx={{ 
                position: 'absolute', 
                bottom: { xs: -20, md: -30 }, 
                left: { xs: '50%', md: -40 },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                p: { xs: 2.5, md: 4 },
                width: { xs: '85%', md: '260px' },
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                zIndex: 3,
                textAlign: { xs: 'center', md: 'left' }
              }}>
                 <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8e7d5d', mb: 0.5 }}>The Bride</Typography>
                 <Typography sx={{ fontFamily: '"Bodoni Moda", serif', fontSize: { xs: '1.4rem', md: '1.8rem' }, lineHeight: 1, mb: 0.5 }}>Mook</Typography>
                 <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: '"Montserrat", sans-serif', opacity: 0.8 }}>Kamonluk Srirat</Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{ 
              width: { xs: '100%', sm: '320px', md: '380px' }, 
              maxWidth: '380px',
              position: 'relative',
              ml: { md: -10 },
              mt: { md: 15 }
            }}>
              <Box sx={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                overflow: 'hidden', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                position: 'relative',
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <img src={assets.groom} alt="Top" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              
              <Box sx={{ 
                position: 'absolute', 
                bottom: { xs: -20, md: -30 }, 
                right: { xs: '50%', md: -40 },
                transform: { xs: 'translateX(50%)', md: 'none' },
                p: { xs: 2.5, md: 4 },
                width: { xs: '85%', md: '260px' },
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                zIndex: 3,
                textAlign: { xs: 'center', md: 'right' }
              }}>
                 <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8e7d5d', mb: 0.5 }}>The Groom</Typography>
                 <Typography sx={{ fontFamily: '"Bodoni Moda", serif', fontSize: { xs: '1.4rem', md: '1.8rem' }, lineHeight: 1, mb: 0.5 }}>Top</Typography>
                 <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: '"Montserrat", sans-serif', opacity: 0.8 }}>Thanapol Krerkrai</Typography>
              </Box>
            </Box>
          </motion.div>

        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 15, md: 25 }, maxWidth: '600px', mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 1 }}
          >
            <Typography sx={{ fontFamily: '"Italianno", cursive', fontSize: '3.5rem', color: '#8e7d5d', mb: 2 }}>Together Forever</Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', lineHeight: 1.8, color: '#4a4a4a', fontStyle: 'italic' }}>
              "Found my soulmate, found my home. Two souls, one heart, and a lifetime of adventures together. This is where our forever begins."
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
