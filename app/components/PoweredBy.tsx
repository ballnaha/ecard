'use client';

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function PoweredBy() {
  const logo = "/images/logo_black1.png";

  return (
    <Box
      sx={{
        pb: { xs: 18, md: 8 }, 
        pt: 6,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderTop: '0.5px solid rgba(0,0,0,0.05)'
      }}
    >
      <Link 
        href="https://seteventthailand.com" 
        target="_blank" 
        underline="none"
        sx={{ 
          display: 'inline-flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 1.5,
          opacity: 0.6,
          transition: 'opacity 0.3s ease',
          '&:hover': { opacity: 1 }
        }}
      >
        <Typography sx={{
          fontFamily: '"Prompt", sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.5)'
        }}>
          Powered By
        </Typography>
        <Box
          component="img"
          src={logo}
          alt="seteventthailand logo"
          sx={{
            height: { xs: '35px', md: '45px' },
            width: 'auto',
            filter: 'grayscale(1)',
            opacity: 0.8
          }}
        />
        <Typography sx={{
          fontFamily: '"Prompt", sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: 'rgba(0,0,0,0.4)',
          textTransform: 'lowercase',
          mt: -0.5
        }}>
          seteventthailand.com
        </Typography>
      </Link>
    </Box>
  );
}
