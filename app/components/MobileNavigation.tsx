'use client';

import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  Map as LocationIcon,
  HowToReg as RsvpIcon,
  Draw as DrawIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function MobileNavigation() {
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const scrollToSection = (id: string, index: number) => {
    setValue(index);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: { xs: '90%', md: 'auto' }, minWidth: { md: 500 }, zIndex: 1000 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            const sectionIds = ['home', 'schedule', 'guestbook', 'rsvp', 'location'];
            if (sectionIds[newValue] === 'guestbook') {
              router.push('/guestbook');
            } else {
              scrollToSection(sectionIds[newValue], newValue);
            }
          }}
          sx={{
            height: 70,
            background: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              minWidth: 'auto',
              padding: '12px 0',
              '&.Mui-selected': {
                color: '#8e7d5d', // Gold color from CoupleSection
                '& .MuiSvgIcon-root': {
                  transform: 'translateY(-2px)',
                }
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginTop: '4px',
              textTransform: 'uppercase',
              '&.Mui-selected': {
                fontSize: '0.65rem',
              }
            }
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon sx={{ fontSize: '1.4rem' }} />} />
          <BottomNavigationAction label="Program" icon={<CalendarIcon sx={{ fontSize: '1.4rem' }} />} />
          <BottomNavigationAction label="Guestbook" icon={<DrawIcon sx={{ fontSize: '1.4rem' }} />} />
          <BottomNavigationAction label="RSVP" icon={<RsvpIcon sx={{ fontSize: '1.4rem' }} />} />
          <BottomNavigationAction label="Location" icon={<LocationIcon sx={{ fontSize: '1.4rem' }} />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
