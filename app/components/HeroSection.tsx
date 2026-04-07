'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { isThai, getFontFamily } from '../utils/fontHelper';
import Image from 'next/image';


export interface HeroData {
  groomName: string;
  brideName: string;
  eventDate: string;
  locationText: string;
  mediaType?: 'video' | 'image' | 'color';
  heroVideo?: string;
  heroImage?: string;
  heroPoster?: string;
  heroStyle?: 'classic' | 'editorial' | 'minimal';
  heroNameImage?: string; // New: Custom image for names
  heroBackgroundColor?: string; // New: Solid background color
  showFallingPetals?: boolean; // New: Toggle falling petals effect
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 } as any,
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  } as any
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 } as any,
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  } as any
};

export default function HeroSection({ data }: { data?: HeroData }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const style = data?.heroStyle || 'classic';

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        if (error.name !== "AbortError") {
          console.error("Hero video play error:", error);
        }
      });
    }
  }, []);

  const renderContent = () => {
    switch (style) {
      case 'editorial':
        return (
          <Box sx={{ position: 'relative', zIndex: 2, width: '100%', px: 4, textAlign: 'left' }}>
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.4em', fontSize: '0.7rem', mb: 2, display: 'block' }}>
                  THE WEDDING OF
                </Typography>
              </motion.div>
              {data?.heroNameImage ? (
                <motion.div variants={fadeInUp}>
                  <Box sx={{ position: 'relative', width: '100%', height: { xs: 120, md: 240 }, mb: 4 }}>
                    <Image src={data.heroNameImage} alt="Wedding Names" fill style={{ objectFit: 'contain' }} />
                  </Box>
                </motion.div>
              ) : (
                <>
                  <motion.div variants={fadeInUp}>
                    <Typography sx={{ 
                      fontFamily: getFontFamily(data?.brideName), 
                      fontSize: isThai(data?.brideName) ? { xs: '2.5rem', md: '4.5rem' } : { xs: '4.5rem', md: '9rem' }, 
                      fontWeight: isThai(data?.brideName) ? 600 : 400,
                      lineHeight: 0.85, 
                      color: '#fff', 
                      mb: 1 
                    }}>
                      {data?.brideName || "Mook"}
                    </Typography>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Typography sx={{ fontFamily: 'var(--script-font, "Parisienne", cursive)', fontSize: '3rem', color: 'rgba(255,255,255,0.7)', my: -1, ml: 4 }}>
                      &
                    </Typography>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Typography sx={{ 
                      fontFamily: getFontFamily(data?.groomName), 
                      fontSize: isThai(data?.groomName) ? { xs: '2.5rem', md: '4.5rem' } : { xs: '4.5rem', md: '9rem' }, 
                      fontWeight: isThai(data?.groomName) ? 600 : 400,
                      lineHeight: 0.85, 
                      color: '#fff', 
                      mb: 4 
                    }}>
                      {data?.groomName || "Top"}
                    </Typography>
                  </motion.div>
                </>
              )}
              <motion.div variants={fadeInUp} style={{ marginTop: 'auto' }}>
                <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '0.9rem', letterSpacing: '0.4em', color: '#fff', fontWeight: 600, mb: 1 }}>
                  {data?.eventDate || "14 . 05 . 26"}
                </Typography>
                <Typography sx={{
                  fontFamily: '"Prompt", sans-serif',
                  fontSize: isThai(data?.locationText) ? '0.9rem' : '0.75rem',
                  letterSpacing: isThai(data?.locationText) ? '0.05em' : '0.3em',
                  color: 'rgba(255,255,255,0.8)',
                  textTransform: isThai(data?.locationText) ? 'none' : 'uppercase'
                }}>
                  {data?.locationText || "PATTAYA • CHONBURI"}
                </Typography>
              </motion.div>
            </motion.div>
          </Box>
        );

      case 'minimal':
        return (
          <Box sx={{ position: 'absolute', bottom: { xs: 40, md: 80 }, right: { xs: 20, md: 40 }, textAlign: 'right', zIndex: 2, maxWidth: '80%' }}>
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '0.6rem', letterSpacing: '0.5em', color: 'rgba(255,255,255,0.6)', mb: 3, textTransform: 'uppercase' }}>
                  SAVE THE DATE • {data?.eventDate || "14.05.26"}
                </Typography>
              </motion.div>
              {data?.heroNameImage ? (
                <motion.div variants={fadeInUp}>
                  <Box sx={{ position: 'relative', width: '100%', height: { xs: 100, md: 240 } }}>
                    <Image src={data.heroNameImage} alt="Wedding Names" fill style={{ objectFit: 'contain' }} />
                  </Box>
                </motion.div>
              ) : (
                <Box sx={{ borderRight: '2px solid rgba(212, 175, 55, 0.6)', pr: 3, py: 1 }}>
                  <motion.div variants={fadeInUp}>
                    <Typography sx={{ 
                      fontFamily: getFontFamily(data?.brideName), 
                      fontSize: isThai(data?.brideName) ? { xs: '2rem', md: '3.5rem' } : { xs: '3.5rem', md: '6.5rem' }, 
                      color: '#fff', 
                      lineHeight: 1 
                    }}>
                      {data?.brideName || "MOOK"}
                    </Typography>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Typography sx={{ 
                      fontFamily: getFontFamily(data?.groomName), 
                      fontSize: isThai(data?.groomName) ? { xs: '2rem', md: '3.5rem' } : { xs: '3.5rem', md: '6.5rem' }, 
                      color: '#fff', 
                      lineHeight: 1 
                    }}>
                      & {data?.groomName || "TOP"}
                    </Typography>
                  </motion.div>
                </Box>
              )}
              <motion.div variants={fadeInUp}>
                <Typography sx={{
                  fontFamily: '"Prompt", sans-serif',
                  fontSize: isThai(data?.locationText) ? '0.8rem' : '0.65rem',
                  letterSpacing: isThai(data?.locationText) ? '0.05em' : '0.3em',
                  color: 'rgba(255,255,255,0.5)',
                  mt: 3,
                  textTransform: isThai(data?.locationText) ? 'none' : 'uppercase'
                }}>
                  {data?.locationText || "PATTAYA • CHONBURI"}
                </Typography>
              </motion.div>
            </motion.div>
          </Box>
        );

      case 'classic':
      default:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
          >
            <motion.div variants={fadeInUp}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.6em', fontSize: { xs: '0.6rem', md: '0.8rem' }, mb: 4, display: 'block' }}>
                WEDDING
              </Typography>
            </motion.div>
            <Box sx={{ position: 'relative', mb: { xs: 4, md: 6 } }}>
              {data?.heroNameImage ? (
                <motion.div variants={fadeInUp}>
                  <Box sx={{ position: 'relative', width: '100%', height: { xs: 150, md: 320 } }}>
                    <Image src={data.heroNameImage} alt="Wedding Names" fill style={{ objectFit: 'contain' }} />
                  </Box>
                </motion.div>
              ) : (
                <motion.div variants={fadeInUp}>
                  <Typography sx={{ 
                    fontFamily: getFontFamily(data?.brideName), 
                    fontSize: isThai(data?.brideName) ? { xs: '2.5rem', md: '5.5rem' } : { xs: '3.5rem', md: '11rem' },
                    lineHeight: 0.8, 
                    color: '#fff', 
                    textShadow: '0 10px 30px rgba(0,0,0,0.3)', 
                    position: 'relative', 
                    display: 'inline-block' 
                  }}>
                    {data ? data.brideName : "Mook"} <Box component="span" sx={{ fontSize: '0.4em', verticalAlign: 'middle', mx: -1, opacity: 0.6 }}>&</Box> {data ? data.groomName : "Top"}
                  </Typography>
                </motion.div>
              )}
            </Box>
            <motion.div variants={fadeInUp}>
              <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <Box sx={{ height: '1.5px', width: '30px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <Typography sx={{ fontFamily: '"Bodoni Moda", serif', fontSize: { xs: '1.2rem', md: '1.8rem' }, color: '#fff', letterSpacing: '0.3em', fontWeight: 300 }}>
                  {data ? data.eventDate : "14 . 05 . 26"}
                </Typography>
                <Box sx={{ height: '1.5px', width: '30px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
              </Stack>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Typography sx={{
                fontFamily: '"Prompt", sans-serif',
                fontSize: isThai(data?.locationText) ? '0.9rem' : '0.75rem',
                letterSpacing: isThai(data?.locationText) ? '0.1em' : '0.4em',
                color: 'rgba(255,255,255,0.9)',
                textTransform: isThai(data?.locationText) ? 'none' : 'uppercase'
              }}>
                {data ? data.locationText : "CAPE DARA RESORT PATTAYA • CHONBURI"}
              </Typography>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <Box
      component="section"
      sx={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: data?.mediaType === 'color' ? (data?.heroBackgroundColor || '#ffffff') : '#000',
      }}
    >
      {/* Seamless Video or Image Background System */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {data?.mediaType === 'image' ? (
          <Image
            src={data?.heroImage || "/images/demo/index-cover.png"}
            alt="Wedding Background"
            fill
            priority
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.85,
            }}
          />
        ) : data?.mediaType === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            poster={data?.heroPoster || "/images/demo/index-cover.png"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85,
            }}
          >
            <source src={data?.heroVideo || "/images/demo/demo1.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </Box>

      {/* Lux Overlay - Only for video/image */}
      {data?.mediaType !== 'color' && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1,
          }}
        />
      )}

      {renderContent()}

      {/* Elegant Scroll Indicator */}
      <Box sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <motion.div
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '1px', height: '80px', backgroundColor: 'rgba(255,255,255,0.4)', margin: '0 auto', transformOrigin: 'top' }}
        />
      </Box>
    </Box>
  );
}
