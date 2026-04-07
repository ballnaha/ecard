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
  alpha,
  useScrollTrigger
} from '@mui/material';
import {
  Category,
  CardTick,
  People,
  Logout,
  Menu,
  Heart,
  Calendar
} from 'iconsax-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const drawerWidth = 280;
const brandColor = '#f2a1a1';
const primaryGradient = 'linear-gradient(135deg, #f2a1a1 0%, #e89191 100%)';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconColor: string;
  badge?: number;
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
    { href: '/admin', label: 'Dashboard', icon: <Category size="22" variant="Bulk" color="#f2a1a1" />, iconColor: '#f2a1a1' },
    { href: '/admin/clients', label: 'Wedding Cards', icon: <CardTick size="22" variant="Bulk" color="#4facfe" />, iconColor: '#4facfe' },
    { href: '/admin/rsvp', label: 'RSVP Manager', icon: <Calendar size="22" variant="Bulk" color="#a18cd1" />, iconColor: '#a18cd1' },
    { href: '/admin/users', label: 'Manage Users', icon: <People size="22" variant="Bulk" color="#fbbf24" />, iconColor: '#fbbf24' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!mounted) {
    return <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }} />;
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      {/* Logo Section */}
      <Box sx={{ p: 4, pb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box 
            sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '14px', 
              background: primaryGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(242, 161, 161, 0.35)'
            }}
          >
            <Heart size="24" variant="Bulk" color="#fff" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              Admin Panel
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mt: -0.5, letterSpacing: '0.05em' }}>
              LUXURY E-CARD
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9', mx: 3 }} />

      {/* Navigation */}
      <Box sx={{ px: 2, py: 3, flexGrow: 1, overflow: 'auto' }}>
        <Typography variant="overline" sx={{ px: 2, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.65rem' }}>
          MENU
        </Typography>
        <List sx={{ mt: 1.5 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => mobileOpen && setMobileOpen(false)}
                  sx={{
                    borderRadius: '14px',
                    py: 1.8,
                    px: 2,
                    backgroundColor: isActive ? alpha(item.iconColor, 0.08) : 'transparent',
                    color: isActive ? item.iconColor : '#64748b',
                    border: `1px solid ${isActive ? alpha(item.iconColor, 0.15) : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(item.iconColor, 0.06),
                      borderColor: alpha(item.iconColor, 0.1),
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& svg': { 
                        transition: 'all 0.2s ease'
                      }
                    }}>
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.9rem',
                      letterSpacing: '-0.01em'
                    }}
                  />
                  {isActive && (
                    <Box 
                      sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: item.iconColor,
                        boxShadow: `0 0 8px ${item.iconColor}`
                      }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

      </Box>

      <Divider sx={{ borderColor: '#f1f5f9', mx: 3 }} />

      {/* Logout */}
      <Box sx={{ p: 3 }}>
        <ListItemButton
          sx={{ 
            borderRadius: '14px', 
            color: '#f43f5e',
            border: '1px solid transparent',
            transition: 'all 0.2s ease',
            '&:hover': { 
              backgroundColor: alpha('#f43f5e', 0.05),
              borderColor: alpha('#f43f5e', 0.2)
            }
          }}
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
            <Logout size="22" variant="Bulk" color="#f43f5e" />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <CssBaseline />

      {/* Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: alpha('#fff', 0.9),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          color: '#1a1a1a'
        }}
      >
        <Toolbar sx={{ height: 72, px: { xs: 2, md: 4 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu size="24" variant="Bulk" color="#1a1a1a" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#1a1a1a', lineHeight: 1.2 }}>
                {userName || 'Admin'}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: brandColor, letterSpacing: '0.02em' }}>
                Administrator
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 44, 
                height: 44, 
                background: primaryGradient,
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(242, 161, 161, 0.25)'
              }}
            >
              {(userName?.[0] || 'A').toUpperCase()}
            </Avatar>
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
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              border: 'none',
              boxShadow: '20px 0 50px rgba(0,0,0,0.08)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              borderRight: '1px solid #f1f5f9',
              backgroundColor: '#fff'
            },
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
          mt: '72px',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minHeight: 'calc(100vh - 72px)',
          backgroundColor: '#fafbfc'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}