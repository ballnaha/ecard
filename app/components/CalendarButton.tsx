'use client';

import React from 'react';
import { Button, Stack, Typography, Box } from '@mui/material';
import { CalendarMonth as CalendarIcon, Apple as AppleIcon, Google as GoogleIcon } from '@mui/icons-material';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
 
interface CalendarProps {
  eventDate?: Date;
  brideName?: string;
  groomName?: string;
  venueName?: string;
  schedules?: any[];
}

export default function CalendarButton({ eventDate, brideName, groomName, venueName, schedules }: CalendarProps) {
  const dateStr = eventDate ? dayjs(eventDate).utc().utcOffset(7).format('YYYYMMDD') : '20261010';

  // Helper to parse "07.29" or "07:29" into "072900"
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return null;
    const cleanTime = timeStr.replace('.', ':').split(':');
    if (cleanTime.length < 2) return null;
    const hh = cleanTime[0].trim().padStart(2, '0');
    const mm = cleanTime[1].trim().padStart(2, '0');
    return `${hh}${mm}00`;
  };

  // Get Start Time from the first schedule item
  const firstTime = schedules && schedules.length > 0 ? parseTime(schedules[0].time) : '110000';
  
  // Get End Time from the last schedule item, add ~4 hours for default buffer
  const lastTimeRaw = schedules && schedules.length > 0 ? schedules[schedules.length - 1].time : '170000';
  const lastTimeParsed = parseTime(lastTimeRaw);
  
  // Create solid end time (if last is 11:30, maybe end at 15:30)
  const startDate = `${dateStr}T${firstTime || '110000'}`;
  const endDate = `${dateStr}T${lastTimeParsed || '210000'}`;
  
  const eventDetails = {
    title: `Wedding: ${brideName || 'Mook'} & ${groomName || 'Top'}`,
    location: venueName || 'The Glasshouse Estate, Chiang Mai',
    description: `We are so excited to have you celebrate our special day with us! \n\nWedding of ${brideName} & ${groomName}`,
    startDate,
    endDate
  };

  const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

  const createIcsFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Antigravity//Wedding E-Card//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART:${eventDetails.startDate}`,
      `DTEND:${eventDetails.endDate}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${eventDetails.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const fileName = `wedding-${(brideName || 'wedding').toLowerCase()}-${(groomName || 'day').toLowerCase()}.ics`.replace(/\s+/g, '-');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
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
      
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto auto' },
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: { xs: '100%', sm: 'max-content' },
          mx: 'auto'
        }}
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
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            letterSpacing: '0.1em',
            px: { xs: 1, sm: 4 },
            py: 1.5,
            width: '100%',
            borderRadius: '0',
            '&:hover': {
              borderColor: '#8e7d5d',
              backgroundColor: 'rgba(142, 125, 93, 0.05)'
            }
          }}
        >
          Google
        </Button>

        <Button
          variant="outlined"
          startIcon={<AppleIcon />}
          onClick={createIcsFile}
          sx={{
            borderColor: 'rgba(142, 125, 93, 0.3)',
            color: '#1a1a1a',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            letterSpacing: '0.1em',
            px: { xs: 1, sm: 4 },
            py: 1.5,
            width: '100%',
            borderRadius: '0',
            '&:hover': {
              borderColor: '#8e7d5d',
              backgroundColor: 'rgba(142, 125, 93, 0.05)'
            }
          }}
        >
          Apple / iCal
        </Button>
      </Box>
    </Box>
  );
}
