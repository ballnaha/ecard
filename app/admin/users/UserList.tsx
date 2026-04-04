'use client';
import { useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createUser, updateUser, deleteUser } from './actions';
import { useSnackbar } from '../components/SnackbarProvider';
import { useConfirm } from '../components/ConfirmProvider';

export default function UserList({ initialUsers }: { initialUsers: any[] }) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { confirm } = useConfirm();

  const handleOpenNew = () => {
    setIsEdit(false);
    setUsername('');
    setPassword('');
    setRole('admin');
    setStatus('active');
    setOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setIsEdit(true);
    setEditId(user.id);
    setUsername(user.username);
    setPassword(''); // ไม่แสดงรหัสเก่า
    setRole(user.role);
    setStatus(user.status);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append('username', username);
    fd.append('role', role);
    fd.append('status', status);
    if (password) fd.append('password', password); // Submit string password if manually typed

    let res;
    if (isEdit) {
      res = await updateUser(editId, fd);
    } else {
      res = await createUser(fd);
    }

    setLoading(false);

    if (res.error) {
      showSnackbar(res.error, 'error');
    } else {
      showSnackbar(isEdit ? 'แก้ไขผู้ใช้สำเร็จ' : 'เพิ่มผู้ใช้สำเร็จ', 'success');
      setOpen(false);
    }
  };

  const handleDelete = (id: string, uName: string) => {
    confirm({
      title: 'ต้องการลบผู้ใช้ใช่หรือไม่?',
      message: `ข้อมูลของ ${uName} จะถูกลบออกจากระบบอย่างถาวรและไม่สามารถเรียกคืนได้`,
      confirmLabel: 'ลบข้อมูล',
      severity: 'error',
      onConfirm: async () => {
        const res = await deleteUser(id);
        if (res.error) {
          showSnackbar(res.error, 'error');
        } else {
          showSnackbar('ลบผู้ใช้สำเร็จ', 'success');
        }
      }
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleOpenNew}
          sx={{ bgcolor: '#111216', color: '#ffffff', px: 3, py: 1.2, borderRadius: 1, fontWeight: 600, '&:hover': { bgcolor: '#2b2c33' } }}
        >
          + เพิ่มผู้ใช้ใหม่
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ color: '#888', fontWeight: 600 }}>ชื่อผู้ใช้ (Username)</TableCell>
              <TableCell sx={{ color: '#888', fontWeight: 600 }}>บทบาท (Role)</TableCell>
              <TableCell sx={{ color: '#888', fontWeight: 600 }}>สถานะ</TableCell>
              <TableCell sx={{ color: '#888', fontWeight: 600 }}>วันที่สร้าง</TableCell>
              <TableCell align="right" sx={{ color: '#888', fontWeight: 600 }}>เครื่องมือจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  ไม่มีข้อมูลผู้ใช้ในระบบ
                </TableCell>
              </TableRow>
            ) : (
              initialUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>{user.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 600,
                        bgcolor: user.role === 'admin' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                        color: user.role === 'admin' ? '#9c27b0' : '#1976d2',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'}
                      size="small"
                      color={user.status === 'active' ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ borderRadius: 1, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#555' }}>
                    {new Date(user.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(user)} sx={{ mr: 0.5 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id, user.username)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog สร้าง/แก้ไข User */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid #eee', pb: 2 }}>
            {isEdit ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 3, mt: 1 }}
            />

            <TextField
              fullWidth
              label={isEdit ? "ตั้งรหัสผ่านใหม่ (เว้นว่างไว้ถ้าไม่อยากเปลี่ยน)" : "รหัสผ่าน"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEdit}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>บทบาท (Role)</InputLabel>
              <Select value={role} label="บทบาท (Role)" onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="admin">Administrator (แอดมินระบบ)</MenuItem>
                <MenuItem value="staff">Staff (สตาฟจัดการอีการ์ด)</MenuItem>
                <MenuItem value="viewer">Viewer (ดูได้อย่างเดียว)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>สถานะการใช้งาน</InputLabel>
              <Select value={status} label="สถานะการใช้งาน" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="active">เปิดใช้งาน (Active)</MenuItem>
                <MenuItem value="inactive">ระงับการใช้งาน (Inactive)</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>ยกเลิก</Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#111216', borderRadius: 1, color: 'white', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#2b2c33' } }}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
