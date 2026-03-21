'use client';

import React from 'react';
import { Button, Stack, Typography, Box } from '@mui/material';
import { CalendarMonth as CalendarIcon, Apple as AppleIcon, Google as GoogleIcon } from '@mui/icons-material';

export default function CalendarButton() {
  const eventDetails = {
    title: 'Wedding: Mook & Top',
    location: 'The Glasshouse Estate, Chiang Mai',
    description: 'We are so excited to have you celebrate our special day with us!',
    startDate: '20260514T110000',
    endDate: '20260514T210000'
  };

  const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

  const createIcsFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${eventDetails.startDate}`,
      `DTEND:${eventDetails.endDate}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding-mook-top.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography sx={{ 
        fontFamily: '"Montserrat", sans-serif', 
        fontSize: '0.7rem', 
        letterSpacing: '0.3em', 
        color: '#8e7d5d', 
        mb: 3,
        textTransform: 'uppercase',
        fontWeight: 600
      }}>
        Add to Calendar
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        justifyContent="center" 
        alignItems="center"
      >
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          href={googleUrl}
          target="_blank"
          sx={{
            borderColor: 'rgba(142, 125, 93, 0.3)',
            color: '#1a1a1a',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            px: 4,
            py: 1.5,
            borderRadius: '0',
            '&:hover': {
              borderColor: '#8e7d5d',
              backgroundColor: 'rgba(142, 125, 93, 0.05)'
            }
          }}
        >
          Google Calendar
        </Button>

        <Button
          variant="outlined"
          startIcon={<AppleIcon />}
          onClick={createIcsFile}
          sx={{
            borderColor: 'rgba(142, 125, 93, 0.3)',
            color: '#1a1a1a',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            px: 4,
            py: 1.5,
            borderRadius: '0',
            '&:hover': {
              borderColor: '#8e7d5d',
              backgroundColor: 'rgba(142, 125, 93, 0.05)'
            }
          }}
        >
          Apple Calendar (iCal)
        </Button>
      </Stack>
    </Box>
  );
}
