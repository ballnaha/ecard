'use client';

import React, { useState, useCallback } from 'react';
import { Box, Typography, Divider, Stack, Button, alpha, useMediaQuery, useTheme } from '@mui/material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Location as LocationIcon } from 'iconsax-react';

interface InvitationCoverProps {
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  googleMapsUrl?: string;
  onOpen: () => void;
  primaryColor?: string;
  coverBgType?: 'default' | 'color' | 'image';
  coverBgColor?: string;
  coverBgImage?: string;
  coverFloralShow?: boolean;
  coverFloralTopRightShow?: boolean;
  coverFloralBottomLeftShow?: boolean;
  coverFloralTopRight?: string;
  coverFloralBottomLeft?: string;
}

// Sparkle particle component for wax seal break
function SealParticle({ index, primaryColor }: { index: number; primaryColor: string }) {
  const angle = (index / 8) * Math.PI * 2;
  const distance = 60 + Math.random() * 80;
  const size = 3 + Math.random() * 5;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 0.8 + Math.random() * 0.4,
        ease: [0.2, 0.8, 0.2, 1],
        delay: Math.random() * 0.1,
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: index % 2 === 0
          ? `radial-gradient(circle, ${primaryColor}, ${alpha(primaryColor, 0.4)})`
          : `radial-gradient(circle, #c4956a, #8b6914)`,
        boxShadow: `0 0 ${size}px ${alpha(primaryColor, 0.5)}`,
      }}
    />
  );
}

// Pre-calculated stable dust particle data (avoids Math.random on re-renders)
const DUST_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  startX: 3 + ((i / 19) * 94) + Math.sin(i * 2.1) * 6,  // % from left, spread across screen
  size: 2 + Math.abs(Math.sin(i * 1.7)) * 3.5,
  duration: 32 + (i % 7) * 5,
  delay: -(i * 0.72),  // stagger start so they're already mid-flight on load
  driftX: Math.sin(i * 1.4) * 55,
  colorType: i % 3,  // 0=gold, 1=primary, 2=ivory
  opacityPeak: 0.45 + Math.abs(Math.sin(i * 0.9)) * 0.35,
}));

