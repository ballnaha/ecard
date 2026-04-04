'use client';

import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, InputBase, Badge, Collapse, useMediaQuery, useTheme
} from '@mui/material';
import {
  ArrowDown2 as KeyboardArrowDown,
  SearchNormal1 as SearchIcon,
  Notification as NotificationsIcon,
  Home2 as FlashIcon,
  MessageText as EmailIcon,
  TaskSquare as AssignmentIcon,
  User as PersonIcon,
  Setting2 as SettingsIcon,
  Logout as LogoutIcon,
  HambergerMenu as MenuIcon,
  CloseSquare as CloseIcon
} from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSnackbar } from './SnackbarProvider';

const drawerWidth = 260;
const brandColor = '#831843'; // Pastel Pink Darker Shade
const activeColor = '#f472b6'; // Pastel Pink 400

const navItemSx = (isSelected: boolean) => ({
  borderRadius: 2,
  mx: 1,
  mb: 0.5,
  py: 1.2,
  px: 2,
  '&.Mui-selected': {
    bgcolor: activeColor,
    color: '#ffffff',
    '&:hover': { bgcolor: '#db2777' }
  },
  '&:not(.Mui-selected)': {
    color: '#64748b',
    '&:hover': { bgcolor: '#fdf2f8', color: activeColor }
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
});

export default function AdminLayoutShell({ children, userName }: { children: React.ReactNode, userName?: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (pathname === '/admin/login') return <>{children}</>;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      showSnackbar('Logging out...', 'info');
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      await signOut({ callbackUrl: `${currentOrigin}/admin/login` });
    } catch (error) {
      showSnackbar('Logout failed', 'error');
    }
  };

  const navItems = [
    { label: 'ANALYTICS', type: 'header' as const },
    { href: '/admin', label: 'Dashboard', icon: <FlashIcon size={20} color="currentColor" variant="Outline" />, isActive: pathname === '/admin' || pathname === '/admin/' },
    { label: 'CONTENT', type: 'header' as const },
    { href: '/admin/clients', label: 'Wedding Cards', icon: <EmailIcon size={20} color="currentColor" variant="Outline" />, isActive: pathname.startsWith('/admin/clients') || pathname.startsWith('/admin/builder') },
    { href: '/admin/users', label: 'Manage Users', icon: <PersonIcon size={20} color="currentColor" variant="Outline" />, isActive: pathname.startsWith('/admin/users') },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* Mobile: Show brand header in drawer */}
      {isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
            SetEvent<span style={{ color: activeColor }}> Ecard</span>
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: '#94a3b8' }}>
            <CloseIcon size={22} color="#94a3b8" variant="Outline" />
          </IconButton>
        </Box>
      )}

      <List sx={{ px: 1.5, flexGrow: 1, overflowY: 'auto', mt: isMobile ? 1 : 2 }}>
        {navItems.map((item, idx) => {
          if (item.type === 'header') {
            return (
              <Typography key={idx} variant="caption" sx={{ color: '#94a3b8', pl: 2, mt: idx === 0 ? 0 : 3, mb: 1, display: 'block', fontWeight: 800, fontSize: '0.65rem', letterSpacing: 1.2 }}>
                {item.label}
              </Typography>
            );
          }
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <Link href={item.href!} style={{ textDecoration: 'none', width: '100%' }} onClick={() => isMobile && setMobileOpen(false)}>
                <ListItemButton selected={item.isActive} sx={navItemSx(!!item.isActive)}>
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: 'inherit' }} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { handleLogout(); isMobile && setMobileOpen(false); }}
            sx={{
              borderRadius: 2, mx: 1, mt: 4, py: 1.2, px: 2,
              color: '#64748b',
              '&:hover': { bgcolor: '#fef2f2', color: '#ef4444' },
              transition: 'all 0.2s'
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><LogoutIcon size={20} color="currentColor" variant="Outline" /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Mobile: User info at bottom */}
      {isMobile && (
        <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: brandColor, fontSize: '0.85rem', fontWeight: 700 }}>{userName?.charAt(0) || 'A'}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', lineHeight: 1.2 }}>{userName || 'Admin'}</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>Administrator</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* ── Top AppBar ── */}
      <AppBar position="fixed" elevation={0} sx={{ width: '100%', zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', color: brandColor }}>
        <Toolbar sx={{ justifyContent: 'space-between', height: { xs: 56, md: 60 }, px: { xs: 1.5, md: 3 }, minHeight: '56px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Hamburger – mobile only */}
            <IconButton onClick={handleDrawerToggle} sx={{ display: { md: 'none' }, color: '#475569', mr: 0.5 }}>
              <MenuIcon size={24} color="#475569" variant="Outline" />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', fontSize: { xs: '1rem', md: '1.15rem' }, letterSpacing: -0.5 }}>
              SetEvent<span style={{ color: activeColor }}> Ecard</span>
            </Typography>
          </Box>

          {/* Search – hidden on mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, px: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f5f9', borderRadius: 1, px: 2, py: 0.5, width: '100%', maxWidth: 380 }}>
              <SearchIcon size={18} color="#94a3b8" style={{ marginRight: 8 }} variant="Outline" />
              <InputBase placeholder="Search anything..." sx={{ width: '100%', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }} />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton size="small" sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}>
              <Badge color="error" variant="dot" overlap="circular">
                <NotificationsIcon size={20} color="currentColor" variant="Outline" />
              </Badge>
            </IconButton>
            {/* User avatar – desktop only (mobile shows in drawer) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, ml: 2, cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: '#f8fafc' } }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: brandColor, fontSize: '0.75rem', fontWeight: 700 }}>{userName?.charAt(0) || 'A'}</Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.825rem', lineHeight: 1 }}>{userName || 'Admin'}</Typography>
              </Box>
              <KeyboardArrowDown size={18} color="#94a3b8" variant="Outline" />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar Navigation ── */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer (temporary, slides over content) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true /* better performance on mobile */ }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 0 }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer (permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 0, pt: 7.5 }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* ── Main Content ── */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5, md: 4 }, mt: { xs: 7, md: 7.5 }, width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
}
