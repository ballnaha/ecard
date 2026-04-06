'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, IconButton
} from '@mui/material';
import { WarningAmberRounded, CloseRounded } from '@mui/icons-material';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  severity?: 'error' | 'warning' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within a ConfirmProvider');
  return context;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = useCallback((opt: ConfirmOptions) => {
    setOptions(opt);
    setOpen(true);
  }, []);

  const handleConfirm = async () => {
    if (options) {
      setLoading(true);
      await options.onConfirm();
      setLoading(false);
    }
    setOpen(false);
  };

  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const severityColor = options?.severity === 'error' ? '#ef4444' : options?.severity === 'warning' ? '#f59e0b' : '#f2a1a1';

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18)',
            border: '1px solid rgba(0,0,0,0.05)'
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', pt: 3, pb: 4 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: '50%',
            bgcolor: `${severityColor}10`, color: severityColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 3,
            border: `2px solid ${severityColor}20`
          }}>
            <WarningAmberRounded sx={{ fontSize: 40 }} />
          </Box>

          <Typography variant="h5" fontWeight="600" sx={{ mb: 1.5, color: '#0f172a', fontFamily: '"Prompt", sans-serif', letterSpacing: -0.5 }}>
            {options?.title}
          </Typography>

          <Typography variant="body1" sx={{ color: '#64748b', mb: 1, px: 2, fontFamily: '"Prompt", sans-serif', fontWeight: 500, lineHeight: 1.6 }}>
            {options?.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 4, pt: 0, flexDirection: 'column', gap: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
            disableElevation
            sx={{
              borderRadius: 2.5, py: 1.5, fontWeight: 600, bgcolor: severityColor,
              textTransform: 'none', fontFamily: '"Prompt", sans-serif', fontSize: '1rem', color: 'white',
              '&:hover': { bgcolor: severityColor, filter: 'brightness(0.9)' },
              '&.Mui-disabled': { bgcolor: '#cbd5e1' }
            }}
          >
            {loading ? 'Processing...' : (options?.confirmLabel || 'ยืนยัน')}
          </Button>

          <Button
            fullWidth
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderRadius: 2.5, py: 1.2, fontWeight: 700, color: '#64748b',
              textTransform: 'none', fontFamily: '"Prompt", sans-serif', fontSize: '0.9rem',
              '&:hover': { bgcolor: '#f8fafc', color: '#1e293b' }
            }}
          >
            {options?.cancelLabel || 'ยกเลิก'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
