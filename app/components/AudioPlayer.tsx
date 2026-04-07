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

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('mousedown', startAudio);
      window.removeEventListener('scroll', startAudio);
      clearTimeout(timer);
    };
  }, []);

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
            {/* Visualizer Lines */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              height: '20px',
              paddingX: 1
            }}>
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  component={motion.div}
                  animate={{
                    height: isPlaying ? [10, 20, 10, 15, 10] : 3,
                    opacity: isPlaying ? 0.8 : 0.3
                  }}
                  transition={{
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  sx={{
                    width: '3px',
                    backgroundColor: primaryColor,
                    borderRadius: '2px'
                  }}
                />
              ))}
            </Box>

            {/* Play/Pause Button */}
            <IconButton
              onClick={togglePlay}
              sx={{
                width: 50,
                height: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(primaryColor, 0.2)}`,
                boxShadow: isPlaying
                  ? `0 10px 25px ${alpha(primaryColor, 0.2)}`
                  : '0 8px 20px rgba(0,0,0,0.06)',
                color: isPlaying ? primaryColor : 'rgba(0,0,0,0.4)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  backgroundColor: '#fff',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Box
                component={motion.div}
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                sx={{ display: 'flex' }}
              >
                {isPlaying ? <Music size="24" variant="Outline" color={primaryColor} /> : <MusicFilter size="24" variant="Outline" color={primaryColor} />}
              </Box>
            </IconButton>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
