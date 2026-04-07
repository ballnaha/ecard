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
  alpha,
  Skeleton,
  Divider
} from '@mui/material';
import { Magicpen, Trash, UserAdd, ProfileTick, ProfileCircle, ShieldTick, Edit, People } from 'iconsax-react';
import { createUser, updateUser, deleteUser } from './actions';
import { useSnackbar } from '../../components/SnackbarProvider';
import { useConfirm } from '../../components/ConfirmProvider';

const brandColor = '#f2a1a1';
const primaryGradient = 'linear-gradient(135deg, #f2a1a1 0%, #e89191 100%)';

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
      showSnackbar(isEdit ? 'User updated successfully' : 'User created successfully', 'success');
      setOpen(false);
    }
  };

  const handleDelete = (id: string, uName: string) => {
    confirm({
      title: 'Delete User?',
      message: `Are you sure you want to delete "${uName}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      severity: 'error',
      onConfirm: async () => {
        const res = await deleteUser(id);
        if (res.error) {
          showSnackbar(res.error, 'error');
        } else {
          showSnackbar('User deleted successfully', 'success');
        }
      }
    });
  };

  return (
    <Box>
      {/* Header Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="800" color="#1a1a1a">
            Team Members
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            Manage administrative access and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UserAdd variant="Bulk" size="20" color="#fff" />}
          onClick={handleOpenNew}
          sx={{
            background: primaryGradient,
            color: '#fff',
            px: 3,
            py: 1.5,
            borderRadius: '14px',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(242, 161, 161, 0.35)',
            '&:hover': { 
              boxShadow: '0 12px 32px rgba(242, 161, 161, 0.45)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Add New User
        </Button>
      </Stack>

      {/* User Cards Grid */}
      {initialUsers.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: '24px', 
            border: '1px dashed #e2e8f0',
            bgcolor: '#fff'
          }}
        >
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(brandColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <People variant="Bulk" size="40" color={brandColor} />
          </Box>
          <Typography variant="h6" fontWeight="800" color="#1a1a1a" sx={{ mb: 1 }}>
            No team members yet
          </Typography>
          <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>
            Add your first administrator to manage the system
          </Typography>
          <Button
            variant="contained"
            startIcon={<UserAdd variant="Bulk" size="20" />}
            onClick={handleOpenNew}
            sx={{
              background: primaryGradient,
              color: '#fff',
              px: 3,
              py: 1.5,
              borderRadius: '14px',
              fontWeight: 700,
              textTransform: 'none'
            }}
          >
            Add First User
          </Button>
        </Paper>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
          gap: 3 
        }}>
          {initialUsers.map((user) => (
            <Paper
              key={user.id}
              elevation={0}
              sx={{
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.04)',
                bgcolor: '#fff',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  borderColor: alpha(brandColor, 0.3)
                }
              }}
            >
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.04)'
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      background: user.status === 'active' ? primaryGradient : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      boxShadow: user.status === 'active' ? '0 4px 14px rgba(242, 161, 161, 0.25)' : 'none'
                    }}
                  >
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" fontWeight="800" color="#1a1a1a" noWrap>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Created {new Date(user.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="#64748b" fontWeight="600">Role</Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        height: 26,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        textTransform: 'capitalize',
                        bgcolor: alpha(user.role === 'admin' ? '#4facfe' : user.role === 'staff' ? '#a18cd1' : '#64748b', 0.1),
                        color: user.role === 'admin' ? '#4facfe' : user.role === 'staff' ? '#8b5cf6' : '#64748b',
                        border: 'none'
                      }}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="#64748b" fontWeight="600">Status</Typography>
                    <Chip
                      label={user.status === 'active' ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        height: 26,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: user.status === 'active' ? alpha('#10b981', 0.1) : alpha('#f43f5e', 0.1),
                        color: user.status === 'active' ? '#10b981' : '#f43f5e',
                        border: 'none'
                      }}
                    />
                  </Stack>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenEdit(user)} 
                      sx={{ 
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha('#4facfe', 0.08), 
                        '&:hover': { bgcolor: alpha('#4facfe', 0.15) } 
                      }}
                    >
                      <Edit size="18" variant="Bulk" color="#4facfe" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDelete(user.id, user.username)} 
                      sx={{ 
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha('#f43f5e', 0.08), 
                        '&:hover': { bgcolor: alpha('#f43f5e', 0.15) } 
                      }}
                    >
                      <Trash size="18" variant="Bulk" color="#f43f5e" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Dialog for Create/Edit User */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { 
            borderRadius: '24px', 
            p: 2, 
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.04)'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1a1a', textAlign: 'center', pt: 3 }}>
            {isEdit ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent sx={{ pt: '20px !important', pb: 1 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth 
                label="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={{                 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': { borderColor: brandColor }
                  },
                  '& label.Mui-focused': { color: brandColor }
                }}
              />
              <TextField
                fullWidth 
                label={isEdit ? "New Password (leave empty to keep current)" : "Password"}
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required={!isEdit}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': { borderColor: brandColor }
                  },
                  '& label.Mui-focused': { color: brandColor }
                }}
              />
              <FormControl variant="outlined">
                <InputLabel sx={{ '&.Mui-focused': { color: '#a18cd1' } }}>Role</InputLabel>
                <Select 
                  value={role} 
                  label="Role" 
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ 
                    borderRadius: '12px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#a18cd1' }
                  }}
                >
                  <MenuItem value="admin">Administrator (Full Access)</MenuItem>
                  <MenuItem value="staff">Staff (Card Management)</MenuItem>
                  <MenuItem value="viewer">Viewer (Read Only)</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel sx={{ '&.Mui-focused': { color: brandColor } }}>Status</InputLabel>
                <Select 
                  value={status} 
                  label="Status" 
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ 
                    borderRadius: '12px',
                    '&.MuiFocused .MuiOutlinedInput-notchedOutline': { borderColor: brandColor }
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setOpen(false)} 
              sx={{ 
                fontWeight: 700, 
                borderRadius: '12px', 
                px: 3,
                color: '#64748b',
                '&:hover': { bgcolor: alpha('#64748b', 0.05) }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{
                background: primaryGradient,
                borderRadius: '12px', 
                color: 'white', 
                fontWeight: 700, 
                px: 4, 
                py: 1.2,
                boxShadow: '0 8px 20px rgba(242, 161, 161, 0.25)',
                '&:hover': { 
                  boxShadow: '0 12px 28px rgba(242, 161, 161, 0.35)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}