'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, alpha } from '@mui/material';
import { Music, MusicFilter } from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  audioUrl?: string; // Will be linked to uploaded file later
  primaryColor?: string;
}

export default function AudioPlayer({
  audioUrl,
  primaryColor = '#8e7d5d'
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Return null if no audio URL is provided
  if (!audioUrl) return null;

  // Sync state with audio events
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  // Show the player and attempt autoplay on interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startAudio = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Autoplay attempt failed:', err));
        
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('mousedown', startAudio);
      window.removeEventListener('scroll', startAudio);
    };

    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
    window.addEventListener('mousedown', startAudio, { once: true });
    window.addEventListener('scroll', startAudio, { once: true });

    const timer = setTimeout(() => setIsVisible(true), 1500);

    // Stop music when user leaves the tab/browser (Page Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audio.paused === false) {
          audio.pause();
          // We don't change setIsPlaying(false) here because we want to know 
          // it was "supposed" to be playing when they come back
        }
      } else {
        // Resume if the state says it should be playing
        if (isPlaying && audio.paused) {
          audio.play().catch(() => setIsPlaying(false));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('mousedown', startAudio);
      window.removeEventListener('scroll', startAudio);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timer);
    };
  }, [isPlaying]); // Add isPlaying to dependencies for the visibility handler logic

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Most browsers block auto-play until interaction
        audioRef.current.play().catch(err => {
          console.log('Audio play blocked by browser:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        loop
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
      />

      <AnimatePresence>
        {isVisible && (
          <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0, x: -20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0, opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            sx={{
              position: 'fixed',
              top: { xs: 20, md: 30 },
              right: { xs: 20, md: 30 },
              zIndex: 1100, // Below Dialog (1300) and Snackbar (1400)
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            {/* Classic Vintage Turntable Base */}
            <Box sx={{ 
              position: 'relative', 
              width: { xs: 68, md: 84 }, 
              height: { xs: 68, md: 84 }, 
              bgcolor: '#3e2723', // Dark walnut wood
              background: 'linear-gradient(135deg, #5d4037 0%, #2b1d12 100%)',
              borderRadius: '10px',
              p: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0,0,0,0.25), inset 0 0 10px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {/* Subtle corner screw details */}
              {[...Array(4)].map((_, i) => (
                <Box key={i} sx={{ position: 'absolute', width: 2, height: 2, bgcolor: '#8e7d5d', opacity: 0.4, borderRadius: '50%', top: i < 2 ? 3 : 'auto', bottom: i >= 2 ? 3 : 'auto', left: i % 2 === 0 ? 3 : 'auto', right: i % 2 !== 0 ? 3 : 'auto' }} />
              ))}

              {/* The Tonearm (Vintage Gold Needle) */}
              <Box
                component={motion.div}
                initial={false}
                animate={{ 
                  rotate: isPlaying ? 35 : 0,
                  x: isPlaying ? -3 : 0 
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                sx={{
                  position: 'absolute',
                  top: { xs: 6, md: 8 },
                  right: { xs: 6, md: 8 },
                  width: { xs: 32, md: 40 },
                  height: { xs: 40, md: 50 },
                  zIndex: 10,
                  transformOrigin: 'top right',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                {/* Arm Base Pivot - Antique Gold */}
                <Box sx={{ 
                  width: { xs: 11, md: 14 }, height: { xs: 11, md: 14 }, borderRadius: '50%', 
                  bgcolor: '#8e7d5d', 
                  backgroundImage: 'radial-gradient(circle at 30% 30%, #ccac71, #8e7d5d)',
                  border: '1px solid rgba(0,0,0,0.2)',
                  mb: -1, ml: 'auto',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} />
                {/* The Golden Arm */}
                <Box sx={{ 
                  width: { xs: 3, md: 4 }, height: '100%', 
                  background: 'linear-gradient(to right, #8e7d5d, #ccac71, #8e7d5d)',
                  boxShadow: '1px 0 3px rgba(0,0,0,0.3)',
                  borderRadius: '1.5px',
                  ml: 'auto', mr: { xs: '4px', md: '5px' }
                }} />
                {/* The Vintage Head Shell */}
                <Box sx={{ 
                  width: { xs: 11, md: 14 }, height: { xs: 6, md: 8 }, bgcolor: '#222', 
                  borderRadius: '1px', mt: -2, ml: { xs: -4, md: -5 },
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  border: '0.5px solid #8e7d5d'
                }} />
              </Box>

              {/* The Vinyl Disc */}
              <IconButton
                onClick={togglePlay}
                sx={{
                  width: { xs: 58, md: 72 },
                  height: { xs: 58, md: 72 },
                  padding: 0,
                  backgroundColor: '#000',
                  position: 'relative',
                  zIndex: 2,
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    filter: 'brightness(1.15)'
                  }
                }}
              >
                <Box
                  component={motion.div}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                  sx={{ 
                    position: 'relative', width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Box
                    component="img"
                    src="/images/assets/vinyl_record.png"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '50%',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.6)'
                    }}
                  />
                  
                  {/* Vintage Paper Label Overlay */}
                  <Box sx={{
                    position: 'absolute',
                    width: '32%',
                    height: '32%',
                    borderRadius: '50%',
                    bgcolor: '#e9e4d9', // Aged paper color
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
                    zIndex: 3,
                    border: `1.5px dashed ${alpha(primaryColor, 0.3)}`
                  }}>
                    <Music size="10" variant="Bold" color={primaryColor} style={{ opacity: 0.7 }} />
                  </Box>
                </Box>
              </IconButton>
            </Box>

            {/* Subtle Analog Level Meter */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              opacity: isPlaying ? 0.7 : 0,
              transition: 'opacity 0.8s ease',
              width: 3,
              ml: 0.5
            }}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  component={motion.div}
                  animate={{
                    opacity: isPlaying ? [0.3, 1, 0.3] : 0.2,
                  }}
                  transition={{ duration: 0.4 + i * 0.2, repeat: Infinity }}
                  sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: i === 3 ? '#ff5252' : '#ccac71' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
