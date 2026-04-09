'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, alpha } from '@mui/material';
import { Music } from 'iconsax-react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';

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
  const isPlayingRef = useRef(false);

  // Smooth continuous vinyl rotation (accelerate / decelerate naturally)
  const vinylRotation = useMotionValue(0);
  const speedRef = useRef(0); // current deg/ms
  const TARGET_SPEED = 360 / 2400; // one revolution per 2.4s

  useAnimationFrame((_, delta) => {
    if (isPlayingRef.current) {
      speedRef.current = Math.min(speedRef.current + delta * 0.00015, TARGET_SPEED);
    } else {
      speedRef.current = Math.max(speedRef.current - delta * 0.00008, 0);
    }
    if (speedRef.current > 0) {
      vinylRotation.set((vinylRotation.get() + speedRef.current * delta) % 360);
    }
  });

  // Sync state with audio events
  const handlePlay = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
  };
  const handlePause = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Show the player quickly after mount
    const timer = setTimeout(() => setIsVisible(true), 1200);

    // Initial attempt to play (will likely be triggered by the user's interaction on the envelope)
    // but the interaction context is lost due to async/await in the cover.
    // So we still need a global 'one-time' listener for anyone who hasn't interacted yet.
    const startAudio = () => {
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log('Autoplay attempt failed:', err));
        
        // Remove all listeners once triggered once
        cleanupListeners();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('scroll', startAudio);
    };

    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
    window.addEventListener('scroll', startAudio, { once: true });

    // Stop music when user leaves the tab/browser (Page Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        // Resume if the state says it should be playing
        if (isPlayingRef.current && audio.paused) {
          audio.play().catch(() => setIsPlaying(false));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanupListeners();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timer);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch(err => console.log('Play failed:', err));
    }
  };

  if (!audioUrl) return null;

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
            initial={{ scale: 0, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            sx={{
              position: 'fixed',
              top: { xs: 18, md: 28 },
              right: { xs: 16, md: 28 },
              zIndex: 1100,
              /* 3D perspective container */
              perspective: '520px',
              perspectiveOrigin: '50% 0%',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* ── Turntable Body (3D-tilted) ─────────────────── */}
            <Box
              onClick={togglePlay}
              sx={{
                cursor: 'pointer',
                transform: 'rotateX(16deg)',
                transformStyle: 'preserve-3d',
                position: 'relative',
                width: { xs: 82, md: 98 },
                height: { xs: 64, md: 76 },
                borderRadius: '14px',
                /* Walnut wood */
                background: 'linear-gradient(160deg, #6d4c41 0%, #3e2723 45%, #4e342e 75%, #2b1d12 100%)',
                boxShadow: [
                  '0 3px 0 #1a0d08',
                  '0 5px 0 #120a04',
                  '0 28px 45px rgba(0,0,0,0.6)',
                  'inset 0 1px 2px rgba(255,255,255,0.07)',
                  'inset 0 -1px 2px rgba(0,0,0,0.5)',
                ].join(', '),
                border: '1px solid rgba(255,255,255,0.04)',
                userSelect: 'none',
                /* Wood-grain lines */
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '14px',
                  backgroundImage: `repeating-linear-gradient(
                    87deg,
                    transparent 0px, transparent 9px,
                    rgba(0,0,0,0.07) 9px, rgba(0,0,0,0.07) 10px
                  )`,
                  pointerEvents: 'none',
                  zIndex: 0,
                },
                /* Perspective floor shadow */
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-22px',
                  left: '6%',
                  width: '88%',
                  height: '20px',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 68%)',
                  pointerEvents: 'none',
                  zIndex: -1,
                },
              }}
            >
              {/* Corner screws */}
              {[
                { top: 6, left: 6 },
                { top: 6, right: 6 },
                { bottom: 6, left: 6 },
                { bottom: 6, right: 6 },
              ].map((pos, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    ...pos,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #d4a843, #5c3d10)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
                    zIndex: 6,
                  }}
                />
              ))}

              {/* ── Metal Platter Rim ─────────────────────────── */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '41%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: 54, md: 65 },
                  height: { xs: 54, md: 65 },
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #4a4a4a 0%, #1e1e1e 60%, #333 100%)',
                  boxShadow: [
                    '0 5px 14px rgba(0,0,0,0.7)',
                    'inset 0 1px 3px rgba(255,255,255,0.08)',
                    'inset 0 -2px 4px rgba(0,0,0,0.5)',
                  ].join(', '),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {/* ── Vinyl Record ─────────────────────────────── */}
                <Box
                  component={motion.div}
                  style={{ rotate: vinylRotation }}
                  sx={{
                    willChange: 'transform',
                    width: { xs: 49, md: 59 },
                    height: { xs: 49, md: 59 },
                    borderRadius: '50%',
                    /* Vinyl grooves via repeating-radial-gradient */
                    background: `
                      radial-gradient(circle at center,
                        ${primaryColor}ee 0%,
                        ${primaryColor}bb 13%,
                        transparent 14.5%
                      ),
                      repeating-radial-gradient(
                        circle at center,
                        #111 0px,
                        #111 1.2px,
                        #2a2a2a 1.2px,
                        #2a2a2a 2.6px
                      )
                    `,
                    boxShadow: isPlaying
                      ? `0 6px 20px rgba(0,0,0,0.8), 0 0 18px ${alpha(primaryColor, 0.25)}`
                      : '0 4px 14px rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    /* Vinyl sheen */
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    },
                  }}
                >
                  {/* Center Label */}
                  <Box
                    sx={{
                      width: '30%',
                      height: '30%',
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 38% 38%, ${alpha(primaryColor, 0.95)}, ${primaryColor})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 0 2px ${alpha(primaryColor, 0.25)}, inset 0 1px 2px rgba(255,255,255,0.2)`,
                      position: 'relative',
                      zIndex: 3,
                    }}
                  >
                    {/* Spindle hole */}
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: '#0d0d0d',
                        position: 'absolute',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
                      }}
                    />
                    <Music
                      size="7"
                      variant="Bold"
                      color="#fff"
                      style={{ opacity: 0.75, position: 'absolute', top: '15%', left: '16%' }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* ── Tonearm ───────────────────────────────────── */}
              <Box
                component={motion.div}
                animate={{ rotate: isPlaying ? 30 : 0 }}
                transition={{ type: 'spring', stiffness: 75, damping: 18 }}
                sx={{
                  position: 'absolute',
                  top: { xs: 5, md: 6 },
                  right: { xs: 5, md: 6 },
                  width: { xs: 30, md: 36 },
                  height: { xs: 40, md: 48 },
                  zIndex: 10,
                  transformOrigin: 'top right',
                  pointerEvents: 'none',
                }}
              >
                {/* Pivot circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: { xs: 10, md: 12 },
                    height: { xs: 10, md: 12 },
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 32% 32%, #f0d06a, #7a5f20)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.25)',
                    zIndex: 11,
                  }}
                />
                {/* Arm shaft */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 4, md: 5 },
                    right: { xs: 4, md: 5 },
                    width: { xs: 3, md: 3.5 },
                    height: '84%',
                    background: 'linear-gradient(to right, #6b5320, #e8c85a, #c9a030, #6b5320)',
                    borderRadius: '2px',
                    boxShadow: '1px 0 5px rgba(0,0,0,0.45)',
                    transformOrigin: 'top center',
                  }}
                />
                {/* Head shell */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 2, md: 3 },
                    right: { xs: 9, md: 11 },
                    width: { xs: 11, md: 13 },
                    height: { xs: 7, md: 8 },
                    background: 'linear-gradient(145deg, #2e2e2e, #111)',
                    borderRadius: '2px 2px 4px 4px',
                    boxShadow: '0 3px 7px rgba(0,0,0,0.65)',
                    border: `0.5px solid ${alpha(primaryColor, 0.35)}`,
                  }}
                />
                {/* Stylus needle */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: -2, md: -2 },
                    right: { xs: 12, md: 14 },
                    width: 1.5,
                    height: { xs: 4, md: 5 },
                    bgcolor: '#b0b8c8',
                    borderRadius: '0 0 1px 1px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  }}
                />
              </Box>

              {/* ── LED indicator ─────────────────────────────── */}
              <Box
                component={motion.div}
                animate={isPlaying ? {
                  boxShadow: [
                    '0 0 6px 2px rgba(76,175,80,0.7), inset 0 1px 1px rgba(255,255,255,0.4)',
                    '0 0 14px 5px rgba(76,175,80,0.95), inset 0 1px 1px rgba(255,255,255,0.5)',
                    '0 0 6px 2px rgba(76,175,80,0.7), inset 0 1px 1px rgba(255,255,255,0.4)',
                  ]
                } : { boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                  position: 'absolute',
                  bottom: { xs: 5, md: 6 },
                  right: { xs: 7, md: 9 },
                  width: { xs: 8, md: 9 },
                  height: { xs: 8, md: 9 },
                  borderRadius: '50%',
                  bgcolor: isPlaying ? '#4caf50' : '#1a3020',
                  border: isPlaying ? '1px solid rgba(120,230,120,0.5)' : '1px solid rgba(0,0,0,0.3)',
                  transition: 'background-color 0.4s ease',
                  zIndex: 5,
                }}
              />

              {/* ── RPM label ─────────────────────────────────── */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: 7, md: 9 },
                  left: { xs: 7, md: 9 },
                  fontSize: '6px',
                  color: 'rgba(255,255,255,0.18)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  userSelect: 'none',
                  zIndex: 5,
                }}
              >
                33 RPM
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
