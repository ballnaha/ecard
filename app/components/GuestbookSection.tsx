'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Button, Dialog, Slide, AppBar, Toolbar, IconButton, alpha } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Edit2, CloseCircle, Heart } from 'iconsax-react';
import GuestWishesForm from './GuestWishesForm';
import { motion } from 'framer-motion';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GuestbookSection({ clientId, fontFamily, primaryColor = '#8e7d5d' }: {
  clientId: string;
  fontFamily?: string;
  primaryColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  React.useEffect(() => {
    // Check if user has already submitted a wish for this client
    const submitted = localStorage.getItem(`submitted_wish_${clientId}`);
    if (submitted) {
      setHasSubmitted(true);
    }
  }, [clientId, open]); // Re-check when dialog closes/opens

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box component="section" sx={{ 
      py: { xs: 8, md: 12 }, 
      textAlign: 'center', 
      backgroundColor: 'transparent',
      isolation: 'isolate', // Create new stacking context
      position: 'relative'
    }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        >

          <Typography
            variant="overline"
            sx={{
              display: 'block',
              letterSpacing: '0.6em',
              color: 'var(--primary-color)',
              opacity: 0.6,
              mb: 1,
              fontWeight: 400,
              fontSize: { xs: '0.65rem', md: '0.8rem' },
              fontFamily: '"Prompt", sans-serif'
            }}
          >
            THE MEMORIES
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--script-font, "Parisienne", cursive)',
              fontSize: { xs: '2.8rem', md: '4rem' },
              color: 'var(--primary-color)',
              mt: 1,
              lineHeight: 1.2
            }}
          >
            Digital Guestbook
          </Typography>

          <Box sx={{
            width: '60px',
            height: '1px',
            bgcolor: '#8e7d5d',
            opacity: 0.5,
            mx: 'auto',
            mt: 3,
            mb: 4
          }} />

          <Typography
            sx={{
              fontFamily: '"Prompt", sans-serif',
              color: 'rgba(0,0,0,0.6)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 5,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8
            }}
          >
            {hasSubmitted ? (
              <>ขอบคุณที่เป็นส่วนหนึ่งในความทรงจำของเรา<br />คุณสามารถเขียนคำอวยพรเพิ่มเติมได้ที่นี่ครับ</>
            ) : (
              <>ร่วมแสดงความยินดีและเขียนคำอวยพรให้กับคู่บ่าวสาว<br />เพื่อเป็นความทรงจำอันล้ำค่าในวันสำคัญของเรา</>
            )}
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<Edit2 variant="Bold" size={20} color="#fff" />}
            onClick={handleOpen}
            sx={{
              px: { xs: 4, md: 6 },
              py: { xs: 1.8, md: 2.2 },
              borderRadius: '50px',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              fontWeight: 600,
              fontFamily: '"Prompt", sans-serif',
              textTransform: 'none',
              color: '#ffffff', // Force white text
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.8)} 100%)`,
              boxShadow: `0 12px 25px ${alpha(primaryColor, 0.35)}`,
              border: `1px solid ${alpha('#fff', 0.2)}`, // Subtle inner border
              '&:hover': {
                background: `linear-gradient(135deg, ${primaryColor} 20%, ${primaryColor} 100%)`,
                transform: 'translateY(-3px)',
                boxShadow: `0 15px 35px ${alpha(primaryColor, 0.45)}`,
              },
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {hasSubmitted ? 'เขียนคำอวยพรอีกครั้ง (Write Another Wish)' : 'เขียนคำอวยพร (Write a Wish)'}
          </Button>
        </motion.div>
      </Container>

      {/* Fullscreen Overlay Form */}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#fdfcf0',
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }
        }}
      >
        <AppBar
          elevation={0}
          sx={{
            position: 'relative',
            bgcolor: 'transparent',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ width: 48 }} /> {/* Spacer */}
            <Typography
              sx={{
                color: '#1a1a1a',
                fontWeight: 600,
                fontFamily: '"Prompt", sans-serif',
                fontSize: '1.1rem'
              }}
            >
              Wedding Guestbook
            </Typography>
            <IconButton
              edge="end"
              onClick={handleClose}
              aria-label="close"
              sx={{ color: '#1a1a1a' }}
            >
              <CloseCircle variant="Bulk" size="32" color="#1a1a1a" />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ py: 4, px: 2, maxWidth: '800px', mx: 'auto', width: '100%' }}>
          <GuestWishesForm clientId={clientId} fontFamily={fontFamily} />
          <Box sx={{ textAlign: 'center', mt: 4, pb: 8 }}>
            <Button
              onClick={handleClose}
              sx={{ color: 'rgba(0,0,0,0.4)', fontFamily: '"Prompt", sans-serif' }}
            >
              ปิด
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
