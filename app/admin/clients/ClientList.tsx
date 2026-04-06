'use client';
import { useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { Edit2, Trash, Add, Copy } from 'iconsax-react';
import { createClient, deleteClient } from './actions';
import { useSnackbar } from '../components/SnackbarProvider';
import { useConfirm } from '../components/ConfirmProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

export default function ClientList({ initialClients }: { initialClients: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { confirm } = useConfirm();
  const router = useRouter();

  const [eventDate, setEventDate] = useState<Dayjs | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (eventDate) {
      fd.set('eventDate', eventDate.format('YYYY-MM-DD'));
    }

    const res = await createClient(fd);
    setLoading(false);

    if (res?.error) {
      showSnackbar(res.error, 'error');
    } else {
      showSnackbar('สร้างลูกค้าเรียบร้อย เข้าสู่หน้าออกแบบ...', 'success');
      setOpen(false);
      router.push(`/admin/builder?clientId=${res.client.id}`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'ลบข้อมูลฐานลูกค้า?',
      message: `ข้อมูลการตั้งค่า เลย์เอาท์ และรูปภาพทั้งหมดของการ์ด ${name} จะถูกลบทิ้งอย่างถาวร`,
      severity: 'error',
      confirmLabel: 'ลบทิ้ง',
      onConfirm: async () => {
        const res = await deleteClient(id);
        if (res?.error) showSnackbar(res.error, 'error');
        else showSnackbar('ลบข้อมูลลูกค้าสำเร็จ', 'success');
      }
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" startIcon={<Copy size={18} variant="Outline" color="#f2a1a1" />} sx={{ borderRadius: 1, borderColor: '#cbd5e1', color: '#f2a1a1', '&:hover': { bgcolor: '#f8fafc', borderColor: '#f2a1a1' } }}>
          จัดการ Templates
        </Button>
        <Button variant="contained" startIcon={<Add size={18} variant="Bold" color="white" />} onClick={() => setOpen(true)} sx={{ bgcolor: '#f2a1a1', color: '#ffffff', borderRadius: 1, boxShadow: 'none', '&:hover': { bgcolor: '#db2777' } }}>
          สร้างการ์ดลูกค้าใหม่
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ชื่อคู่บ่าวสาว</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>URL (Slug ปลายทาง)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>วันที่จัดงาน</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#94a3b8' }}>ยังไม่มีการ์ดลูกค้าในระบบ</TableCell>
              </TableRow>
            ) : initialClients.map(client => (
              <TableRow key={client.id} hover>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{client.groomName} & {client.brideName}</TableCell>
                <TableCell>
                  <Chip label={`/${client.slug}`} size="small" sx={{ borderRadius: 1, bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
                </TableCell>
                <TableCell sx={{ color: '#475569' }}>{new Date(client.eventDate).toLocaleDateString('th-TH')}</TableCell>
                <TableCell align="right">
                  <Link href={`/admin/builder?clientId=${client.id}`} style={{ textDecoration: 'none' }}>
                    <Button size="small" variant="outlined" startIcon={<Edit2 size={16} variant="Bold" color="#f2a1a1" />} sx={{ borderRadius: 1, mr: 1, textTransform: 'none', borderColor: '#cbd5e1', color: '#0f172a' }}>
                      เข้าห้อง Design
                    </Button>
                  </Link>
                  <IconButton size="small" color="error" onClick={() => handleDelete(client.id, `${client.groomName} & ${client.brideName}`)} sx={{ bgcolor: '#fef2f2' }}>
                    <Trash size={18} variant="Bold" color="#f2a1a1" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal สร้างข้อมูลลูกค้า */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>+ สร้างข้อมูลลูกค้าใหม่</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <TextField name="slug" label="URL Slug ปลายทาง" placeholder="เช่น pop-oat" required fullWidth size="small" helperText="ตัวอักษรภาษาอังกฤษเท่านั้น ห้ามเว้นวรรค" />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField name="groomName" label="ชื่อเจ้าบ่าว" required fullWidth size="small" />
                <TextField name="brideName" label="ชื่อเจ้าสาว" required fullWidth size="small" />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                <DatePicker
                  label="วันที่จัดงาน"
                  format="DD/MM/YYYY"
                  value={eventDate}
                  onChange={(newValue) => setEventDate(newValue)}
                  slotProps={{ textField: { size: 'small', required: true, fullWidth: true } }}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>ยกเลิก</Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#f2a1a1', color: '#ffffff', borderRadius: 1, px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#db2777' } }}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกและไปออกแบบการ์ด'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
