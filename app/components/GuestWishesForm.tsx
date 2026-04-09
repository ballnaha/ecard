'use client';

import React, { useRef, useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Stack, alpha,
  useTheme, Snackbar, Alert, CircularProgress
} from '@mui/material';

import {
  Trash,
  Gallery,
  DocumentUpload,
  Home,
  Heart,
  TickCircle,
  CloseCircle
} from 'iconsax-react';

export default function GuestWishesForm({
  clientId,
  fontFamily = 'Prompt'
}: {
  clientId: string;
  fontFamily?: string
}) {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Check if user has already submitted a wish for this client
    const submitted = localStorage.getItem(`submitted_wish_${clientId}`);
    if (submitted) {
      setHasSubmitted(true);
    }
  }, [clientId]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกชื่อของคุณ',
        severity: 'warning'
      });
      return;
    }

    if (!message.trim() && images.length === 0) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อความอวยพร หรือ แนบรูปถ่าย อย่างน้อย 1 อย่างครับ',
        severity: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('clientId', clientId);
      formData.append('name', name);
      formData.append('message', message);

      images.forEach((img) => {
        formData.append('images', img);
      });

      const res = await fetch('/api/wishes', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: 'ส่งคำอวยพรเรียบร้อยแล้ว ขอบคุณที่ร่วมยินดีกับเรา!',
          severity: 'success'
        });

        setName('');
        setMessage('');
        setImages([]);
        setHasSubmitted(true);
        localStorage.setItem(`submitted_wish_${clientId}`, 'true');
      } else {
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาด: ' + err.message,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 600, color: '#1a1a1a', fontFamily: '"Prompt", sans-serif' }}>
          {hasSubmitted ? 'เขียนคำอวยพรอีกครั้ง' : 'เขียนคำอวยพร'}
        </Typography>
      </Stack>

      {hasSubmitted && (
        <Box sx={{ mb: 4, p: 2, bgcolor: alpha('#10b981', 0.08), borderRadius: 3, border: '1px solid', borderColor: alpha('#10b981', 0.2), textAlign: 'center' }}>
          <Typography sx={{ color: '#059669', fontWeight: 600, fontSize: '0.95rem', fontFamily: '"Prompt", sans-serif' }}>
            ขอบคุณสำหรับคำอวยพรของคุณ!
          </Typography>
          <Typography sx={{ color: '#059669', fontSize: '0.8rem', opacity: 0.8, fontFamily: '"Prompt", sans-serif', mt: 0.5 }}>
            คุณสามารถเขียนอวยพรเพิ่มเติมหรือแนบรูปถ่ายเพิ่มได้อีกครับ
          </Typography>
        </Box>
      )}


      <TextField
        id="guest-wish-name"
        fullWidth
        label="ชื่อของคุณ (Your Name)"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 3 }}
        required
      />

      <TextField
        id="guest-wish-message"
        fullWidth
        label="ข้อความอวยพร (Your Message - Optional)"
        variant="outlined"
        multiline
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Box sx={{ mb: 5 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, fontFamily: `Prompt, sans-serif` }}>
          <Gallery size="20" color={theme.palette.primary.main} variant="Bulk" /> แนบรูปถ่าย
        </Typography>

        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        <Button
          variant="outlined"
          startIcon={<DocumentUpload size="20" variant="Linear" color="#8e7d5d" />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            mb: 2,
            borderRadius: 2,
            textTransform: 'none',
            color: '#8e7d5d',
            borderColor: 'rgba(142, 125, 93, 0.5)',
            '&:hover': {
              borderColor: '#8e7d5d',
              bgcolor: alpha('#8e7d5d', 0.04)
            }
          }}
        >
          เลือกรูปภาพ (Select Images)
        </Button>

        {images.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, pt: 1 }}>
            {images.map((file, idx) => (
              <Box key={idx} sx={{ position: 'relative', minWidth: 100, width: 100, height: 100, flexShrink: 0 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload_preview_${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, border: '1px solid #eee' }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(idx)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: '#d32f2f',
                    color: 'white',
                    p: 0.5,
                    boxShadow: 2,
                    '&:hover': { bgcolor: '#b71c1c' }
                  }}
                >
                  <Trash size="16" variant="Linear" color="#fff" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{
          py: 1.5,
          borderRadius: 8,
          fontSize: '1.1rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(142, 125, 93, 0.3)',
          color: '#fff !important',
          bgcolor: isSubmitting ? '#a09684 !important' : '#8e7d5d',
          '&:hover': {
            bgcolor: '#7a6a4e'
          }
        }}
      >
        {isSubmitting ? <CircularProgress size={28} color="inherit" /> : (hasSubmitted ? 'ส่งคำอวยพรเพิ่มเติม (Send Another Wish)' : 'ส่งคำอวยพร (Send Wishes)')}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          mt: { xs: 8, md: 6 }, 
          zIndex: 9999 
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={
            snackbar.severity === 'success' ? (
              <Heart variant="Bulk" size="24" color="#ffffff" />
            ) : (
              <CloseCircle variant="Bulk" size="24" color="#ffffff" />
            )
          }
          sx={{
            width: '100%',
            minWidth: { xs: '280px', sm: '380px' },
            borderRadius: '50px',
            backgroundColor: snackbar.severity === 'success' ? '#10b981' : '#e53935',
            color: '#ffffff',
            boxShadow: snackbar.severity === 'success' ? '0 12px 40px rgba(16, 185, 129, 0.35)' : '0 12px 40px rgba(229, 57, 53, 0.3)',
            fontFamily: '"Prompt", sans-serif',
            fontSize: '1rem',
            px: 3,
            py: 1.5,
            alignItems: 'center',
            '& .MuiAlert-message': {
              width: '100%',
              fontWeight: 500,
              fontFamily: '"Prompt", sans-serif',
              pt: 0.5
            },
            '& .MuiAlert-action': {
              color: '#ffffff',
              pt: 0.5
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
