'use client';

import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  IconButton,
  InputBase,
  alpha
} from '@mui/material';
import {
  Category,
  CardTick,
  People,
  Logout,
  SearchNormal1,
  NotificationCircle,
  Menu,
  Heart
} from 'iconsax-react';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 280;
const brandColor = '#f2a1a1';
const activeColor = '#f2a1a1';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconColor: string;
}

export default function AdminLayoutShell({ children, userName }: { children: React.ReactNode, userName?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues with Iconsax
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: <Category size="22" variant="Bulk" color="#f6d365" />, iconColor: '#f6d365' },
    { href: '/admin/clients', label: 'Wedding Cards', icon: <CardTick size="22" variant="Bulk" color="#f2a1a1" />, iconColor: '#f2a1a1' },
    { href: '/admin/users', label: 'Manage Users', icon: <People size="22" variant="Bulk" color="#4facfe" />, iconColor: '#4facfe' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!mounted) {
    return <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }} />;
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: alpha(brandColor, 0.1), border: `1px solid ${alpha(brandColor, 0.1)}` }}>
          <Heart size="22" variant="Bulk" color={brandColor} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a1a', letterSpacing: '-0.02em' }}>Admin Panel</Typography>
          <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 600, display: 'block', mt: -0.5 }}>LUXURY E-CARD</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: '#ccc', fontWeight: 800, letterSpacing: '0.15em', fontSize: '0.65rem' }}>MENU</Typography>
        <List sx={{ mt: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => router.push(item.href)}
                  sx={{
                    borderRadius: '16px',
                    py: 1.5,
                    px: 2,
                    backgroundColor: isActive ? alpha(brandColor, 0.05) : 'transparent',
                    color: isActive ? activeColor : '#666',
                    '&:hover': {
                      backgroundColor: alpha(brandColor, 0.03),
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.9rem',
                      letterSpacing: '-0.01em'
                    }}
                  />
                  {isActive && <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: brandColor }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: '#f5f5f5' }} />
      <Box sx={{ p: 3 }}>
        <ListItemButton
          sx={{ borderRadius: '16px', color: '#ff8a8a', '&:hover': { backgroundColor: '#fff0f0' } }}
          onClick={() => router.push('/')}
        >
          <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
            <Logout size="22" variant="Bulk" />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <CssBaseline />

      {/* Header with smart width */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: alpha('#fff', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #f5f5f5',
          color: '#1a1a1a'
        }}
      >
        <Toolbar sx={{ height: 80, px: { xs: 2, md: 4 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu size="24" variant="Bulk" color="#f2a1a1" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1.8} alignItems="center">

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#1a1a1a', lineHeight: 1.2 }}>{userName || 'Admin'}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.65rem', color: brandColor, letterSpacing: '0.05em' }}>OFFICER</Typography>
              </Box>
              <Avatar sx={{
                width: 42, height: 42, bgcolor: '#ffffff', color: brandColor,
                border: `2px solid ${alpha(brandColor, 0.2)}`, fontWeight: 800, fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(242, 161, 161, 0.1)'
              }}>
                {(userName?.[0] || 'A').toUpperCase()}
              </Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', boxShadow: '20px 0 50px rgba(0,0,0,0.05)' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #f5f5f5' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: 10,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
