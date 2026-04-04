'use client';

import React, { useRef, useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Paper, Stack, alpha,
  ToggleButtonGroup, ToggleButton, Tooltip, useTheme, Snackbar, Alert
} from '@mui/material';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import BrushIcon from '@mui/icons-material/Brush';

export default function GuestWishesForm() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const theme = useTheme();

  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drawing state
  const [strokeColor, setStrokeColor] = useState('#333333');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(15);
  const [isEraser, setIsEraser] = useState(false);

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

  const colors = ['#333333', '#8e7d5d', '#d32f2f', '#e91e63', '#1976d2', '#2e7d32'];

  const undo = () => {
    canvasRef.current?.undo();
  };

  const redo = () => {
    canvasRef.current?.redo();
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };

  const setEraserMode = (eraser: boolean) => {
    setIsEraser(eraser);
    canvasRef.current?.eraseMode(eraser);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
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

    // Get the generated image from canvas
    const canvasData = await canvasRef.current?.exportImage('png');

    console.log('Form Submitted', {
      name,
      imagesCount: images.length,
      hasDrawing: canvasData // base64 string
    });

    setSnackbar({
      open: true,
      message: 'ส่งคำอวยพรเรียบร้อยแล้ว ขอบคุณที่ร่วมยินดีกับเรา!',
      severity: 'success'
    });

    setName('');
    setImages([]);
    clearCanvas();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 1, textAlign: 'center', fontFamily: '"Bodoni Moda", serif', fontWeight: 600, color: '#1a1a1a' }}>
        เขียนคำอวยพร
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: '#8e7d5d', fontFamily: '"Montserrat", sans-serif', fontStyle: 'italic' }}>
        * ข้อความและรูปภาพของคุณจะถูกนำไปแสดงบนจอ LED ภายในงาน *
      </Typography>

      <TextField
        fullWidth
        label="ชื่อของคุณ (Your Name)"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 4 }}
        required
      />

      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, fontFamily: '"Montserrat", sans-serif' }}>
            <EditIcon fontSize="small" color="primary" /> พื้นที่วาดเขียน
          </Typography>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="เลิกทำ (Undo)">
              <IconButton size="small" onClick={undo}>
                <UndoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="ทำซ้ำ (Redo)">
              <IconButton size="small" onClick={redo}>
                <RedoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="ล้างทั้งหมด (Clear)">
              <IconButton size="small" onClick={clearCanvas} color="error">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* React Sketch Canvas Toolbar */}
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, p: 1.5,
          bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider',
          alignItems: 'center', justifyContent: 'space-between'
        }}>
          {/* Color Palette */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {colors.map(c => (
              <Box
                key={c}
                onClick={() => { setStrokeColor(c); setEraserMode(false); }}
                sx={{
                  width: 28, height: 28, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                  border: strokeColor === c && !isEraser ? '3px solid #000' : '1px solid rgba(0,0,0,0.1)',
                  boxShadow: strokeColor === c && !isEraser ? '0 0 0 2px #fff inset' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Tools (Brush / Eraser) */}
            <ToggleButtonGroup
              size="small"
              value={isEraser ? 'eraser' : 'brush'}
              exclusive
              onChange={(e, val) => { if (val) setEraserMode(val === 'eraser'); }}
            >
              <ToggleButton value="brush" sx={{ px: { xs: 1, sm: 2 } }}>
                <BrushIcon fontSize="small" sx={{ mr: 0.5 }} /> สี
              </ToggleButton>
              <ToggleButton value="eraser" sx={{ px: { xs: 1, sm: 2 } }}>
                ยางลบ
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Brush Sizes */}
            <ToggleButtonGroup
              size="small"
              value={isEraser ? eraserWidth : strokeWidth}
              exclusive
              onChange={(e, val) => {
                if (val) {
                  if (isEraser) setEraserWidth(val);
                  else setStrokeWidth(val);
                }
              }}
            >
              <ToggleButton value={isEraser ? 10 : 2} sx={{ px: { xs: 1, sm: 1.5 } }}>เล็ก</ToggleButton>
              <ToggleButton value={isEraser ? 20 : 4} sx={{ px: { xs: 1, sm: 1.5 } }}>กลาง</ToggleButton>
              <ToggleButton value={isEraser ? 30 : 8} sx={{ px: { xs: 1, sm: 1.5 } }}>ใหญ่</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            height: 300,
            position: 'relative',
            border: '2px dashed',
            borderColor: 'rgba(142, 125, 93, 0.4)',
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            transition: 'border-color 0.3s',
            '&:hover': {
              borderColor: '#8e7d5d',
            }
          }}
        >
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={strokeWidth}
            eraserWidth={eraserWidth}
            strokeColor={strokeColor}
            canvasColor="#ffffff"
            style={{ border: 'none' }}
          />
        </Paper>
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, fontFamily: '"Montserrat", sans-serif' }}>
          <ImageIcon fontSize="small" color="primary" /> แนบรูปถ่ายร่วมกับบ่าวสาว
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
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ mb: 2, borderRadius: 2, textTransform: 'none', color: '#8e7d5d', borderColor: 'rgba(142, 125, 93, 0.5)' }}
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
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
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
        sx={{
          py: 1.5,
          borderRadius: 8,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(142, 125, 93, 0.3)',
          bgcolor: '#8e7d5d',
          '&:hover': {
            bgcolor: '#7a6a4e'
          }
        }}
      >
        ส่งคำอวยพร (Send Wishes)
      </Button>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: '50% !important', transform: 'translateY(-50%)' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%', 
            minWidth: { xs: '300px', sm: '400px' },
            borderRadius: '24px', 
            backgroundColor: snackbar.severity === 'success' ? '#e8f5e9' : '#ffebee', 
            backdropFilter: 'blur(10px)',
            color: snackbar.severity === 'success' ? '#2e7d32' : '#c62828',
            border: '1px solid',
            borderColor: snackbar.severity === 'success' ? '#a5d6a7' : '#ef9a9a',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '1rem',
            px: 4,
            py: 2,
            '& .MuiAlert-message': {
              textAlign: 'center',
              width: '100%',
              fontWeight: 600
            },
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? '#2e7d32' : '#c62828',
            },
            '& .MuiAlert-action': {
              color: snackbar.severity === 'success' ? '#2e7d32' : '#c62828',
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
