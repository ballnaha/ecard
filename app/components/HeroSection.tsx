'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion, Variants } from 'framer-motion';

const assets = {
  heroVideo: "/images/demo/demo1.mp4",
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

export default function HeroSection() {
  const [activeVideo, setActiveVideo] = React.useState(0);
  const videoRef0 = React.useRef<HTMLVideoElement>(null);
  const videoRef1 = React.useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = (index: number) => {
    const video = index === 0 ? videoRef0.current : videoRef1.current;
    const nextVideo = index === 0 ? videoRef1.current : videoRef0.current;

    if (video && nextVideo && activeVideo === index) {
      if (video.duration - video.currentTime < 1 && nextVideo.paused) {
        nextVideo.currentTime = 0;
        nextVideo.play();
        setActiveVideo(index === 0 ? 1 : 0);
      }
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
        backgroundColor: '#000',
      }}
    >
      {/* Seamless Video Background System */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Box
          component="video"
          ref={videoRef0}
          src={assets.heroVideo}
          autoPlay
          muted
          playsInline
          onTimeUpdate={() => handleTimeUpdate(0)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: activeVideo === 0 ? 0.85 : 0,
            transition: 'opacity 1.5s ease-in-out',
            visibility: activeVideo === 0 || videoRef0.current?.currentTime ? 'visible' : 'hidden'
          }}
        />
        <Box
          component="video"
          ref={videoRef1}
          src={assets.heroVideo}
          muted
          playsInline
          onTimeUpdate={() => handleTimeUpdate(1)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: activeVideo === 1 ? 0.85 : 0,
            transition: 'opacity 1.5s ease-in-out',
            visibility: activeVideo === 1 || videoRef1.current?.currentTime ? 'visible' : 'hidden'
          }}
        />
      </Box>

      {/* Lux Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
          zIndex: 1,
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        <motion.div variants={fadeInUp}>
          <Typography variant="overline" sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            letterSpacing: '0.6em', 
            fontSize: { xs: '0.6rem', md: '0.8rem' },
            mb: 4,
            display: 'block'
          }}>
            SAVE the DATE
          </Typography>
        </motion.div>

        <Box sx={{ position: 'relative', mb: { xs: 4, md: 6 } }}>
          <motion.div variants={fadeInUp}>
            <Typography sx={{ 
              fontFamily: '"Carattere", cursive', 
              fontSize: { xs: '5rem', md: '11rem' }, 
              lineHeight: 0.8,
              color: '#fff',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)',
              position: 'relative',
              display: 'inline-block'
            }}>
              Mook <Box component="span" sx={{ fontSize: '0.4em', verticalAlign: 'middle', mx: -1, opacity: 0.6 }}>&</Box> Top
            </Typography>
          </motion.div>
        </Box>

        <motion.div variants={fadeInUp}>
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
            <Box sx={{ height: '1.5px', width: '30px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <Typography sx={{ 
              fontFamily: '"Bodoni Moda", serif', 
              fontSize: { xs: '1.2rem', md: '1.8rem' }, 
              color: '#fff',
              letterSpacing: '0.3em',
              fontWeight: 300
            }}>
              14 . 05 . 29
            </Typography>
            <Box sx={{ height: '1.5px', width: '30px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
          </Stack>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Typography sx={{ 
            fontFamily: '"Montserrat", sans-serif', 
            fontSize: '0.65rem', 
            letterSpacing: '0.4em', 
            color: 'rgba(255,255,255,0.9)',
            textTransform: 'uppercase'
          }}>
            THE GLASSHOUSE ESTATE • CHIANG MAI
          </Typography>
        </motion.div>
      </motion.div>

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
