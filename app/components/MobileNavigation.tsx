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
  const [value, setValue] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const activeItems = items.filter(i => i.isActive);

  // If there's an explicit config, use it. Otherwise fallback to defaults.
  const displayItems = activeItems.length > 0 
    ? activeItems 
    : (items.length > 0 ? [] : [
        { id: 'hero', label: 'Home', isActive: true },
        { id: 'schedule', label: 'Schedule', isActive: true },
        { id: 'rsvp', label: 'RSVP', isActive: true },
        { id: 'location', label: 'Location', isActive: true }
      ]);

  const scrollToSection = async (id: string, index: number) => {
    setValue(index);
    if (id === 'guestbook') {
      router.push(`/${params.client}/guestbook`);
      return;
    }

    // Start Fade Out
    setIsTransitioning(true);

    // Wait for fade out animation
    setTimeout(() => {
      const targetId = (id === 'home' || id === 'hero') ? 'home' : id;
      const element = document.getElementById(targetId);
      if (element) {
        const topOffset = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: topOffset - 20,
          behavior: 'auto' // Instant jump
        });
      }
      
      // Short delay to ensure scroll finished before fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 400);
  };

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff', 
              zIndex: 9999, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none' 
            }}
          >
             <Box
               component={motion.div}
               animate={{ scale: [1, 1.25, 1] }}
               transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
             >
               <Heart size="48" color={primaryColor} variant="Bold" />
             </Box>
          </Box>
        )}
      </AnimatePresence>

      <Box sx={{ 
        position: 'fixed', 
        bottom: { xs: 20, md: 30 }, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 2000,
        width: 'auto',
        maxWidth: '90vw'
      }}>
        <Paper
          elevation={0}
          sx={{
            px: { xs: 1, md: 2.5 },
            py: 1,
            borderRadius: '100px', // Ultra rounded for pill look
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(15px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 15px 35px rgba(142, 125, 93, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, md: 1 }
          }}
        >
          {displayItems.map((item, idx) => {
            const isSelected = value === idx;
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
                  minWidth: { xs: 65, md: 85 },
                  height: { xs: 52, md: 60 },
                  borderRadius: '100px',
                  color: isSelected ? primaryColor : 'rgba(0,0,0,0.35)',
                  bgcolor: isSelected ? alpha(primaryColor, 0.06) : 'transparent',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    bgcolor: alpha(primaryColor, 0.04),
                    color: primaryColor,
                  }
                }}
              >
                {/* Icon */}
                <Box sx={{ 
                  display: 'flex', 
                  mb: 0.5,
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'transform 0.4s ease'
                }}>
                  {React.cloneElement(iconMap[item.id] || <Category />, { 
                    size: isSelected ? 22 : 20, 
                    variant: isSelected ? "Bold" : "Outline",
                    color: 'currentColor'
                  })}
                </Box>

                {/* Label */}
                <Typography 
                  sx={{
                    fontSize: { xs: '0.55rem', md: '0.65rem' },
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    fontFamily: '"Prompt", sans-serif',
                    opacity: isSelected ? 1 : 0.7,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      </Box>
    </>
  );
}
