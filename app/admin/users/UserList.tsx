'use client';
import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Stack,
  alpha
} from '@mui/material';
import { Magicpen, Trash, UserAdd, ProfileTick, ProfileCircle, ShieldTick, Edit } from 'iconsax-react';
import { createUser, updateUser, deleteUser } from './actions';
import { useSnackbar } from '../components/SnackbarProvider';
import { useConfirm } from '../components/ConfirmProvider';

const brandColor = '#f2a1a1';

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
    setPassword('');
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
    if (password) fd.append('password', password);

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
      title: 'ลบผู้ใช้งาน?',
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ "${uName}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<UserAdd variant="Bulk" size="20" color="#ffffff" />}
          onClick={handleOpenNew}
          sx={{
            bgcolor: brandColor,
            color: '#ffffff',
            px: 3,
            py: 1.2,
            borderRadius: '50px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 8px 25px rgba(242, 161, 161, 0.25)',
            '&:hover': { bgcolor: '#e89191' }
          }}
        >
          Add New User
        </Button>
      </Box>

      <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', borderRadius: '32px', border: '1px solid #f5f5f5' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ color: '#aaa', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>USER IDENTITIY</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ACCESS LEVEL</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>STATUS</TableCell>
              <TableCell align="right" sx={{ color: '#aaa', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ color: '#ccc' }}>No administrative accounts found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              initialUsers.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: '#fffcfc' } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 44, height: 44, bgcolor: '#f3f0ff', border: '1px solid #ede7f6' }}>
                        <ProfileCircle size="24" color="#a18cd1" variant="Bulk" />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '0.95rem' }}>{user.username}</Typography>
                        <Typography variant="caption" sx={{ color: '#ccc', fontWeight: 600 }}>Created {new Date(user.createdAt).toLocaleDateString('th-TH')}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      icon={<ShieldTick size="14" variant="Bulk" color={user.role === 'admin' ? '#039be5' : '#a18cd1'} />}
                      sx={{
                        borderRadius: '50px',
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        bgcolor: user.role === 'admin' ? '#e1f5fe' : '#f3f0ff',
                        color: user.role === 'admin' ? '#039be5' : '#a18cd1',
                        border: 'none',
                        px: 1
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      size="small"
                      icon={<ProfileTick size="14" variant="Bulk" color={user.status === 'active' ? '#2e7d32' : brandColor} />}
                      sx={{
                        borderRadius: '50px',
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        bgcolor: user.status === 'active' ? '#e8f5e9' : '#fff5f5',
                        color: user.status === 'active' ? '#2e7d32' : brandColor
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleOpenEdit(user)} sx={{ color: '#4facfe', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}>
                        <Edit size="18" variant="Bulk" color="#4facfe" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(user.id, user.username)} sx={{ color: '#ff8a8a', bgcolor: '#fff0f0', '&:hover': { bgcolor: '#ffebee' } }}>
                        <Trash size="18" variant="Bulk" color="#ff8a8a" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog สร้าง/แก้ไข User */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '32px', p: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1a1a', textAlign: 'center', pt: 3 }}>
            {isEdit ? 'Edit User Identity' : 'New Administrator'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 1 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                variant="standard"
                sx={{ '& .MuiInput-underline:after': { borderBottomColor: brandColor }, '& label.Mui-focused': { color: brandColor } }}
              />
              <TextField
                fullWidth label={isEdit ? "Set New Password (Leave empty if no change)" : "Password"}
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEdit}
                variant="standard"
                sx={{ '& .MuiInput-underline:after': { borderBottomColor: brandColor }, '& label.Mui-focused': { color: brandColor } }}
              />
              <FormControl variant="standard">
                <InputLabel sx={{ '&.Mui-focused': { color: '#a18cd1' } }}>Role Selection</InputLabel>
                <Select value={role} label="Role Selection" onChange={(e) => setRole(e.target.value)} sx={{ '&:after': { borderBottomColor: '#a18cd1' } }}>
                  <MenuItem value="admin">Administrator (Full Access)</MenuItem>
                  <MenuItem value="staff">Staff (Card Management)</MenuItem>
                  <MenuItem value="viewer">Viewer (Read Only)</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard">
                <InputLabel sx={{ '&.Mui-focused': { color: brandColor } }}>Account Status</InputLabel>
                <Select value={status} label="Account Status" onChange={(e) => setStatus(e.target.value)} sx={{ '&:after': { borderBottomColor: brandColor } }}>
                  <MenuItem value="active">Active Status</MenuItem>
                  <MenuItem value="inactive">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 700, borderRadius: '50px', px: 3 }}>Cancel</Button>
            <Button
              type="submit" variant="contained" disabled={loading}
              sx={{
                bgcolor: brandColor, borderRadius: '50px', color: 'white', fontWeight: 800, px: 4, py: 1, boxShadow: '0 8px 20px rgba(242, 161, 161, 0.2)',
                '&:hover': { bgcolor: '#e89191' }
              }}
            >
              {loading ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
