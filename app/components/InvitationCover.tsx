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
  coverStyle?: 'envelope' | 'scroll';
  coverEnvelopeShow?: boolean;
  coverFirefliesShow?: boolean;
  coverSnowShow?: boolean;
  coverFloralShow?: boolean;
  coverFloralTopRightShow?: boolean;
  coverFloralBottomLeftShow?: boolean;
  coverFloralTopRight?: string;
  coverFloralBottomLeft?: string;
  coverFloralTROffsetX?: number;
  coverFloralTROffsetY?: number;
  coverFloralBLOffsetX?: number;
  coverFloralBLOffsetY?: number;
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
const DUST_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  startX: 2 + ((i / 21) * 96) + Math.sin(i * 2.1) * 5,
  coreSize: 2 + (i % 3),
  glowSize: 12 + (i % 5) * 4,
  duration: 28 + (i % 8) * 4,
  // Use prime-based offsets to break regularity — no two fireflies sync up
  delay: -((i * 7.3 + Math.sin(i * 1.9) * 11) % (28 + (i % 8) * 4)),
  driftX: Math.sin(i * 1.4) * 50,
  colorType: i % 4,
}));

const SNOW_PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  startX: 1 + ((i / 25) * 98) + Math.sin(i * 1.7) * 4,
  startY: -8 - (i % 6) * 6,
  size: 3.2 + (i % 5) * 1.35,
  duration: 11 + (i % 5) * 2.6,
  delay: -((i * 4.7 + Math.sin(i * 2.3) * 7) % (12 + (i % 5) * 2.4)),
  driftA: Math.sin(i * 1.3) * (16 + (i % 3) * 6),
  driftB: Math.cos(i * 1.1) * (22 + (i % 4) * 5),
  opacity: 0.38 + (i % 4) * 0.11,
  blur: i % 3 === 0 ? 0 : i % 3 === 1 ? 0.45 : 0.9,
  depth: i % 3,
  rotate: (i * 37) % 360,
  twinkle: 0.84 + (i % 4) * 0.08,
}));

function DustParticle({ data }: { data: typeof DUST_PARTICLES[0] }) {
  // Warm yellow-green palette — classic firefly colors
  const core = data.colorType === 0 ? '#f0ff70'
    : data.colorType === 1 ? '#d8ff50'
    : data.colorType === 2 ? '#ffe566'
    : '#b8f060';
  const glow = data.colorType === 0 ? '#aadd00'
    : data.colorType === 1 ? '#99cc00'
    : data.colorType === 2 ? '#ddaa00'
    : '#88cc44';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${data.startX}%`,
        bottom: '-4px',
        pointerEvents: 'none',
        zIndex: 3,
        willChange: 'transform, opacity',
      }}
      animate={{
        y: [0, -1100],
        x: [0, data.driftX],
        opacity: [0, 0, 1, 0.08, 0.95, 0.05, 1, 0.12, 0.9, 0.04, 0],
      }}
      transition={{
        duration: data.duration,
        delay: data.delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.04, 0.14, 0.24, 0.38, 0.5, 0.6, 0.72, 0.82, 0.92, 1],
      }}
    >
      {/* Outer soft glow — large diffuse halo */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: data.glowSize * 2,
        height: data.glowSize * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(glow, 0.55)} 0%, ${alpha(glow, 0.15)} 50%, transparent 75%)`,
      }} />
      {/* Inner bright core — tiny sharp point of light */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: data.coreSize,
        height: data.coreSize,
        borderRadius: '50%',
        background: core,
        boxShadow: `0 0 ${data.coreSize * 3}px ${data.coreSize * 1.5}px ${alpha(core, 0.9)}`,
      }} />
    </motion.div>
  );
}

