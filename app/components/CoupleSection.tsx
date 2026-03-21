'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';

const assets = {
  bride: "images/demo/bride.png",
  groom: "images/demo/groom.png"
};

export default function CoupleSection() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Background Text */}
      <Typography
        sx={{
          position: 'absolute',
          top: '15%',
          left: '-5%',
          fontSize: { xs: '8rem', md: '18rem' },
          fontFamily: '"Playfair Display", serif',
          color: 'rgba(142, 125, 93, 0.03)',
          whiteSpace: 'nowrap',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic'
        }}
      >
        Eternity
      </Typography>

      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 12, md: 4 },
          position: 'relative',
          zIndex: 1
        }}>

          {/* Bride Section */}
          <Box sx={{ flex: 1, width: '100%', maxWidth: { md: '450px' }, position: 'relative' }}>
            <Box sx={{ position: 'relative' }}>
              <motion.div style={{ y: y1 }}>
                <Box sx={{
                  position: 'relative',
                  zIndex: 2,
                  mx: 'auto',
                  width: { xs: '280px', md: '380px' },
                  height: { xs: '420px', md: '560px' },
                  borderRadius: '200px 200px 0 0', // Classic Arch Shape
                  overflow: 'hidden',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(142, 125, 93, 0.1)'
                }}>
                  <img
                    src={assets.bride}
                    alt="Bride"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </motion.div>

              {/* Decorative Frame for Bride */}
              <Box sx={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                right: '30px',
                bottom: '-30px',
                border: '1px solid rgba(142, 125, 93, 0.15)',
                borderRadius: '200px 200px 0 0',
                zIndex: 1
              }} />

              <Box sx={{
                position: 'absolute',
                bottom: -40,
                right: { xs: 0, md: -60 },
                zIndex: 3,
                textAlign: 'right'
              }}>
                <Typography sx={{
                  fontFamily: '"Carattere", cursive',
                  fontSize: { xs: '4.5rem', md: '6rem' },
                  color: '#8e7d5d',
                  mb: -2,
                  lineHeight: 1
                }}>
                  Mook
                </Typography>
                <Typography sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#1a1a1a',
                  opacity: 0.6,
                  fontWeight: 600
                }}>
                  The Bride
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Spacer / Ampersand for Desktop */}
          <Box sx={{
            flex: '0 0 auto',
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            mx: 4
          }}>
            <Typography sx={{
              fontFamily: '"Italianno", cursive',
              fontSize: '10rem',
              color: 'rgba(142, 125, 93, 0.1)'
            }}>
              &
            </Typography>
          </Box>

          {/* Groom Section */}
          <Box sx={{ flex: 1, width: '100%', maxWidth: { md: '450px' }, position: 'relative', mt: { xs: 4, md: 10 } }}>
            <Box sx={{ position: 'relative' }}>
              <motion.div style={{ y: y2 }}>
                <Box sx={{
                  position: 'relative',
                  zIndex: 2,
                  mx: 'auto',
                  width: { xs: '280px', md: '380px' },
                  height: { xs: '420px', md: '560px' },
                  borderRadius: '200px 200px 0 0',
                  overflow: 'hidden',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(142, 125, 93, 0.1)'
                }}>
                  <img
                    src={assets.groom}
                    alt="Groom"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </motion.div>

              {/* Decorative Frame for Groom */}
              <Box sx={{
                position: 'absolute',
                top: '-30px',
                left: '30px',
                right: '30px',
                bottom: '30px',
                border: '1px solid rgba(142, 125, 93, 0.15)',
                borderRadius: '200px 200px 0 0',
                zIndex: 1
              }} />

              <Box sx={{
                position: 'absolute',
                top: -60,
                left: { xs: 0, md: -60 },
                zIndex: 3,
                textAlign: 'left'
              }}>
                <Typography sx={{
                  fontFamily: '"Carattere", cursive',
                  fontSize: { xs: '4.5rem', md: '6rem' },
                  color: '#8e7d5d',
                  mb: -2,
                  lineHeight: 1
                }}>
                  Top
                </Typography>
                <Typography sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#1a1a1a',
                  opacity: 0.6,
                  fontWeight: 600
                }}>
                  The Groom
                </Typography>
              </Box>
            </Box>
          </Box>

        </Box>

        {/* Cinematic Quote Area */}
        <Box sx={{ textAlign: 'center', mt: { xs: 15, md: 20 }, position: 'relative' }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} sx={{ mb: 6 }}>
            <Box sx={{ height: '1.5px', width: '80px', backgroundColor: 'rgba(142, 125, 93, 0.2)' }} />
            <Typography variant="overline" sx={{
              letterSpacing: '0.8em',
              color: '#8e7d5d',
              fontWeight: 500,
              fontSize: '0.8rem'
            }}>
              EST. 2020
            </Typography>
            <Box sx={{ height: '1.5px', width: '80px', backgroundColor: 'rgba(142, 125, 93, 0.2)' }} />
          </Stack>

          <Typography sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '1.6rem', md: '2.4rem' },
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: '#333',
            maxWidth: '900px',
            mx: 'auto',
            px: 2,
            fontWeight: 300
          }}>
            "Two paths that led to one beautiful journey. Together, we are creating a story that will last a lifetime, filled with love and endless joy."
          </Typography>

          <Typography sx={{
            mt: 6,
            fontFamily: '"Bodoni Moda", serif',
            fontSize: '0.7rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: '#8e7d5d',
            opacity: 0.8
          }}>
            Kamonluk & Thanapol
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