function DustParticle({ data, primaryColor }: { data: typeof DUST_PARTICLES[0]; primaryColor: string }) {
  const glowColor = data.colorType === 0 ? '#d4af37'
    : data.colorType === 1 ? primaryColor
    : '#f5e6c8';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${data.startX}%`,
        bottom: '-8px',
        width: data.size,
        height: data.size,
        borderRadius: '50%',
        backgroundColor: glowColor,
        boxShadow: `0 0 ${data.size * 3}px ${data.size * 1.5}px ${alpha(glowColor, 0.3)}`,
        pointerEvents: 'none',
        zIndex: 3,
      }}
      animate={{
        y: [0, -1200],
        x: [0, data.driftX],
        opacity: [0, data.opacityPeak, data.opacityPeak * 0.6, 0],
        scale: [0.4, 1.1, 0.9, 0.2],
      }}
      transition={{
        duration: data.duration,
        delay: data.delay,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.25, 0.7, 1],
      }}
    />
  );
}

export default function InvitationCover({
  brideName = 'Pla',
  groomName = 'Ball',
  eventDate = '07 . 12 . 2026',
  googleMapsUrl,
  onOpen,
  primaryColor = '#2d4a3e',
  coverBgType = 'default',
  coverBgColor = '#fdfcf0',
  coverBgImage,
  coverFloralShow = true,
  coverFloralTopRightShow = true,
  coverFloralBottomLeftShow = true,
  coverFloralTopRight,
  coverFloralBottomLeft,
}: InvitationCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'seal-break' | 'flap-open' | 'card-rise' | 'done'>('idle');
  const [mounted, setMounted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardControls = useAnimation();
  const flapControls = useAnimation();

  const isImageBg = coverBgType === 'image' && !!coverBgImage;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Manage body scroll based on cover visibility
  React.useEffect(() => {
    if (mounted && !isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mounted, isOpen]);

  const handleOpen = useCallback(async () => {
    if (phase !== 'idle') return;

    // Phase 1: Wax seal breaks immediately
    setPhase('seal-break');

    // Phase 2: Flap opens FASTER (Reduced from 600ms to 250ms for snappier feel)
    await new Promise(r => setTimeout(r, 250));
    setPhase('flap-open');

    // Animate flap
    flapControls.start({
      rotateX: 180,
      opacity: 0,
      transition: {
        rotateX: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.4, delay: 0.2, ease: 'easeOut' },
      }
    });

    // Phase 3: Card rises (Start earlier while flap is still moving)
    await new Promise(r => setTimeout(r, 400));
    setPhase('card-rise');

    cardControls.start({
      y: isMobile ? -150 : -200,
      rotateZ: -1.5,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 22,
        mass: 1.2,
        delay: 0.1,
      }
    });

    // Phase 4: Done
    await new Promise(r => setTimeout(r, 1500));
    setPhase('done');
    setIsOpen(true);
    onOpen();
  }, [phase, isMobile, onOpen, cardControls, flapControls]);

  const initials = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

  if (!mounted) return null;

  const envelopeWidth = isMobile ? 290 : 440;
  const topMargin = isMobile ? '80px' : '130px';

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="invitation-cover"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            height: '100dvh',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: coverBgType === 'color' ? coverBgColor
              : coverBgType === 'image' && coverBgImage ? 'none'
              : '#fdfcf0',
            backgroundImage: coverBgType === 'image' && coverBgImage
              ? `url(${coverBgImage})`
              : coverBgType === 'color'
                ? 'none'
                : `radial-gradient(ellipse at 50% 40%, #fffef7 0%, #fdf9e8 40%, #f0e9d0 80%, #e6ddc0 100%)`,  
            backgroundSize: coverBgType === 'image' ? 'cover' : undefined,
            backgroundPosition: coverBgType === 'image' ? 'center' : undefined,
            backgroundRepeat: coverBgType === 'image' ? 'no-repeat' : undefined,
            padding: '24px',
            overflow: 'hidden',
            willChange: 'opacity, transform',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        >
          {/* Silky Sheen Highlight — only for default and color modes */}
          {coverBgType !== 'image' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.05) 100%)',
              pointerEvents: 'none',
              zIndex: 1
            }} />
          )}

          {/* Paper Texture Overlay — for default and color modes */}
          {(coverBgType === 'default' || coverBgType === 'color') && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/images/natural-paper.png)',
              backgroundSize: '380px 380px',
              opacity: 0.55,
              pointerEvents: 'none',
              zIndex: 1
            }} />
          )}

          {/* Vignette corners — depth and luxury frame feel */}
          {coverBgType !== 'image' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.06) 0%, transparent 55%), radial-gradient(ellipse at 100% 0%, rgba(0,0,0,0.06) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(0,0,0,0.06) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.06) 0%, transparent 55%)',
              pointerEvents: 'none',
              zIndex: 1
            }} />
          )}

          {/* Dark vignette overlay for image backgrounds — ensures text readability */}
          {coverBgType === 'image' && coverBgImage && (
            <>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
              {/* Top gradient band for header text */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '45%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
              {/* Bottom gradient band for CTA text */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '30%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
            </>
          )}

          {/* Corner bracket decorations — luxury stationery look */}
          {coverBgType !== 'image' && [
            { top: '20px', left: '20px', borderTop: `1px solid ${alpha(primaryColor, 0.28)}`, borderLeft: `1px solid ${alpha(primaryColor, 0.28)}` },
            { top: '20px', right: '20px', borderTop: `1px solid ${alpha(primaryColor, 0.28)}`, borderRight: `1px solid ${alpha(primaryColor, 0.28)}` },
            { bottom: '88px', left: '20px', borderBottom: `1px solid ${alpha(primaryColor, 0.28)}`, borderLeft: `1px solid ${alpha(primaryColor, 0.28)}` },
            { bottom: '88px', right: '20px', borderBottom: `1px solid ${alpha(primaryColor, 0.28)}`, borderRight: `1px solid ${alpha(primaryColor, 0.28)}` },
          ].map((style, i) => (
            <div key={i} style={{ position: 'absolute', width: '32px', height: '32px', zIndex: 2, pointerEvents: 'none', ...style }} />
          ))}

          {/* ✨ Magical Dust Particles — ambient fairy-tale floating lights */}
          {(isMobile ? DUST_PARTICLES.slice(0, 12) : DUST_PARTICLES).map((data) => (
            <DustParticle key={data.id} data={data} primaryColor={primaryColor} />
          ))}

          {/* Main Content Area */}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>

            {/* Top Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', maxWidth: '600px', width: '100%', zIndex: 2, marginBottom: topMargin }}
            >
              <Typography sx={{
                fontSize: { xs: '0.7rem', md: '0.85rem' },
                letterSpacing: '0.4em',
                color: isImageBg ? 'rgba(255,255,255,0.85)' : '#94a3b8',
                mb: 1.5,
                fontWeight: 400,
                textTransform: 'uppercase',
                textShadow: isImageBg ? '0 1px 6px rgba(0,0,0,0.7)' : 'none',
              }}>
                The Wedding Of
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={{ xs: 1.5, md: 4 }}
                sx={{ mb: 1.5 }}
              >
                <Typography sx={{
                  fontFamily: 'var(--script-font)',
                  fontSize: { xs: '3rem', md: '4rem' },
                  color: isImageBg ? '#ffffff' : primaryColor,
                  lineHeight: 1,
                  textShadow: isImageBg ? '0 2px 12px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(0,0,0,0.05)',
                  letterSpacing: '0.02em'
                }}>
                  {brideName}
                </Typography>
                <Typography sx={{
                  fontSize: { xs: '1rem', md: '1.6rem' },
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  color: isImageBg ? 'rgba(255,255,255,0.7)' : '#cbd5e1',
                  mx: 1,
                  textShadow: isImageBg ? '0 1px 6px rgba(0,0,0,0.6)' : 'none',
                }}>
                  &amp;
                </Typography>
                <Typography sx={{
                  fontFamily: 'var(--script-font)',
                  fontSize: { xs: '2.8rem', md: '4rem' },
                  color: isImageBg ? '#ffffff' : primaryColor,
                  lineHeight: 1,
                  textShadow: isImageBg ? '0 2px 12px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(0,0,0,0.05)',
                  letterSpacing: '0.02em'
                }}>
                  {groomName}
                </Typography>
              </Stack>

              <Typography sx={{
                fontSize: { xs: '1rem', md: '1.3rem' },
                letterSpacing: '0.2em',
                color: isImageBg ? 'rgba(255,255,255,0.9)' : '#64748b',
                fontFamily: 'serif',
                mt: 1,
                fontWeight: 300,
                textShadow: isImageBg ? '0 1px 8px rgba(0,0,0,0.6)' : 'none',
              }}>
                {eventDate}
              </Typography>
            </motion.div>

            {/* Envelope 3D Container — Clicking the container itself now triggers the open action */}
            <motion.div
              onClick={handleOpen}
              initial={{ rotateX: isMobile ? 2 : 4, rotateY: isMobile ? -2 : -4, z: 0 }}
              whileHover={!isMobile ? {
                rotateX: 0,
                rotateY: 0,
                scale: 1.05,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              } : { scale: 1.02 }}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }} // Tactile feedback
              animate={phase === 'idle'
                ? { y: [0, -12, 0] }
                : { y: 0, rotateX: 0, rotateY: 0 }
              }
              transition={phase === 'idle'
                ? {
                  y: { duration: isMobile ? 3 : 4, repeat: Infinity, ease: 'easeInOut' },
                }
                : { duration: 0.8, ease: 'easeOut' }
              }
              style={{
                position: 'relative',
                width: `${envelopeWidth}px`,
                aspectRatio: '4/3',
                zIndex: 5,
                perspective: isMobile ? '1200px' : '2000px',
                transformStyle: 'preserve-3d',
                cursor: phase === 'idle' ? 'pointer' : 'default',
              }}
            >
              {/* Main Physical Shadow — Optimized for Mobile (less blur) */}
              <div style={{
                position: 'absolute',
                bottom: -20,
                left: '5%',
                width: '90%',
                height: '20px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 80%)',
                filter: isMobile ? 'blur(8px)' : 'blur(15px)',
                zIndex: 0,
                opacity: phase === 'idle' ? 0.8 : 0.3,
                transition: 'opacity 0.8s',
              }} />

              {/* Internal Floating wrapper */}
              <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d'
              }}>
                {/* White Flowers — fade out first when opening */}
                {coverFloralShow !== false && coverFloralTopRightShow !== false && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={phase !== 'idle' ? { opacity: 0, scale: 0.9, y: -20 } : {}}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ position: 'absolute', top: isMobile ? -40 : -60, right: isMobile ? -40 : -60, width: isMobile ? '140px' : '220px', height: isMobile ? '140px' : '220px', zIndex: 10, pointerEvents: 'none' }}
                  >
                    <img src={coverFloralTopRight || '/images/floral_tr1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </motion.div>
                )}
                {coverFloralShow !== false && coverFloralBottomLeftShow !== false && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={phase !== 'idle' ? { opacity: 0, scale: 0.9, y: 20 } : {}}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                    style={{ position: 'absolute', bottom: isMobile ? -25 : -40, left: isMobile ? -40 : -60, width: isMobile ? '130px' : '200px', height: isMobile ? '130px' : '200px', zIndex: 10, pointerEvents: 'none' }}
                  >
                    <img src={coverFloralBottomLeft || '/images/floral_bl1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </motion.div>
                )}

                {/* THE INVITATION CARD — sits inside envelope, rises up */}
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 0.95, rotateZ: 0 }}
                  animate={cardControls}
                  style={{
                    position: 'absolute',
                    top: '18%',
                    left: '5%',
                    width: '90%',
                    height: '78%',
                    backgroundColor: '#fff',
                    zIndex: 2,
                    boxShadow: phase === 'card-rise' || phase === 'done'
                      ? '0 30px 80px rgba(0,0,0,0.18), 0 8px 25px rgba(0,0,0,0.1)'
                      : '0 2px 10px rgba(0,0,0,0.05)',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    backgroundImage: 'url(/images/natural-paper.png)',
                    backgroundSize: '300px',
                    transition: 'box-shadow 0.6s ease',
                    transformStyle: 'preserve-3d',
                  }}
                >                {/* Luxury double-rule border frame */}
                <div style={{ position: 'absolute', inset: '8px', border: `1px solid ${alpha(primaryColor, 0.22)}`, borderRadius: '2px', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', inset: '13px', border: `0.5px solid ${alpha(primaryColor, 0.13)}`, borderRadius: '1px', pointerEvents: 'none', zIndex: 0 }} />
                {/* Corner diamond marks */}
                {[{ top: '12px', left: '12px' }, { top: '12px', right: '12px' }, { bottom: '12px', left: '12px' }, { bottom: '12px', right: '12px' }].map((pos, i) => (
                  <div key={i} style={{ position: 'absolute', width: '5px', height: '5px', ...pos, border: `0.5px solid ${alpha(primaryColor, 0.35)}`, transform: 'rotate(45deg)', pointerEvents: 'none', zIndex: 1 }} />
                ))}
                  {/* Inner card content with staggered reveal */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={phase === 'card-rise' || phase === 'done' ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: '24px',
                    }}
                  >
                    {/* Decorative top ornament */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={phase === 'card-rise' || phase === 'done' ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: '60px',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${alpha(primaryColor, 0.4)}, transparent)`,
                        marginBottom: '16px',
                      }}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={phase === 'card-rise' || phase === 'done' ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Typography sx={{
                        fontFamily: 'serif',
                        fontSize: { xs: '0.6rem', md: '0.95rem' },
                        letterSpacing: '0.4em',
                        color: alpha(primaryColor, 0.7),
                        mb: 1.5,
                        textTransform: 'uppercase',
                        fontWeight: 300,
                      }}>
                        Wedding Invitation
                      </Typography>
                    </motion.div>

                    <Divider sx={{ width: '40px', mb: 2, borderColor: alpha(primaryColor, 0.3) }} />

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={phase === 'card-rise' || phase === 'done' ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Typography sx={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        color: '#94a3b8',
                        textAlign: 'center',
                        mb: 2,
                        textTransform: 'uppercase',
                        fontFamily: 'serif',
                        opacity: 0.8,
                      }}>
                        To Celebrate The Marriage Of
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={phase === 'card-rise' || phase === 'done' ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <Typography sx={{
                        fontFamily: 'var(--script-font)',
                        fontSize: { xs: '1.2rem', md: '2.4rem' },
                        color: primaryColor,
                        lineHeight: 1.2,
                        textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        px: 2, // Added padding to prevent touching edges
                        textAlign: 'center',
                      }}>
                        {brideName} &amp; {groomName}
                      </Typography>
                    </motion.div>

                    {/* Decorative bottom ornament */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={phase === 'card-rise' || phase === 'done' ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: '40px',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${alpha(primaryColor, 0.3)}, transparent)`,
                        marginTop: '16px',
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* ENVELOPE BACK BODY */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: primaryColor,
                  zIndex: 1,
                  borderRadius: '4px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  backgroundImage: 'url("images/fancy-deboss.png"), url("/images/natural-paper.png")',
                  backgroundSize: 'cover',
                  backgroundBlendMode: 'overlay',
                }} />

                {/* INTERNAL ENVELOPE DEPTH (The dark interior) */}
                <div style={{
                  position: 'absolute',
                  inset: '2%',
                  bottom: '5%',
                  backgroundColor: alpha('#000', 0.4),
                  zIndex: 1.5,
                  borderRadius: '4px',
                  // Deep shadow inside to hide the card's bottom
                  background: `linear-gradient(to bottom, ${alpha('#000', 0.6)} 0%, ${alpha('#000', 0.2)} 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  boxShadow: 'inset 0 15px 30px rgba(0,0,0,0.4)',
                }} />

                {/* ENVELOPE TOP FLAP — opens with smooth fade-rotate */}
                <motion.div
                  initial={{ rotateX: 0, opacity: 1 }}
                  animate={flapControls}
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '50%',
                    backgroundColor: primaryColor,
                    transformOrigin: 'top',
                    borderRadius: '4px 4px 0 0',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    cursor: phase === 'idle' ? 'pointer' : 'default',
                    zIndex: 5,
                    backgroundImage: 'url("images/fancy-deboss.png"), url("/images/natural-paper.png")',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'soft-light',
                    boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.1)',
                  }}
                  onClick={handleOpen}
                >
                  {/* Flap lighting highlight */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }} />
                </motion.div>

                {/* ENVELOPE FRONT BODY (The Pocket) */}
                <div
                  onClick={handleOpen}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: primaryColor,
                    borderRadius: '4px',
                    zIndex: 4,
                    cursor: phase === 'idle' ? 'pointer' : 'default',
                    // Shape of the envelope pocket
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 48%, 100% 0)',
                    backgroundImage: 'url("images/fancy-deboss.png"), url("/images/natural-paper.png")',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'soft-light',
                    filter: isMobile ? 'brightness(0.92)' : 'contrast(1.15) brightness(0.92)',
                    boxShadow: isMobile ? 'inset 0 0 30px rgba(0,0,0,0.2)' : 'inset 0 0 50px rgba(0,0,0,0.3)',
                    border: isMobile ? 'none' : '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Silk sheen — layered for satin/velvet material feel */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(148deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 30%, transparent 55%, rgba(0,0,0,0.1) 100%)',
                    pointerEvents: 'none',
                    borderRadius: '4px',
                  }} />
                  {/* Top-edge specular catch */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '28%',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, transparent 100%)',
                    pointerEvents: 'none',
                    borderRadius: '4px 4px 0 0',
                  }} />

                  {/* Subtle pocket shadow highlight on top of the cut */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '48%',
                    background: `linear-gradient(to bottom, ${alpha('#000', 0.25)}, transparent)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    pointerEvents: 'none',
                    opacity: phase !== 'idle' ? 0.7 : 0,
                    transition: 'opacity 0.6s',
                  }} />
                  <motion.div
                    animate={phase !== 'idle' ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Typography sx={{
                      position: 'absolute',
                      top: '20%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: 'var(--script-font)',
                      fontSize: { xs: '1.6rem', md: '2.2rem' },
                      zIndex: 2,
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                      Invitation
                    </Typography>
                  </motion.div>
                </div>

                {/* Wax Seal — disappears instantly */}
                {phase === 'idle' && (
                  <motion.div
                    key="wax-seal"
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      cursor: 'pointer',
                    }}
                    onClick={handleOpen}
                  >
                    <Box sx={{
                      position: 'relative',
                      width: { xs: 80, md: 110 },
                      height: { xs: 80, md: 110 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.45))',
                    }}>
                      {/* Gold outer ring — luxury aura */}
                      <div style={{
                        position: 'absolute',
                        inset: '-10px',
                        borderRadius: '50%',
                        border: '1px solid rgba(212,175,55,0.5)',
                        boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 0 10px rgba(212,175,55,0.08)',
                        pointerEvents: 'none',
                      }} />
                      {/* Inner gold ring */}
                      <div style={{
                        position: 'absolute',
                        inset: '-4px',
                        borderRadius: '50%',
                        border: '0.5px solid rgba(212,175,55,0.3)',
                        pointerEvents: 'none',
                      }} />
                      <img
                        src="/images/wax-seal.png"
                        alt=""
                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <Typography sx={{
                        color: 'rgba(0,0,0,0.5)',
                        fontSize: { xs: '1.2rem', md: '1.6rem' },
                        fontWeight: 700,
                        fontFamily: 'var(--script-font)',
                        zIndex: 2,
                        opacity: 0.7
                      }}>
                        {initials}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={phase === 'idle'
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -10 }
              }
              transition={{
                duration: phase === 'idle' ? 1 : 0.4,
                delay: phase === 'idle' ? 0.6 : 0,
                ease: 'easeOut'
              }}
            >
              <Stack spacing={4} sx={{ mt: 6, alignItems: 'center' }}>
                <Typography 
                  sx={{
                    color: isImageBg ? 'rgba(255,255,255,0.85)' : '#94a3b8',
                    fontSize: { xs: '0.65rem', md: '0.75rem' },
                    mb: -3, // Offset the stack spacing
                    fontFamily: 'Prompt',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    opacity: 0.8,
                    textAlign: 'center',
                    textShadow: isImageBg ? '0 1px 6px rgba(0,0,0,0.7)' : 'none',
                  }}
                >
                  ขออภัยหากมิได้เรียนเชิญด้วยตัวเอง
                </Typography>
                <Typography
                  onClick={handleOpen}
                  sx={{
                    color: isImageBg ? 'rgba(255,255,255,0.9)' : '#334155',
                    fontFamily: 'serif',
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    letterSpacing: '0.3em',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    opacity: 0.6,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textShadow: isImageBg ? '0 1px 8px rgba(0,0,0,0.7)' : 'none',
                    '&:hover': { opacity: 1, color: isImageBg ? '#ffffff' : primaryColor, letterSpacing: '0.4em' },
                    animation: 'pulse 2s infinite ease-in-out',
                    '@keyframes pulse': { '0%, 100%': { opacity: 0.4 }, '50%': { opacity: 0.8 } }
                  }}
                >
                  Click here to open...
                </Typography>

                {googleMapsUrl && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      href={googleMapsUrl}
                      target="_blank"
                      startIcon={<LocationIcon variant="Bulk" size="20" color={primaryColor} />}
                      sx={{
                        px: 4, py: 1, borderRadius: '50px',
                        color: primaryColor, borderColor: alpha(primaryColor, 0.3),
                        fontFamily: 'Prompt', letterSpacing: '0.1em', fontSize: '0.8rem',
                        textTransform: 'none', bgcolor: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                        border: '1px solid', transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'white', borderColor: primaryColor, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }
                      }}
                    >
                      ดูแผนที่
                    </Button>
                  </motion.div>
                )}
              </Stack>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
