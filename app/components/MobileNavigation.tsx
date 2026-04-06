'use client';

import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, alpha } from '@mui/material';
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

  const scrollToSection = (id: string, index: number) => {
    setValue(index);
    if (id === 'guestbook') {
      router.push(`/${params.client}/guestbook`);
      return;
    }
    // Handle both 'home' and 'hero' IDs for the top section
    const targetId = (id === 'home' || id === 'hero') ? 'home' : id;
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: topOffset - 20,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: { xs: 15, md: 25 }, 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: { xs: '92%', sm: 'auto' }, 
      minWidth: { sm: 460 },
      zIndex: 2000 // Higher z-index to stay on top
    }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '35px',
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 15px 45px rgba(0,0,0,0.1)',
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            const selected = displayItems[newValue];
            scrollToSection(selected.id, newValue);
          }}
          sx={{
            height: 75,
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(0,0,0,0.35)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              minWidth: 'auto',
              padding: '12px 0',
              '&.Mui-selected': {
                color: primaryColor,
                '& .MuiSvgIcon-root, & .iconsax': {
                  transform: 'translateY(-4px) scale(1.15)',
                  color: primaryColor
                }
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontFamily: '"Prompt", sans-serif',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginTop: '5px',
              textTransform: 'uppercase',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                fontSize: '0.65rem',
                opacity: 1,
                color: primaryColor
              }
            }
          }}
        >
          {displayItems.map((item, idx) => (
            <BottomNavigationAction 
              key={item.id}
              label={item.label} 
              icon={React.cloneElement(iconMap[item.id] || <Category />, { 
                size: 24, 
                variant: value === idx ? "Bold" : "Outline",
                color: 'currentColor',
                className: 'iconsax'
              })} 
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
