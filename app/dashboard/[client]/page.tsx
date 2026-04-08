'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Stack,
  IconButton,
  CircularProgress,
  Pagination,
  Snackbar,
  Alert,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  SearchNormal1,
  Call,
  People,
  TickCircle,
  CloseCircle,
  DocumentDownload,
  Heart,
  Calendar,
  Lock,
  InfoCircle,
  Danger,
  Trash,
  Logout
} from 'iconsax-react';
import { useParams } from 'next/navigation';
import * as XLSX from 'xlsx';
import { deleteRSVP, deleteWish } from '@/app/admin/(dashboard)/clients/actions';

interface RSVPData {
  id: string;
  name: string;
  attending: boolean;
  phone: string;
  guestCount: number;
  dietary?: string;
  createdAt: string;
}

interface WishData {
  id: string;
  name: string;
  message: string;
  drawing: string | null;
  images: string[];
  createdAt: string;
}

const brandColor = '#f2a1a1';
const successGreen = '#10b981'; // Beautiful Emerald Green
const ITEMS_PER_PAGE = 10;

export default function CoupleDashboard() {
  const params = useParams();
  const slug = params.client as string;

  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [currentView, setCurrentView] = useState<'rsvp' | 'wishes'>('rsvp');
  const [clientData, setClientData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [viewImages, setViewImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteWishId, setDeleteWishId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch client names early (unauthenticated)
  useEffect(() => {
    if (slug) {
      // Check session storage first
      if (typeof window !== 'undefined' && sessionStorage.getItem(`ecard_auth_${slug}`) === 'true') {
        setAuthenticated(true);
      }

      fetch(`/api/client/${slug}`)
        .then(res => res.json())
        .then(data => setClientData(data))
        .catch(err => console.error('Early fetch error:', err));
    }
  }, [slug]);

  // 2. Fetch RSVPs only after authentication
  useEffect(() => {
    if (authenticated && slug) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [authenticated, slug]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/rsvp?slug=${slug}`).then(res => res.json()),
      fetch(`/api/admin/wishes?slug=${slug}`).then(res => res.json())
    ]).then(([rsvpList, wishesList]) => {
      setRsvps(Array.isArray(rsvpList) ? rsvpList : []);
      setWishes(Array.isArray(wishesList) ? wishesList : []);
    })
      .catch(err => console.error('Dashboard Error:', err))
      .finally(() => setLoading(false));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate required passcode based on event date (DDMMYYYY)
    let requiredPasscode = '14052026'; // Default fallback
    if (clientData?.eventDate) {
      const date = new Date(clientData.eventDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString(); // This is CE ( ค.ศ. )
      requiredPasscode = `${day}${month}${year}`;
    }

    if (passcode === requiredPasscode) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`ecard_auth_${slug}`, 'true');
      }
      setAuthenticated(true);
      setSnackbar({ open: true, message: 'ล็อกอินสำเร็จ ยินดีต้อนรับครับ!', severity: 'success' });
    } else {
      setSnackbar({
        open: true,
        message: `รหัสผ่านไม่ถูกต้อง! รหัสคือ วันที่แต่งงาน (เช่น ${requiredPasscode})`,
        severity: 'error'
      });
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`ecard_auth_${slug}`);
    }
    setAuthenticated(false);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleExportExcel = () => {
    if (!rsvps.length) {
      setSnackbar({ open: true, message: 'ไม่พบข้อมูลแขกสำหรับ Export ครับ', severity: 'error' });
      return;
    }

    try {
      // Map data for Excel
      const dataToExport = rsvps.map((r, i) => ({
        'ลำดับ': i + 1,
        'ชื่อแขก': r.name,
        'สถานะ': r.attending ? '✅ ร่วมงาน' : '❌ ไม่สะดวก',
        'เบอร์โทรศัพท์': r.phone || '-',
        'จำนวนแขกทั้งหมด': r.guestCount,
        'แพ้อาหาร/หมายเหตุ': r.dietary || '-',
        'วันที่ลงทะเบียน': new Date(r.createdAt).toLocaleDateString('th-TH') + ' ' + new Date(r.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      }));

      // Convert to SheetJS Workbook
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "GUEST_LIST");

      // Set column widths for professional look
      const wscols = [
        { wch: 8 },  // ลำดับ
        { wch: 30 }, // ชื่อแขก
        { wch: 15 }, // สถานะ
        { wch: 15 }, // เบอร์โทร
        { wch: 15 }, // จำนวนแขก
        { wch: 40 }, // หมายเหตุ
        { wch: 25 }, // วันที่
      ];
      worksheet['!cols'] = wscols;

      // Generate Filename
      const fileName = `RSVP_${clientData?.brideName || 'Client'}_${clientData?.groomName || 'Dashboard'}_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.xlsx`;

      // Write and Download
      XLSX.writeFile(workbook, fileName);

      setSnackbar({ open: true, message: 'Export Excel (.xlsx) สำเร็จแล้วครับ!', severity: 'success' });
    } catch (err) {
      console.error('Export Error:', err);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการสร้างไฟล์ Excel ครับ', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !slug) return;
    setIsDeleting(true);
    const res = await deleteRSVP(deleteId, slug);
    setIsDeleting(false);
    if (res.success) {
      setRsvps(prev => prev.filter(r => r.id !== deleteId));
      setSnackbar({ open: true, message: 'ลบชื่อแขกเรียบร้อยแล้วครับ', severity: 'success' });
      setDeleteId(null);
    } else {
      setSnackbar({ open: true, message: res.error || 'ลบไม่สำเร็จ กรุณาลองใหม่', severity: 'error' });
    }
  };

  const handleDeleteWish = async () => {
    if (!deleteWishId || !slug) return;
    setIsDeleting(true);
    const res = await deleteWish(deleteWishId, slug);
    setIsDeleting(false);
    if (res.success) {
      setWishes(prev => prev.filter(w => w.id !== deleteWishId));
      setSnackbar({ open: true, message: 'ลบคำอวยพรเรียบร้อยแล้วครับ', severity: 'success' });
      setDeleteWishId(null);
    } else {
      setSnackbar({ open: true, message: res.error || 'ลบไม่สำเร็จ กรุณาลองใหม่', severity: 'error' });
    }
  };

  const filteredRsvps = rsvps.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.phone && item.phone.includes(searchTerm))
  );

  const pageCount = Math.ceil(filteredRsvps.length / ITEMS_PER_PAGE);
  const paginatedRsvps = filteredRsvps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attending).length,
    guests: rsvps.reduce((acc, r) => acc + (r.guestCount || 0), 0),
    notAttending: rsvps.filter(r => !r.attending).length
  };

  if (!authenticated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '40px', textAlign: 'center', border: '1px solid #f5f5f5', boxShadow: '0 20px 60px rgba(0,0,0,0.03)' }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: '24px', backgroundColor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, border: '1px solid #ffebeb' }}>
                <Heart size="40" color={brandColor} variant="Bulk" />
              </Box>
              <Typography variant="h5" sx={{
                fontFamily: '"Parisienne", cursive',
                fontSize: '2.8rem',
                color: brandColor,
                lineHeight: 1,
                mb: 1
              }}>
                {clientData ? `${clientData.brideName} & ${clientData.groomName}` : 'Couple Login'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1, fontWeight: 700, fontSize: '0.9rem' }}>
                ยินดีต้อนรับเข้าสู่ช่วงเวลาสำคัญของคุณ
              </Typography>
            </Box>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                type="password"
                placeholder="ระบุรหัสผ่าน"
                variant="outlined"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '50px', backgroundColor: '#fcfcfc' } }}
              />
              <Box sx={{
                mb: 3, p: 2, borderRadius: '16px', bgcolor: '#fdfdfd', border: '1px solid #f5f5f5',
                display: 'flex', gap: 1.5, alignItems: 'flex-start', textAlign: 'left'
              }}>
                <InfoCircle size="20" color={brandColor} variant="Bulk" style={{ flexShrink: 0, marginTop: '2px' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 600, display: 'block', mb: 0.2 }}>วิธีการล็อกอิน:</Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>
                    ระบุเลข <b>วันเดือนปีแต่งงาน (ววดดปปปป)</b><br />
                    โดยใช้ปี <b>ค.ศ.</b> เท่านั้น (เช่น 14052026)
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth type="submit" variant="contained"
                sx={{
                  py: 2, backgroundColor: brandColor, borderRadius: '50px', fontWeight: 600, textTransform: 'none', fontSize: '1rem',
                  boxShadow: '0 8px 25px rgba(242, 161, 161, 0.3)',
                  '&:hover': { backgroundColor: '#e89191' }
                }}
              >
                เปิดสมุดลงทะเบียน
              </Button>
            </form>
          </Paper>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 2 }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            icon={snackbar.severity === 'error' ? <Danger variant="Bulk" size="20" color="#ffffff" /> : <TickCircle variant="Bulk" size="20" color="#ffffff" />}
            sx={{
              borderRadius: '24px', fontWeight: 600, px: 3, py: 1,
              bgcolor: snackbar.severity === 'error' ? '#ff5252' : successGreen,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              fontSize: '0.95rem'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffffff' }}>
        <CircularProgress sx={{ color: brandColor }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', pb: 10, position: 'relative' }}>
      {/* Logout Icon Top Right */}
      <IconButton
        onClick={handleLogout}
        sx={{
          position: 'absolute',
          top: { xs: 20, md: 30 },
          right: { xs: 20, md: 30 },
          bgcolor: alpha(brandColor, 0.08),
          border: '1px solid #f87171',
          color: brandColor,
          '&:hover': { bgcolor: alpha(brandColor, 0.15) }
        }}
      >
        <Logout size="22" variant="Linear" color="#f87171" />
      </IconButton>

      {/* Elegant Header Area */}
      <Box sx={{ pt: 8, pb: 6, borderBottom: '1px solid #f8f8f8' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.3em', color: '#888', fontWeight: 800, fontSize: { xs: '0.6rem', md: '0.7rem' } }}>GUEST LIST DASHBOARD</Typography>
            <Typography variant="h2" sx={{ fontFamily: '"Parisienne", cursive', fontWeight: 400, mt: 1, color: '#1a1a1a', fontSize: { xs: '2.4rem', md: '3.5rem' }, lineHeight: 1.2 }}>
              {clientData?.brideName} & {clientData?.groomName}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Calendar size="18" color={brandColor} variant="Bulk" />
                <Typography variant="body2" sx={{ color: '#444', fontWeight: 700 }}>{clientData?.eventDate ? new Date(clientData.eventDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Vibrant Compact Stats Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            mt: 5
          }}>
            {[
              { label: 'ลงทะเบียน', value: stats.total, color: '#f2a1a1', icon: <Heart variant="Bulk" size="32" color="#f2a1a1" /> },
              { label: 'มาแน่นอน', value: stats.attending, color: successGreen, icon: <TickCircle variant="Bulk" size="32" color={successGreen} /> },
              { label: 'แขกทั้งหมด', value: stats.guests, color: '#f6d365', icon: <People variant="Bulk" size="32" color="#f6d365" /> },
              { label: 'ติดธุระ', value: stats.notAttending, color: '#dc3545', icon: <CloseCircle variant="Bulk" size="32" color="#dc3545" /> }
            ].map((stat, i) => (
              <Paper key={i} elevation={0} sx={{
                p: { xs: 2.2, md: 2.5 },
                borderRadius: '24px',
                border: `1px solid ${alpha(stat.color, 0.15)}`,
                background: alpha(stat.color, 0.02),
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 15px 35px ${alpha(stat.color, 0.1)}`, background: alpha(stat.color, 0.05) }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 800, fontSize: { xs: '0.7rem', md: '0.8rem' }, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.2 }}>{stat.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a1a1a', fontSize: { xs: '1.8rem', md: '2.2rem' }, lineHeight: 1 }}>{stat.value}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* View Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
          <Stack direction="row" spacing={0} sx={{ bgcolor: '#fcfcfc', borderRadius: '50px', p: 0.5, border: '1px solid #f0f0f0' }}>
            <Button
              onClick={() => setCurrentView('rsvp')}
              sx={{ px: { xs: 3, md: 5 }, py: 1.5, borderRadius: '50px', fontWeight: 800, color: currentView === 'rsvp' ? '#fff' : '#666', bgcolor: currentView === 'rsvp' ? brandColor : 'transparent', boxShadow: currentView === 'rsvp' ? '0 4px 15px rgba(242, 161, 161, 0.3)' : 'none', '&:hover': { bgcolor: currentView === 'rsvp' ? brandColor : '#f5f5f5' } }}
            >
              รายชื่อแขก
            </Button>
            <Button
              onClick={() => setCurrentView('wishes')}
              sx={{ px: { xs: 3, md: 5 }, py: 1.5, borderRadius: '50px', fontWeight: 800, color: currentView === 'wishes' ? '#fff' : '#666', bgcolor: currentView === 'wishes' ? brandColor : 'transparent', boxShadow: currentView === 'wishes' ? '0 4px 15px rgba(242, 161, 161, 0.3)' : 'none', '&:hover': { bgcolor: currentView === 'wishes' ? brandColor : '#f5f5f5' } }}
            >
              สมุดอวยพร
            </Button>
          </Stack>
        </Box>

        {currentView === 'rsvp' ? (
          <Box>
            {/* Controls */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
              <TextField
                fullWidth
                placeholder="ค้นหาชื่อแขก..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1.5 }}>
                        <SearchNormal1 size="20" color={brandColor} variant="Bulk" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '50px', backgroundColor: '#fcfcfc', border: '1px solid #f5f5f5', '& fieldset': { border: 'none' } }
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleExportExcel}
                startIcon={<DocumentDownload size="20" variant="Bulk" color={successGreen} />}
                sx={{
                  borderRadius: '50px', borderColor: alpha(successGreen, 0.2), color: '#1a1a1a', px: 4, height: '56px', fontWeight: 600,
                  textTransform: 'none', border: '1px solid #eee', fontSize: '0.9rem',
                  '&:hover': { bgcolor: alpha(successGreen, 0.02), borderColor: successGreen },
                  width: { xs: '100%', md: 'auto' }
                }}
              >
                Export รายชื่อแขก (Excel)
              </Button>
            </Stack>

            {/* Guest Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
              {paginatedRsvps.map((rsvp) => (
                <Card key={rsvp.id} elevation={0} sx={{
                  borderRadius: '24px',
                  border: '1px solid #eee',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 30px rgba(242, 161, 161, 0.08)',
                    borderColor: '#e89191',
                    bgcolor: '#fffdfd'
                  }
                }}>
                  <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2.5} alignItems={{ md: 'center' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: { xs: '1.05rem', md: '1.2rem' } }}>{rsvp.name}</Typography>
                        <Stack direction="row" spacing={2.5} sx={{ mt: 0.5 }}>
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            <Call size="16" color="#4facfe" variant="Bulk" />
                            <Typography variant="caption" sx={{ color: '#444', fontWeight: 700, fontSize: '0.85rem' }}>{rsvp.phone || '-'}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            <People size="16" color="#f6d365" variant="Bulk" />
                            <Typography variant="caption" sx={{ color: '#444', fontWeight: 700, fontSize: '0.85rem' }}>{rsvp.guestCount} ท่าน</Typography>
                          </Stack>
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={3} alignItems="center" justifyContent={{ xs: 'space-between', md: 'flex-end' }}>
                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                          <Typography variant="caption" sx={{ color: '#777', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.6rem' }}>DATE REGISTERED</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '0.9rem' }}>
                            {new Date(rsvp.createdAt).toLocaleDateString('th-TH')}
                          </Typography>
                        </Box>

                        {/* Delete Toggle Button */}
                        <IconButton
                          onClick={() => setDeleteId(rsvp.id)}
                          sx={{
                            color: '#f87171',
                            bgcolor: alpha('#f87171', 0.05),
                            '&:hover': { bgcolor: alpha('#f87171', 0.12) }
                          }}
                        >
                          <Trash size="20" variant="Bulk" color="#f87171" />
                        </IconButton>
                      </Stack>
                    </Stack>

                    {rsvp.dietary && (
                      <Box sx={{ mt: 2, p: 2, borderRadius: '16px', bgcolor: '#fcfcfc', border: '1px solid #f5f5f5' }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#444', fontSize: '0.9rem' }}>
                          " {rsvp.dietary} "
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredRsvps.length === 0 && (
                <Box sx={{ width: '100%', py: 12, textAlign: 'center', borderRadius: '40px', border: '2px dashed #f5f5f5' }}>
                  <Heart size="48" color="#eee" variant="Bulk" />
                  <Typography sx={{ color: '#444', fontWeight: 700, mt: 2 }}>ยังไม่พบแขกที่ลงทะเบียนในขณะนี้</Typography>
                </Box>
              )}
            </Box>

            {/* Pagination Controls */}
            {pageCount > 1 && (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 800,
                      borderRadius: '12px',
                      '&.Mui-selected': {
                        bgcolor: brandColor,
                        color: 'white',
                        '&:hover': { bgcolor: '#e89191' }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            {/* Wishes Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: { xs: 2.5, sm: 3, md: 5 }, p: { xs: 1, md: 3 } }}>
              {wishes.map((wish, index) => {
                const rot = index % 2 === 0 ? '-2deg' : '2deg';
                const hasImage = wish.images && wish.images.length > 0;

                return (
                  <Card
                    key={wish.id}
                    elevation={0}
                    sx={{
                      bgcolor: '#ffffff',
                      p: { xs: 1.5, md: 2 },
                      pb: { xs: 3, md: 4 },
                      borderRadius: '4px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04)',
                      transform: { md: `rotate(${rot})` },
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: { md: 'rotate(0deg) scale(1.05)' },
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 5px 15px rgba(0,0,0,0.06)',
                        zIndex: 10
                      },
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <IconButton onClick={() => setDeleteWishId(wish.id)} size="small" sx={{ position: 'absolute', top: { xs: 6, md: 8 }, right: { xs: 6, md: 8 }, color: '#f87171', bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#fee2e2' }, zIndex: 5, width: { xs: 32, md: 36 }, height: { xs: 32, md: 36 } }}>
                      <Trash size="18" variant="Bulk" color="#f87171" />
                    </IconButton>

                    {/* Polaroid Photo Frame */}
                    {(wish.drawing || hasImage) ? (
                      <Box
                        sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#f5f5f5', position: 'relative', overflow: 'hidden', mb: { xs: 1.5, md: 2 }, cursor: 'pointer', border: '1px solid #f0f0f0' }}
                        onClick={() => {
                          const imgs = [];
                          if (wish.drawing) imgs.push(wish.drawing);
                          if (wish.images) imgs.push(...wish.images);
                          setViewImages(imgs);
                        }}
                      >
                        <Box component="img" src={wish.drawing || wish.images[0]} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {wish.images && wish.images.length > 1 && (
                          <Box sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', px: 1, py: 0.2, borderRadius: 1, fontSize: '0.65rem', fontWeight: 600 }}>
                            +{wish.images.length - 1} รูป
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ width: '100%', aspectRatio: '1/0.6', bgcolor: alpha(brandColor, 0.04), mb: { xs: 1.5, md: 2 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Heart size="24" color={alpha(brandColor, 0.2)} variant="Bulk" />
                      </Box>
                    )}

                    {/* Message Area */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 0.5 }}>
                      {wish.message && (
                        <Typography sx={{ color: '#444', mb: 1.5, fontFamily: '"Prompt", sans-serif', fontStyle: 'italic', fontSize: { xs: '0.75rem', md: '0.95rem' }, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          "{wish.message}"
                        </Typography>
                      )}
                      <Typography sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: { xs: '0.85rem', md: '1.1rem' }, fontFamily: '"Prompt", sans-serif' }}>
                        - {wish.name} -
                      </Typography>
                    </Box>
                  </Card>
                );
              })}

              {wishes.length === 0 && (
                <Box sx={{ gridColumn: '1 / -1', py: 12, textAlign: 'center', borderRadius: '40px', border: '2px dashed #f5f5f5' }}>
                  <Heart size="48" color="#eee" variant="Bulk" />
                  <Typography sx={{ color: '#444', fontWeight: 700, mt: 2 }}>ยังไม่มีคำอวยพรในขณะนี้</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => !isDeleting && setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1a1a1a' }}>ยืนยันการลบรายชื่อแขก?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666', fontWeight: 600 }}>
            คุณแน่ใจหรือไม่ว่าต้องการลบรายชื่อแขกท่านนี้ออกจากระบบ? ข้อมูลการลงทะเบียนทั้งหมดของเขาจะหายไปและไม่สามารถกู้คืนได้ครับ
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            disabled={isDeleting}
            onClick={() => setDeleteId(null)}
            sx={{ color: '#888', fontWeight: 700, borderRadius: '50px', px: 3 }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={18} color="inherit" /> : <Trash size="18" variant="Bulk" color="#fff" />}
            sx={{
              bgcolor: '#ff5252',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '50px',
              px: 4,
              boxShadow: '0 8px 20px rgba(255, 82, 82, 0.25)',
              '&:hover': { bgcolor: '#ef4444' }
            }}
          >
            ยืนยันการลบ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Wish Dialog */}
      <Dialog open={!!deleteWishId} onClose={() => !isDeleting && setDeleteWishId(null)} PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1a1a1a' }}>ยืนยันลบคำอวยพร?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666', fontWeight: 600 }}>
            คำอวยพรรวมถึงรูปวาดและรูปถ่ายทั้งหมดที่เกี่ยวข้องจะถูกลบถาวร ไม่สามารถกู้คืนได้ครับ
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button disabled={isDeleting} onClick={() => setDeleteWishId(null)} sx={{ color: '#888', fontWeight: 700, borderRadius: '50px', px: 3 }}>ยกเลิก</Button>
          <Button onClick={handleDeleteWish} disabled={isDeleting} sx={{ bgcolor: '#ff5252', color: '#fff', fontWeight: 700, borderRadius: '50px', px: 4, '&:hover': { bgcolor: '#ef4444' } }}>ยืนยันการลบ</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={snackbar.severity === 'error' ? <Danger variant="Bulk" size="20" color="#ffffff" /> : <TickCircle variant="Bulk" size="20" color="#ffffff" />}
          sx={{
            borderRadius: '24px', fontWeight: 600, px: 3, py: 1,
            bgcolor: snackbar.severity === 'error' ? '#ff5252' : successGreen,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            fontSize: '0.95rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Lightbox Dialog for Images/Drawings */}
      <Dialog
        open={viewImages.length > 0}
        onClose={() => setViewImages([])}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(8px)',
          }
        }}
        TransitionProps={{ timeout: 400 }}
      >
        <Box sx={{
          position: 'relative', width: '100%', height: '100%',
          '& .swiper-button-next, & .swiper-button-prev': { color: '#ffffff', dropShadow: '0 2px 5px rgba(0,0,0,0.5)' },
          '& .swiper-pagination-bullet': { bgcolor: '#ffffff', opacity: 0.5 },
          '& .swiper-pagination-bullet-active': { opacity: 1 }
        }}>
          <Swiper
            modules={[Navigation, SwiperPagination]}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            style={{ width: '100%', height: '100%' }}
          >
            {viewImages.map((imgSrc, idx) => (
              <SwiperSlide key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Box component="img" src={imgSrc} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', p: { xs: 2, md: 6 } }} />
              </SwiperSlide>
            ))}
          </Swiper>

          <IconButton
            onClick={() => setViewImages([])}
            sx={{
              position: 'fixed',
              top: { xs: 20, md: 32 },
              right: { xs: 20, md: 32 },
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              zIndex: 20
            }}
          >
            <CloseCircle variant="Linear" size="32" color="#fff" />
          </IconButton>
        </Box>
      </Dialog>
    </Box>
  );
}
