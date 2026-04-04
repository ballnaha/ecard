'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface CoupleData {
  introText?: string;
  bridePic?: string;
  groomPic?: string;
  coupleStyle?: 'arch-duo' | 'rounded-avatar' | 'storybook-polaroids' | string;
  brideName?: string;
  groomName?: string;
}

const isThai = (text: string) => /[\u0E00-\u0E7F]/.test(text);
const splitName = (name: string) => name.replace(' ', '\n');

const fadeInUp: any = {
  hidden: { opacity: 0, y: 60 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4
    }
  }
};

export default function CoupleSection({ data }: { data?: CoupleData }) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const bridePic = data?.bridePic || "images/demo/bride.png";
  const groomPic = data?.groomPic || "images/demo/groom.png";
  const intro = data?.introText || "Two paths that led to one beautiful journey. Together, we are creating a story that will last a lifetime, filled with love and endless joy.";
  const style = data?.coupleStyle || 'arch-duo';

  const NameDisplay = ({ name, role, align = 'center' }: { name: string, role: string, align?: 'center' | 'left' | 'right' }) => {
    const parts = name.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    const thai = isThai(name);

    return (
      <Box sx={{ textAlign: align }}>
        <Typography sx={{ 
          fontFamily: thai ? '"Prompt", sans-serif' : '"Carattere", cursive',
          fontWeight: thai ? 600 : 400,
          fontSize: { 
            xs: thai ? '2.25rem' : '4rem', 
            md: thai ? '3.2rem' : '5.5rem' 
          }, 
          color: '#8e7d5d', 
          lineHeight: 1,
          mb: lastName ? 0.5 : 2
        }}>
          {firstName}
        </Typography>
        {lastName && (
          <Typography sx={{ 
            fontFamily: thai ? '"Prompt", sans-serif' : '"Carattere", cursive',
            fontWeight: thai ? 300 : 400,
            fontSize: { 
              xs: thai ? '1.4rem' : '2.2rem', 
              md: thai ? '1.8rem' : '2.8rem' 
            }, 
            color: '#8e7d5d', 
            opacity: 0.7,
            lineHeight: 1,
            mb: 2,
            letterSpacing: thai ? '0.02em' : 'normal'
          }}>
            {lastName}
          </Typography>
        )}
        <Typography sx={{ 
          fontFamily: '"Bodoni Moda", serif', 
          fontSize: '0.75rem', 
          letterSpacing: '0.4em', 
          textTransform: 'uppercase', 
          color: '#1a1a1a', 
          opacity: 0.6, 
          fontWeight: 600,
          mt: lastName ? 0 : 1
        }}>
          {role}
        </Typography>
      </Box>
    );
  };

  const renderLayout = () => {
    switch (style) {
      case 'rounded-portrait':
        return (
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, py: 4 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 8, md: 10 }} alignItems="flex-start" justifyContent="center">
                {/* Bride Avatar */}
                <motion.div variants={fadeInUp}>
                  <Box>
                    <Box sx={{ 
                      width: { xs: 300, md: 400 }, 
                      height: { xs: 300, md: 400 }, 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: '8px solid #fff',
                      boxShadow: '0 20px 60px rgba(142, 125, 93, 0.25)',
                      mb: { xs: 4, md: 5 }
                    }}>
                      <img src={bridePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <NameDisplay name={data?.brideName || "Mook"} role="The Bride" />
                  </Box>
                </motion.div>

                {/* Groom Avatar */}
                <motion.div variants={fadeInUp}>
                  <Box>
                    <Box sx={{ 
                      width: { xs: 300, md: 400 }, 
                      height: { xs: 300, md: 400 }, 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: '8px solid #fff',
                      boxShadow: '0 20px 60px rgba(142, 125, 93, 0.25)',
                      mb: { xs: 4, md: 5 }
                    }}>
                      <img src={groomPic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <NameDisplay name={data?.groomName || "Top"} role="The Groom" />
                  </Box>
                </motion.div>
              </Stack>
            </Box>
          </motion.div>
        );

      case 'arch-duo':
      default:
        return (
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            <Box sx={{
              display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', gap: { xs: 15, md: 4 }, position: 'relative', zIndex: 1
            }}>
              {/* Bride Section */}
              <motion.div variants={fadeInUp} style={{ flex: 1, width: '100%', maxWidth: '450px' }}>
                <Box sx={{ position: 'relative' }}>
                  <motion.div style={{ y: y1 }}>
                    <Box sx={{
                      position: 'relative', zIndex: 2, mx: 'auto', width: { xs: '280px', md: '380px' }, height: { xs: '420px', md: '560px' },
                      borderRadius: '200px 200px 0 0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.08)', border: '1px solid rgba(142, 125, 93, 0.1)'
                    }}>
                      <img src={bridePic} alt="Bride" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  </motion.div>
                  <Box sx={{
                    position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '-30px',
                    border: '1px solid rgba(142, 125, 93, 0.15)', borderRadius: '200px 200px 0 0', zIndex: 1
                  }} />
                  <Box sx={{ position: 'absolute', bottom: { xs: -80, md: -100 }, right: { xs: 0, md: -60 }, zIndex: 3, maxWidth: { xs: '250px', md: '450px' } }}>
                    <NameDisplay name={data?.brideName || "Mook"} role="The Bride" align="right" />
                  </Box>
                </Box>
              </motion.div>

              <Box sx={{ flex: '0 0 auto', display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mx: 4 }}>
                <Typography sx={{ fontFamily: '"Italianno", cursive', fontSize: '10rem', color: 'rgba(142, 125, 93, 0.1)' }}>&</Typography>
              </Box>

              {/* Groom Section */}
              <motion.div variants={fadeInUp} style={{ flex: 1, width: '100%', maxWidth: '450px', marginTop: '40px' }}>
                <Box sx={{ position: 'relative' }}>
                  <motion.div style={{ y: y2 }}>
                    <Box sx={{
                      position: 'relative', zIndex: 2, mx: 'auto', width: { xs: '280px', md: '380px' }, height: { xs: '420px', md: '560px' },
                      borderRadius: '200px 200px 0 0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.08)', border: '1px solid rgba(142, 125, 93, 0.1)'
                    }}>
                      <img src={groomPic} alt="Groom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  </motion.div>
                  <Box sx={{
                    position: 'absolute', top: '-30px', left: '30px', right: '30px', bottom: '30px',
                    border: '1px solid rgba(142, 125, 93, 0.15)', borderRadius: '200px 200px 0 0', zIndex: 1
                  }} />
                  <Box sx={{ position: 'absolute', top: { xs: -100, md: -120 }, left: { xs: 0, md: -60 }, zIndex: 3, maxWidth: { xs: '250px', md: '450px' } }}>
                    <NameDisplay name={data?.groomName || "Top"} role="The Groom" align="left" />
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        );
    }
  };

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
      <Typography sx={{
        position: 'absolute', top: '15%', left: '-5%', fontSize: { xs: '8rem', md: '18rem' },
        fontFamily: '"Playfair Display", serif', color: 'rgba(142, 125, 93, 0.03)',
        whiteSpace: 'nowrap', zIndex: 0, userSelect: 'none', pointerEvents: 'none', fontStyle: 'italic'
      }}>
        Eternity
      </Typography>

      <Container maxWidth="lg">
        {renderLayout()}

        {/* Cinematic Quote Area */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
          <Box sx={{ textAlign: 'center', mt: { xs: 15, md: 20 }, position: 'relative' }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} sx={{ mb: 6 }}>
              <Box sx={{ height: '1.5px', width: '80px', backgroundColor: 'rgba(142, 125, 93, 0.2)' }} />
              <Typography variant="overline" sx={{ letterSpacing: '0.8em', color: '#8e7d5d', fontWeight: 500, fontSize: '0.8rem' }}>EST. 2026</Typography>
              <Box sx={{ height: '1.5px', width: '80px', backgroundColor: 'rgba(142, 125, 93, 0.2)' }} />
            </Stack>

            <Typography sx={{
              fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '1.6rem', md: '2.4rem' },
              fontStyle: 'italic', lineHeight: 1.6, color: '#333', maxWidth: '900px', mx: 'auto', px: 2, fontWeight: 300
            }}>
              "{intro}"
            </Typography>

            <Typography sx={{
              mt: 6, fontFamily: '"Bodoni Moda", serif', fontSize: '0.7rem',
              letterSpacing: '0.5em', textTransform: 'uppercase', color: '#8e7d5d', opacity: 0.8
            }}>
              {data?.brideName || "Mook"} & {data?.groomName || "Top"}
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
