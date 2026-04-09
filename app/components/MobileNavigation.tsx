'use client';

import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, alpha, Typography } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import {
  Home,
  Calendar,
  Gallery,
  Location,
  People,
  Gift,
  Heart,
  PresentionChart,
  Category,
  HambergerMenu,
  MessageText1
} from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';


interface NavItem {
  id: string;
  label: string;
  isActive: boolean;
}

const iconMap: Record<string, any> = {
  home: <Home />,
  hero: <Home />,
  couple: <Heart />,
  schedule: <Calendar />,
  countdown: <PresentionChart />,
  gallery: <Gallery />,
  location: <Location />,
  rsvp: <People />,
  gift: <Gift />,
  guestbook: <MessageText1 />,
  mobileNav: <HambergerMenu />,
  poweredBy: <Category />,
};

export default function MobileNavigation({ items = [], primaryColor = '#8e7d5d' }: { items?: NavItem[], primaryColor?: string }) {
  const router = useRouter();
  const params = useParams();
  const [value, setValue] = React.useState(-1);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Filter items that are active AND have their corresponding section active on the page
  const activeItems = items.filter(i => i.isActive);

  // Determine what to display:
  // 1. If we have active items from the database/builder, use them.
  // 2. If no items are active but we have an items array (saved config), don't show defaults (trust the builder choice).
  // 3. ONLY show defaults if items array is completely missing/empty.
  const displayItems = activeItems.length > 0
    ? activeItems
    : (items.length > 0 ? [] : [
        { id: 'schedule', label: 'ตารางงาน', isActive: true },
        { id: 'rsvp', label: 'RSVP', isActive: true },
        { id: 'hero', label: '', isActive: true },
        { id: 'guestbook', label: 'Guestbook', isActive: true },
        { id: 'location', label: 'สถานที่', isActive: true }
      ]);

  const scrollToSection = async (id: string, index: number) => {
    if (isTransitioning) return;
    setValue(index);
    
    // Lock scroll and show transition
    document.body.style.overflow = 'hidden';
    setIsTransitioning(true);

    // Wait for the overlay to become fully opaque (transition duration 0.35s)
    setTimeout(() => {
      let targetId = (id === 'home' || id === 'hero') ? 'home' : id;
      if (targetId === 'schedule') targetId = 'schedule-anchor';
      
      const element = document.getElementById(targetId);
      
      if (element) {
        // Use a slightly larger offset for better visual alignment
        const topOffset = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: topOffset - 2,
          behavior: 'auto'
        });
      }
      
      // Allow a small window for the browser to paint the new position
      // before clearing the overlay and unlocking scroll
      setTimeout(() => {
        setIsTransitioning(false);
        document.body.style.overflow = 'unset';
      }, 100);
    }, 450); // Increased wait slightly to ensure curtain is solid
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff', 
              zIndex: 10000, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto', // Capture events during transition
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)'
            }}
          >
             <Box
               component={motion.div}
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
             >
               <Heart size="48" color={primaryColor} variant="Bold" />
             </Box>
          </Box>
        )}
      </AnimatePresence>

      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 2000,
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(142, 125, 93, 0.2)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.03)',
        pb: 'env(safe-area-inset-bottom)', 
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }}>
        {/* Animated Top Border Accent */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent 0%, rgba(142, 125, 93, 0.3) 50%, transparent 100%)' 
        }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            overflowX: displayItems.length > 5 ? 'auto' : 'visible',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitTapHighlightColor: 'transparent',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            WebkitOverflowScrolling: 'touch',
            px: 0,
            height: { xs: 68, md: 78 },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            justifyContent: displayItems.length > 5 ? 'flex-start' : 'space-evenly',
            gap: 0
          }}>
            {displayItems.map((item, idx) => {
              const isSelected = value === idx;
              const isMiddle = idx === Math.floor(displayItems.length / 2);

              if (isMiddle) {
                return (
                  <Box
                    key={item.id}
                    onClick={() => scrollToSection(item.id, idx)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flex: displayItems.length > 5 ? '0 0 auto' : 1,
                      minWidth: displayItems.length > 5 ? 85 : 'auto',
                      height: '100%',
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    <Box
                      component={motion.div}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        position: 'absolute',
                        top: { xs: -32, md: -42 },
                        width: { xs: 62, md: 72 },
                        height: { xs: 62, md: 72 },
                        borderRadius: '50%',
                        bgcolor: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 12px 30px ${alpha(primaryColor, 0.45)}`,
                        border: '5px solid rgba(255, 255, 255, 1)',
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.8)} 100%)`
                      }}
                    >
                      {React.cloneElement(iconMap[item.id] || <Category />, { 
                        size: 26, 
                        variant: isSelected ? "Bold" : "Outline",
                        color: '#fff'
                      })}
                    </Box>
                    <Typography 
                      sx={{
                        fontSize: { xs: '0.6rem', md: '0.68rem' },
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Prompt", sans-serif',
                        color: primaryColor,
                        mt: 5.5,
                        opacity: 1
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              }

              return (
                <Box
                  key={item.id}
                  onClick={() => scrollToSection(item.id, idx)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flex: displayItems.length > 5 ? '0 0 auto' : 1,
                    minWidth: displayItems.length > 5 ? 75 : 'auto',
                    height: '100%',
                    color: isSelected ? primaryColor : 'rgba(0,0,0,0.3)',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    '&:hover': {
                      color: primaryColor,
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    mb: 0.5,
                    zIndex: 1,
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}>
                    {React.cloneElement(iconMap[item.id] || <Category />, { 
                      size: 20, 
                      variant: isSelected ? "Bold" : "Outline",
                      color: 'currentColor'
                    })}
                  </Box>
                  <Typography 
                    sx={{
                      fontSize: { xs: '0.6rem', md: '0.68rem' },
                      fontWeight: isSelected ? 700 : 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      fontFamily: '"Prompt", sans-serif',
                      opacity: isSelected ? 1 : 0.65,
                      zIndex: 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}