function SnowParticle({ data }: { data: typeof SNOW_PARTICLES[0] }) {
  const isNear = data.depth === 0;
  const isMid = data.depth === 1;
  const coreColor = isNear ? 'rgba(255,255,255,0.98)' : isMid ? 'rgba(245,250,255,0.95)' : 'rgba(232,242,255,0.9)';
  const edgeColor = isNear ? 'rgba(210,228,255,0.55)' : isMid ? 'rgba(220,234,255,0.42)' : 'rgba(220,235,255,0.28)';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${data.startX}%`,
        top: `${data.startY}%`,
        width: data.size,
        height: data.size,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 4,
        filter: `blur(${data.blur}px)`,
        willChange: 'transform, opacity',
      }}
      animate={{
        y: ['0vh', '112vh'],
        x: [0, data.driftA, -data.driftB, data.driftA * 0.35],
        opacity: [0, data.opacity * 0.9, data.opacity * data.twinkle, data.opacity * 0.72, 0],
        scale: [0.72, 1, data.twinkle, 0.88, 0.7],
        rotate: [data.rotate, data.rotate + 28, data.rotate - 18, data.rotate + 45],
      }}
      transition={{
        duration: data.duration,
        delay: data.delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.12, 0.45, 0.82, 1],
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${coreColor} 0%, ${edgeColor} 58%, rgba(255,255,255,0.04) 100%)`,
          boxShadow: isNear
            ? '0 0 12px rgba(255,255,255,0.38)'
            : isMid
              ? '0 0 8px rgba(255,255,255,0.24)'
              : '0 0 6px rgba(255,255,255,0.14)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: isNear ? '160%' : '135%',
          height: isNear ? 1.3 : 1,
          transform: 'translate(-50%, -50%)',
          borderRadius: 999,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)',
          opacity: isNear ? 0.82 : isMid ? 0.55 : 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: isNear ? 1.3 : 1,
          height: isNear ? '160%' : '135%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 999,
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,0) 100%)',
          opacity: isNear ? 0.82 : isMid ? 0.55 : 0.3,
        }}
      />
    </motion.div>
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
  coverStyle,
  coverEnvelopeShow = true,
  coverFirefliesShow = true,
  coverSnowShow = false,
  coverFloralShow = true,
  coverFloralTopRightShow = true,
  coverFloralBottomLeftShow = true,
  coverFloralTopRight,
  coverFloralBottomLeft,
  coverFloralTROffsetX = 0,
  coverFloralTROffsetY = 0,
  coverFloralBLOffsetX = 0,
  coverFloralBLOffsetY = 0,
}: InvitationCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'seal-break' | 'flap-open' | 'card-rise' | 'done'>('idle');
  const [mounted, setMounted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardControls = useAnimation();
  const flapControls = useAnimation();

  const isImageBg = coverBgType === 'image' && !!coverBgImage;
  const resolvedCoverStyle = coverStyle || (coverEnvelopeShow === false ? 'scroll' : 'envelope');
  const isScrollMode = resolvedCoverStyle === 'scroll';

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

    // Phase 1: Start the opening sequence
    setPhase('seal-break');

    // Phase 2: Flap opens FASTER (Reduced from 600ms to 250ms for snappier feel)
    await new Promise(r => setTimeout(r, 250));
    setPhase('flap-open');

    // Animate flap
    flapControls.start(
      isScrollMode
        ? {
            scaleY: 0.15,
            y: -10,
            opacity: 0,
            transition: {
              scaleY: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
              y: { duration: 0.5, ease: 'easeOut' },
              opacity: { duration: 0.35, delay: 0.12, ease: 'easeOut' },
            }
          }
        : {
            rotateX: 180,
            opacity: 0,
            transition: {
              rotateX: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.4, delay: 0.2, ease: 'easeOut' },
            }
          }
    );

    // Phase 3: Card rises (Start earlier while flap is still moving)
    await new Promise(r => setTimeout(r, 400));
    setPhase('card-rise');

    cardControls.start({
      y: isScrollMode ? (isMobile ? -115 : -145) : (isMobile ? -150 : -200),
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
  }, [phase, isMobile, isScrollMode, onOpen, cardControls, flapControls]);

  const initials = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

  if (!mounted) return null;

  const shellWidth = isMobile ? 290 : 440;
  const shellAspectRatio = '4 / 3';
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

          {coverSnowShow !== false && (isMobile ? SNOW_PARTICLES.slice(0, 16) : SNOW_PARTICLES).map((data) => (
            <SnowParticle key={data.id} data={data} />
          ))}

          {/* ✨ Magical Dust Particles — ambient fairy-tale floating lights */}
          {coverFirefliesShow !== false && (isMobile ? DUST_PARTICLES.slice(0, 12) : DUST_PARTICLES).map((data) => (
            <DustParticle key={data.id} data={data} />
          ))}

          {/* Main Content Area */}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>

            {/* Top Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', maxWidth: '600px', width: '100%', zIndex: 2, marginBottom: isScrollMode ? (isMobile ? '40px' : '60px') : topMargin }}
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

            {/* Cover Shell — scroll or envelope */}
            {isScrollMode ? (
              /* ===== SCROLL MODE — beautiful ancient Chinese scroll ===== */
              (() => {
                const rodW = isMobile ? 248 : 330;
                const rodH = 34;
                const knobW = 33;
                const knobH = 54;
                const paperW = rodW;
                const paperH = isMobile ? 318 : 420;

                // Lacquered dark bamboo rod  
                const Rod = ({ isBottom }: { isBottom?: boolean }) => (
                  <div style={{ position: 'relative', width: rodW, height: rodH, flexShrink: 0, zIndex: 3 }}>
                    {/* ── Left knob ── */}
                    <div style={{
                      position: 'absolute', left: -knobW + 3, top: '50%', transform: 'translateY(-50%)',
                      width: knobW, height: knobH, borderRadius: '5px',
                      background: isBottom
                        ? 'linear-gradient(180deg, #9c5e28 0%, #6e3c14 40%, #56300e 70%, #8a5020 100%)'
                        : 'linear-gradient(180deg, #8a5020 0%, #56300e 40%, #6e3c14 70%, #9c5e28 100%)',
                      boxShadow: '4px 0 10px rgba(0,0,0,0.5), inset 1px 0 4px rgba(255,215,130,0.25)',
                    }}>
                      {[18, 48, 78].map(p => (
                        <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 2.5, background: 'linear-gradient(90deg, rgba(0,0,0,0.8), rgba(255,190,80,0.2) 50%, rgba(0,0,0,0.8))' }} />
                      ))}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: 'linear-gradient(180deg, rgba(210,160,40,0.35) 0%, transparent 100%)', borderRadius: '5px 5px 0 0' }} />
                      <div style={{ position: 'absolute', top: 5, left: 4, right: 4, height: '26%', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,210,120,0.22) 0%, transparent 100%)' }} />
                      {/* Tassel — hangs below bottom knob only */}
                      {isBottom && (
                        <div style={{ position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {/* Silk cord */}
                          <div style={{ width: 4, height: 18, background: 'linear-gradient(180deg, #8b0000 0%, #c0392b 100%)', borderRadius: '0 0 2px 2px' }} />
                          {/* Tassel cap */}
                          <div style={{ width: 12, height: 5, background: 'linear-gradient(180deg, #8b0000 0%, #c0392b 100%)', borderRadius: '2px 2px 0 0', marginTop: -1 }} />
                          {/* Fringe */}
                          <div style={{ display: 'flex', gap: 2, marginTop: 1 }}>
                            {[-1, 0, 1, 2, 3].map(x => (
                              <div key={x} style={{ width: 1.5, height: 10 + Math.abs(x - 1) * 2, background: `rgba(192,57,43,${0.7 + x * 0.04})`, borderRadius: '0 0 999px 999px' }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* ── Right knob ── */}
                    <div style={{
                      position: 'absolute', right: -knobW + 3, top: '50%', transform: 'translateY(-50%)',
                      width: knobW, height: knobH, borderRadius: '5px',
                      background: isBottom
                        ? 'linear-gradient(180deg, #8a5020 0%, #56300e 40%, #6e3c14 70%, #9c5e28 100%)'
                        : 'linear-gradient(180deg, #9c5e28 0%, #6e3c14 40%, #56300e 70%, #8a5020 100%)',
                      boxShadow: '-4px 0 10px rgba(0,0,0,0.5), inset -1px 0 4px rgba(255,215,130,0.25)',
                    }}>
                      {[18, 48, 78].map(p => (
                        <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 2.5, background: 'linear-gradient(90deg, rgba(0,0,0,0.8), rgba(255,190,80,0.2) 50%, rgba(0,0,0,0.8))' }} />
                      ))}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: 'linear-gradient(180deg, rgba(210,160,40,0.35) 0%, transparent 100%)', borderRadius: '5px 5px 0 0' }} />
                      <div style={{ position: 'absolute', top: 5, left: 4, right: 4, height: '26%', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,210,120,0.22) 0%, transparent 100%)' }} />
                      {isBottom && (
                        <div style={{ position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 4, height: 18, background: 'linear-gradient(180deg, #8b0000 0%, #c0392b 100%)', borderRadius: '0 0 2px 2px' }} />
                          <div style={{ width: 12, height: 5, background: 'linear-gradient(180deg, #8b0000 0%, #c0392b 100%)', borderRadius: '2px 2px 0 0', marginTop: -1 }} />
                          <div style={{ display: 'flex', gap: 2, marginTop: 1 }}>
                            {[-1, 0, 1, 2, 3].map(x => (
                              <div key={x} style={{ width: 1.5, height: 10 + Math.abs(x - 1) * 2, background: `rgba(192,57,43,${0.7 + x * 0.04})`, borderRadius: '0 0 999px 999px' }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* ── Rod body — warm lacquered bamboo ── */}
                    <div style={{
                      width: '100%', height: rodH,
                      /* Flat on inner face (toward paper), rounded only on outer edge */
                      borderRadius: isBottom ? '0 0 4px 4px' : '4px 4px 0 0',
                      background: 'linear-gradient(180deg, #d49850 0%, #a86830 15%, #7a4618 32%, #6a3c14 50%, #7e4a1c 68%, #a86030 83%, #cc9040 100%)',
                      boxShadow: '0 8px 22px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.35)',
                    }}>
                      {/* Lacquer gloss highlight */}
                      <div style={{ position: 'absolute', top: 2, left: '5%', right: '5%', height: 4, borderRadius: 999, background: 'rgba(255,210,130,0.32)' }} />
                      {/* Bamboo nodes */}
                      {[18, 50, 82].map(p => (
                        <div key={p} style={{ position: 'absolute', top: '10%', left: `${p}%`, width: 3, height: '80%', borderRadius: 999, background: 'rgba(0,0,0,0.45)', boxShadow: '1px 0 3px rgba(255,170,60,0.18)' }} />
                      ))}
                      {/* Wood grain */}
                      {[8, 24, 40, 60, 76, 92].map(p => (
                        <div key={p} style={{ position: 'absolute', top: '12%', left: `${p}%`, width: '5%', height: '40%', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.22) 50%, transparent)', borderRadius: 999 }} />
                      ))}
                    </div>
                    {/* Shadow onto paper */}
                    <div style={{ position: 'absolute', bottom: -12, left: '2%', width: '96%', height: 12, background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 100%)', pointerEvents: 'none' }} />
                  </div>
                );

                // ribbonVisible: true only while idle — inlined to avoid component remount bug
                const closedBodyH = isMobile ? 24 : 32;

                // Corner bracket ornament (Chinese 回字角)
                const CornerBracket = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
                  const isRight = pos === 'tr' || pos === 'br';
                  const isBottom = pos === 'bl' || pos === 'br';
                  return (
                    <div style={{
                      position: 'absolute', zIndex: 5, pointerEvents: 'none',
                      top: isBottom ? 'auto' : 24, bottom: isBottom ? 24 : 'auto',
                      left: isRight ? 'auto' : 24, right: isRight ? 24 : 'auto',
                      width: 20, height: 20,
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(155,15,15,0.65)', borderRadius: 1 }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(155,15,15,0.65)', borderRadius: 1 }} />
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 2, background: 'rgba(155,15,15,0.65)', borderRadius: 1 }} />
                      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 2, background: 'rgba(155,15,15,0.65)', borderRadius: 1 }} />
                      {/* Inner mini frame */}
                      <div style={{ position: 'absolute', inset: 5, border: '1px solid rgba(180,120,10,0.4)', borderRadius: 1 }} />
                      {/* Diamond centre */}
                      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, transform: 'translate(-50%, -50%) rotate(45deg)', background: 'rgba(190,130,15,0.7)' }} />
                    </div>
                  );
                };

                return (
                  <motion.div
                    onClick={handleOpen}
                    animate={phase === 'idle' ? { y: [0, -10, 0] } : { y: 0 }}
                    transition={phase === 'idle'
                      ? { y: { duration: isMobile ? 3 : 4, repeat: Infinity, ease: 'easeInOut' } }
                      : { duration: 0.8, ease: 'easeOut' }
                    }
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: phase === 'idle' ? 'pointer' : 'default', zIndex: 5, position: 'relative' }}
                  >
                    <Rod />

                    {/* ── Closed scroll cylinder body — visible when idle, collapses on open ── */}
                    <motion.div
                      initial={{ height: closedBodyH, opacity: 1 }}
                      animate={phase !== 'idle' ? { height: 0, opacity: 0 } : { height: closedBodyH, opacity: 1 }}
                      transition={{ duration: 0.28, ease: 'easeIn' }}
                      style={{
                        width: paperW, overflow: 'hidden', flexShrink: 0, position: 'relative',
                        /* Rolled paper cylinder: top/bottom dark, warm centre */
                        backgroundColor: '#f0d898',
                        backgroundImage: 'linear-gradient(180deg, rgba(110,55,8,0.52) 0%, rgba(240,200,120,0.12) 18%, transparent 38%, transparent 62%, rgba(240,200,120,0.12) 82%, rgba(110,55,8,0.52) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'inset 8px 0 16px rgba(80,28,4,0.14), inset -8px 0 16px rgba(80,28,4,0.14)',
                      }}
                    >
                      {/* Top roll shadow */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(180deg, rgba(40,14,3,0.52) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
                      {/* Left red border */}
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 15, background: 'linear-gradient(90deg, rgba(130,10,10,0.78) 0%, rgba(130,10,10,0.55) 65%, rgba(175,120,8,0.22) 100%)', zIndex: 3, pointerEvents: 'none' }} />
                      {/* Right red border */}
                      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 15, background: 'linear-gradient(270deg, rgba(130,10,10,0.78) 0%, rgba(130,10,10,0.55) 65%, rgba(175,120,8,0.22) 100%)', zIndex: 3, pointerEvents: 'none' }} />
                    </motion.div>

                    {/* ── Parchment — unrolls downward ── */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={phase !== 'idle' ? { height: paperH } : { height: 0 }}
                      transition={{ duration: 1.4, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: paperW, overflow: 'hidden', position: 'relative',
                        backgroundColor: '#f2e4bc',
                        backgroundImage: [
                          /* Bright centre — text stays readable */
                          'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(255,250,225,0.88) 0%, transparent 80%)',
                          /* Age blotch top-left */
                          'radial-gradient(ellipse 38% 22% at 16% 20%, rgba(145,90,25,0.2) 0%, transparent 100%)',
                          /* Age blotch bottom-right */
                          'radial-gradient(ellipse 32% 18% at 80% 76%, rgba(120,72,18,0.16) 0%, transparent 100%)',
                          /* Top/bottom edge darkening */
                          'linear-gradient(180deg, rgba(115,58,8,0.28) 0%, transparent 22%, transparent 78%, rgba(115,58,8,0.28) 100%)',
                          /* Left/right edge darkening */
                          'linear-gradient(90deg, rgba(115,58,8,0.22) 0%, transparent 16%, transparent 84%, rgba(115,58,8,0.22) 100%)',
                        ].join(', '),
                        boxShadow: 'inset 8px 0 18px rgba(80,28,4,0.16), inset -8px 0 18px rgba(80,28,4,0.16)',
                      }}
                    >
                      {/* Top curl shadow */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 24, background: 'linear-gradient(180deg, rgba(35,12,3,0.5) 0%, transparent 100%)', zIndex: 7, pointerEvents: 'none' }} />
                      {/* Bottom curl shadow */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, background: 'linear-gradient(0deg, rgba(35,12,3,0.5) 0%, transparent 100%)', zIndex: 7, pointerEvents: 'none' }} />

                      {/* Washi/silk weave grid — vertical fibres */}
                      {[9, 18, 28, 38, 47, 56, 66, 76, 85, 94].map(p => (
                        <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(155,105,35,0.065)', pointerEvents: 'none', zIndex: 1 }} />
                      ))}
                      {/* Horizontal fibres */}
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(p => (
                        <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 1, background: 'rgba(155,105,35,0.065)', pointerEvents: 'none', zIndex: 1 }} />
                      ))}

                      {/* Left red border strip */}
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 15, background: 'linear-gradient(90deg, rgba(135,10,10,0.82) 0%, rgba(135,10,10,0.62) 65%, rgba(175,120,8,0.3) 100%)', zIndex: 4, pointerEvents: 'none' }} />
                      {/* Left gold accent line */}
                      <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, transparent 4%, rgba(195,148,18,0.65) 20%, rgba(195,148,18,0.65) 80%, transparent 96%)', zIndex: 4, pointerEvents: 'none' }} />
                      {/* Right red border strip */}
                      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 15, background: 'linear-gradient(270deg, rgba(135,10,10,0.82) 0%, rgba(135,10,10,0.62) 65%, rgba(175,120,8,0.3) 100%)', zIndex: 4, pointerEvents: 'none' }} />
                      {/* Right gold accent line */}
                      <div style={{ position: 'absolute', right: 15, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, transparent 4%, rgba(195,148,18,0.65) 20%, rgba(195,148,18,0.65) 80%, transparent 96%)', zIndex: 4, pointerEvents: 'none' }} />

                      {/* Outer ink frame */}
                      <div style={{ position: 'absolute', inset: '12px 24px', border: '2px solid rgba(75,30,6,0.42)', pointerEvents: 'none', zIndex: 3 }} />
                      {/* Inner ink frame */}
                      <div style={{ position: 'absolute', inset: '19px 31px', border: '0.75px solid rgba(75,30,6,0.26)', pointerEvents: 'none', zIndex: 3 }} />

                      {/* ── Content ── */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={phase === 'card-rise' || phase === 'done' ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.9, delay: 0.5 }}
                        style={{ padding: '28px 32px', textAlign: 'center', position: 'relative', zIndex: 6 }}
                      >
                        {/* Corner bracket ornaments */}
                        {(['tl', 'tr', 'bl', 'br'] as const).map(p => <CornerBracket key={p} pos={p} />)}

                        {/* Double brush-line ornament — top */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={phase === 'card-rise' || phase === 'done' ? { scaleX: 1 } : {}}
                          transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                          style={{ margin: '0 auto 14px', width: 80, height: 10, position: 'relative' }}
                        >
                          <div style={{ position: 'absolute', top: 1, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(145,15,10,0.72), transparent)', borderRadius: 999 }} />
                          <div style={{ position: 'absolute', top: 6, left: 10, right: 10, height: 1, background: 'linear-gradient(90deg, transparent, rgba(180,125,8,0.62), transparent)', borderRadius: 999 }} />
                        </motion.div>

                        <Typography sx={{ fontFamily: 'serif', fontSize: { xs: '0.58rem', md: '0.73rem' }, letterSpacing: '0.5em', color: 'rgba(95,32,8,0.88)', mb: 1.5, textTransform: 'uppercase' }}>
                          Wedding Invitation
                        </Typography>

                        {/* Diamond divider */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 1, background: 'rgba(130,48,12,0.42)' }} />
                          <div style={{ width: 6, height: 6, background: 'rgba(170,95,8,0.72)', transform: 'rotate(45deg)' }} />
                          <div style={{ width: 28, height: 1, background: 'rgba(130,48,12,0.42)' }} />
                        </div>

                        <Typography sx={{ fontSize: '0.54rem', letterSpacing: '0.2em', color: 'rgba(88,42,10,0.72)', mb: 2, textTransform: 'uppercase', fontFamily: 'serif', fontStyle: 'italic' }}>
                          To Celebrate The Marriage Of
                        </Typography>

                        <Typography sx={{
                          fontFamily: 'var(--script-font)', fontSize: { xs: '1.55rem', md: '2.25rem' },
                          color: 'rgba(60,20,4,0.95)', lineHeight: 1.25,
                          textShadow: '1px 1px 0 rgba(215,165,65,0.38), 0 2px 14px rgba(90,32,4,0.1)',
                          px: 1, textAlign: 'center',
                        }}>
                          {brideName} &amp; {groomName}
                        </Typography>

                        {/* Red seal stamp (印章) */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0, rotate: -15 }}
                          animate={phase === 'card-rise' || phase === 'done' ? { scale: 1, opacity: 1, rotate: -8 } : {}}
                          transition={{ duration: 0.55, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                          style={{ margin: '14px auto 0', width: 36, height: 36 }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 3,
                            background: 'rgba(155,12,12,0.88)',
                            boxShadow: '0 2px 10px rgba(110,8,8,0.5), inset 0 0 6px rgba(0,0,0,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(200,100,80,0.3)',
                          }}>
                            <div style={{ position: 'absolute', inset: 3, border: '0.5px solid rgba(255,200,180,0.25)', borderRadius: 1 }} />
                            <span style={{ fontSize: 18, color: 'rgba(255,225,190,0.95)', fontFamily: 'serif', lineHeight: 1, textShadow: '0 0 5px rgba(255,140,50,0.35)', userSelect: 'none', position: 'relative', zIndex: 1 }}>囍</span>
                          </div>
                        </motion.div>

                        {/* Double brush-line ornament — bottom */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={phase === 'card-rise' || phase === 'done' ? { scaleX: 1 } : {}}
                          transition={{ duration: 0.9, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
                          style={{ margin: '12px auto 0', width: 64, height: 10, position: 'relative' }}
                        >
                          <div style={{ position: 'absolute', top: 1, left: 8, right: 8, height: 1, background: 'linear-gradient(90deg, transparent, rgba(180,125,8,0.62), transparent)', borderRadius: 999 }} />
                          <div style={{ position: 'absolute', top: 6, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(145,15,10,0.72), transparent)', borderRadius: 999 }} />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <Rod isBottom />

                    {/* Floor shadow */}
                    <div style={{ width: '42%', height: 16, marginTop: 48, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)', filter: 'blur(8px)' }} />
                  </motion.div>
                );
              })()
            ) : (
              /* ===== ENVELOPE MODE (original) ===== */
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
                width: `${shellWidth}px`,
                aspectRatio: shellAspectRatio,
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
                    style={{ position: 'absolute', top: `${-18 + coverFloralTROffsetY}%`, right: `${-14 + (-coverFloralTROffsetX)}%`, width: '50%', height: 'auto', zIndex: 10, pointerEvents: 'none' }}
                  >
                    <img src={coverFloralTopRight || '/images/floral_tr1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </motion.div>
                )}
                {coverFloralShow !== false && coverFloralBottomLeftShow !== false && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={phase !== 'idle' ? { opacity: 0, scale: 0.9, y: 20 } : {}}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                    style={{ position: 'absolute', bottom: `${-12 + (-coverFloralBLOffsetY)}%`, left: `${-14 + coverFloralBLOffsetX}%`, width: '46%', height: 'auto', zIndex: 10, pointerEvents: 'none' }}
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
                    top: isScrollMode ? '11%' : '18%',
                    left: isScrollMode ? '12%' : '5%',
                    width: isScrollMode ? '76%' : '90%',
                    height: isScrollMode ? '80%' : '78%',
                    backgroundColor: isScrollMode ? '#f8f0db' : '#fff',
                    zIndex: 2,
                    boxShadow: phase === 'card-rise' || phase === 'done'
                      ? '0 30px 80px rgba(0,0,0,0.18), 0 8px 25px rgba(0,0,0,0.1)'
                      : '0 2px 10px rgba(0,0,0,0.05)',
                    borderRadius: isScrollMode ? '20px' : '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    border: isScrollMode ? `1px solid ${alpha('#8b5e34', 0.18)}` : '1px solid rgba(0,0,0,0.06)',
                    backgroundImage: 'url(/images/natural-paper.png)',
                    backgroundSize: '300px',
                    transition: 'box-shadow 0.6s ease',
                    transformStyle: 'preserve-3d',
                  }}
                >                {/* Luxury double-rule border frame */}
                <div style={{ position: 'absolute', inset: isScrollMode ? '10px' : '8px', border: `1px solid ${alpha(primaryColor, isScrollMode ? 0.28 : 0.22)}`, borderRadius: isScrollMode ? '16px' : '2px', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', inset: isScrollMode ? '16px' : '13px', border: `0.5px solid ${alpha(primaryColor, isScrollMode ? 0.18 : 0.13)}`, borderRadius: isScrollMode ? '12px' : '1px', pointerEvents: 'none', zIndex: 0 }} />
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

                {/* Envelope elements */}
                  <>
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

                    <div style={{
                      position: 'absolute',
                      inset: '2%',
                      bottom: '5%',
                      backgroundColor: alpha('#000', 0.4),
                      zIndex: 1.5,
                      borderRadius: '4px',
                      background: `linear-gradient(to bottom, ${alpha('#000', 0.6)} 0%, ${alpha('#000', 0.2)} 100%)`,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      boxShadow: 'inset 0 15px 30px rgba(0,0,0,0.4)',
                    }} />

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
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }} />
                    </motion.div>

                    <div
                      onClick={handleOpen}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: primaryColor,
                        borderRadius: '4px',
                        zIndex: 4,
                        cursor: phase === 'idle' ? 'pointer' : 'default',
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 48%, 100% 0)',
                        backgroundImage: 'url("images/fancy-deboss.png"), url("/images/natural-paper.png")',
                        backgroundSize: 'cover',
                        backgroundBlendMode: 'soft-light',
                        filter: isMobile ? 'brightness(0.92)' : 'contrast(1.15) brightness(0.92)',
                        boxShadow: isMobile ? 'inset 0 0 30px rgba(0,0,0,0.2)' : 'inset 0 0 50px rgba(0,0,0,0.3)',
                        border: isMobile ? 'none' : '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(148deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 30%, transparent 55%, rgba(0,0,0,0.1) 100%)',
                        pointerEvents: 'none',
                        borderRadius: '4px',
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '28%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, transparent 100%)',
                        pointerEvents: 'none',
                        borderRadius: '4px 4px 0 0',
                      }} />

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
                  </>

                {/* Wax Seal */}
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
            )} {/* end scroll/envelope branch */}

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
                  {isScrollMode ? 'Click here to unroll...' : 'Click here to open...'}
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
