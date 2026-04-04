'use client';

import React, { useState } from 'react';
import { Box, Card, Typography, Button, IconButton, Drawer, TextField, Divider, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress, Switch, Stack } from '@mui/material';
import { Reorder } from 'framer-motion';
import { Menu, Eye, Save2, ColorSwatch, CloseSquare, Trash } from 'iconsax-react';
import { useSnackbar } from '../components/SnackbarProvider';
import { updateClientLayout, updateClientHero, updateClientTheme, updateClientCouple, updateClientGallery, updateClientCountdown, updateClientSchedule, updateClientDressCode, updateClientLocation, updateClientGift } from '../clients/actions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const initialLayout = [
  { id: 'hero', title: 'หน้าปก (Hero Section)', icon: '🎞️' },
  { id: 'couple', title: 'ข้อมูลบ่าวสาว (Couple Section)', icon: '👫' },
  { id: 'schedule', title: 'ตารางพิธีการ (Schedule)', icon: '📅' },
  { id: 'countdown', title: 'นับถอยหลัง (Countdown)', icon: '⏰' },
  { id: 'gallery', title: 'แกลเลอรี่ (Gallery)', icon: '📸' },
  { id: 'location', title: 'สถานที่จัดงาน (Venue)', icon: '📍' },
  { id: 'rsvp', title: 'ตอบรับบัตรเชิญ (RSVP)', icon: '✉️' },
  { id: 'giftMoney', title: 'ซองของขวัญ (Gift)', icon: '🎁' },
];

export default function BuilderEditor({ client }: { client: any }) {
  const [items, setItems] = useState(() => {
    type LayoutItem = typeof initialLayout[number];
    if (client?.layoutOrder && Array.isArray(client.layoutOrder)) {
      const savedItems = (client.layoutOrder as string[])
        .map((id: string) => initialLayout.find(l => l.id === id))
        .filter((x): x is LayoutItem => Boolean(x));

      // Find items in initialLayout that are NOT in savedItems
      const missingItems = initialLayout.filter(l => !savedItems.find(s => s.id === l.id));

      return [...savedItems, ...missingItems];
    }
    return initialLayout;
  });
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'color'>(() => client?.heroSection?.mediaType || 'image');
  const [previewImage, setPreviewImage] = useState<string | null>(client?.heroSection?.heroImage || null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(client?.heroSection?.heroVideo || null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(client?.heroSection?.heroPoster || null);
  const [previewNameImage, setPreviewNameImage] = useState<string | null>(client?.heroSection?.heroNameImage || null);
  const [heroStyle, setHeroStyle] = useState<'classic' | 'editorial' | 'minimal'>(() => client?.heroSection?.heroStyle || 'classic');
  const [heroBackgroundColor, setHeroBackgroundColor] = useState<string>(() => client?.heroSection?.heroBackgroundColor || '#ffffff');

  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>({ heroImage: null, heroVideo: null, heroPoster: null, heroNameImage: null, bridePic: null, groomPic: null });
  const [savedPaths, setSavedPaths] = useState<Record<string, string>>({
    heroImage: client?.heroSection?.heroImage || '',
    heroVideo: client?.heroSection?.heroVideo || '',
    heroPoster: client?.heroSection?.heroPoster || '',
    heroNameImage: client?.heroSection?.heroNameImage || '',
    bridePic: client?.coupleSection?.bridePic || '',
    groomPic: client?.coupleSection?.groomPic || '',
    giftQrCode: client?.giftSection?.qrCode || '',
  });

  const [previewBridePic, setPreviewBridePic] = useState<string | null>(client?.coupleSection?.bridePic || null);
  const [previewGroomPic, setPreviewGroomPic] = useState<string | null>(client?.coupleSection?.groomPic || null);
  const [previewGiftQrCode, setPreviewGiftQrCode] = useState<string | null>(client?.giftSection?.qrCode || null);
  const [coupleStyle, setCoupleStyle] = useState<string>(() => client?.coupleSection?.coupleStyle || 'arch-duo');
  const [introText, setIntroText] = useState<string>(() => client?.coupleSection?.introText || 'Two paths that led to one beautiful journey...');

  const [showPetals, setShowPetals] = useState<boolean>(() => !!client?.heroSection?.showFallingPetals);

  const [primaryColor, setPrimaryColor] = useState<string>(client?.primaryColor || '#8e7d5d');
  const [secondaryColor, setSecondaryColor] = useState<string>(client?.secondaryColor || '#faf9f6');
  const [fontFamily, setFontFamily] = useState<string>(client?.fontFamily || 'Prompt');

  const [galleryItems, setGalleryItems] = useState<string[]>(() => {
    if (client?.galleryImages) {
      if (Array.isArray(client.galleryImages)) return client.galleryImages as string[];
      if (typeof client.galleryImages === 'object') return (client.galleryImages as any).items || [];
    }
    return [];
  });
  const [galleryLayout, setGalleryLayout] = useState<'masonry' | 'carousel' | 'coverflow' | 'cards' | 'slide'>(() => client?.galleryImages?.layout || 'masonry');
  const [dressCodeColors, setDressCodeColors] = useState<string[]>(() => client?.dressCodeSection?.colors || ['#e0d7c6', '#bbaa99', '#8e7970']);
  const [dressCodeTitle, setDressCodeTitle] = useState<string>(() => client?.dressCodeSection?.title || 'DRESS CODE');
  const [dressCodeSubtitle, setDressCodeSubtitle] = useState<string>(() => client?.dressCodeSection?.subtitle || 'WE WOULD LOVE TO SEE YOU IN OUR WEDDING THEME');
  const [venueName, setVenueName] = useState<string>(() => client?.locationSection?.venueName || 'Cape Dara Resort Pattaya');
  const [venueAddress, setVenueAddress] = useState<string>(() => client?.locationSection?.venueAddress || '256 Dara Beach, Soi 20, Pattaya-Naklua Road, Pattaya City, Bang Lamung District, Chonburi 20150');
  const [googleMapExternal, setGoogleMapExternal] = useState<string>(() => client?.locationSection?.googleMapExternal || 'https://www.google.com/maps/search/?api=1&query=Cape+Dara+Resort+Pattaya');
  const [googleMapEmbed, setGoogleMapEmbed] = useState<string>(() => client?.locationSection?.googleMapEmbed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.2435422830887!2d100.8809428!3d12.95627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102beab977fc641%3A0x67ee1c742cf6b5e0!2sCape%20Dara%20Resort%20Pattaya!5e0!3m2!1sen!2sth!4v1711000000000!5m2!1sen!2sth');

  const [scheduleItems, setScheduleItems] = useState<any[]>(
    (client?.scheduleSection as any[]) || [
      { time: '09:09', title: 'Engagement Ceremony', titleTh: 'พิธีหมั้นและขบวนขันหมาก', description: '' },
      { time: '18:00', title: 'Wedding Reception', titleTh: 'ฉลองมงคลสมรส', description: '' }
    ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [eventDate, setEventDate] = useState<Dayjs | null>(client?.eventDate ? dayjs(client.eventDate) : dayjs('2026-05-14'));
  const { showSnackbar } = useSnackbar();

  const handleGiftSave = async (formData: FormData) => {
    if (!client) { showSnackbar('ไม่พบข้อมูลลูกค้า', 'error'); return; }
    setIsSaving(true);
    try {
      let finalQrCode = savedPaths.giftQrCode;

      // 1. Upload new QR if pending
      if (pendingFiles.giftQrCode) {
        finalQrCode = await uploadOneFile(pendingFiles.giftQrCode, 'giftQrCode');
      }

      // 2. Set the qrCode URL into formData BEFORE saving
      formData.set('qrCode', finalQrCode || '');
      
      const response = await updateClientGift(client.id, formData);
      
      if (response.success) {
        showSnackbar('บันทึกข้อมูลของขวัญเรียบร้อย', 'success');
        setSavedPaths(prev => ({ ...prev, giftQrCode: finalQrCode }));
        setPendingFiles(prev => ({ ...prev, giftQrCode: null }));
        setEditingItem(null);
      } else {
        showSnackbar(response.error || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch (e: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + e.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Select file → preview only, no upload yet
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'heroImage' | 'heroVideo' | 'heroPoster' | 'heroNameImage' | 'bridePic' | 'groomPic' | 'giftQrCode') => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setPendingFiles(prev => ({ ...prev, [fileType]: file }));
    const url = URL.createObjectURL(file);
    if (fileType === 'heroImage') setPreviewImage(url);
    if (fileType === 'heroVideo') setPreviewVideo(url);
    if (fileType === 'heroPoster') setPreviewPoster(url);
    if (fileType === 'heroNameImage') setPreviewNameImage(url);
    if (fileType === 'bridePic') setPreviewBridePic(url);
    if (fileType === 'groomPic') setPreviewGroomPic(url);
    if (fileType === 'giftQrCode') setPreviewGiftQrCode(url);
  };

  // Remove file → clear preview & delete from server immediately
  const handleFileRemove = async (fileType: 'heroImage' | 'heroVideo' | 'heroPoster' | 'heroNameImage' | 'bridePic' | 'groomPic' | 'giftQrCode') => {
    setPendingFiles(prev => ({ ...prev, [fileType]: null }));
    if (fileType === 'heroImage') setPreviewImage(null);
    if (fileType === 'heroVideo') setPreviewVideo(null);
    if (fileType === 'heroPoster') setPreviewPoster(null);
    if (fileType === 'heroNameImage') setPreviewNameImage(null);
    if (fileType === 'bridePic') setPreviewBridePic(null);
    if (fileType === 'groomPic') setPreviewGroomPic(null);
    if (fileType === 'giftQrCode') setPreviewGiftQrCode(null);

    const pathToDelete = savedPaths[fileType];
    if (pathToDelete && client) {
      setSavedPaths(prev => ({ ...prev, [fileType]: '' }));
      try {
        await fetch('/api/upload/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: client.id, fileType, filePath: pathToDelete })
        });
        showSnackbar('ลบไฟล์เรียบร้อย', 'success');
      } catch {
        showSnackbar('ลบไฟล์ไม่สำเร็จ', 'error');
      }
    }
  };

  // Upload a single file to server
  const uploadOneFile = async (file: File, fileType: string): Promise<string> => {
    if (!client) return '';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('clientId', client.id);
    fd.append('fileType', fileType);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) return data.url;
    throw new Error(data.error || 'Upload failed');
  };

  // Save layout order
  const handleSave = async () => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    const orderIds = items.map(i => i.id);
    const res = await updateClientLayout(client.id, orderIds);
    setIsSaving(false);
    if (res?.error) showSnackbar(res.error, 'error');
    else showSnackbar('บันทึกการจัดเรียงเข้าสู่ฐานข้อมูลสำเร็จ!', 'success');
  };

  // Save hero: delete old files → upload new files → save form data
  const handleHeroSave = async (formData: FormData) => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      // 2. Upload pending new files
      const finalPaths = { ...savedPaths };
      for (const [key, file] of Object.entries(pendingFiles)) {
        if (file) finalPaths[key] = await uploadOneFile(file, key);
      }

      // 3. Save form + file paths to DB
      formData.append('mediaType', mediaType);
      formData.append('heroStyle', heroStyle);
      formData.append('heroBackgroundColor', heroBackgroundColor);
      if (finalPaths.heroImage) formData.append('heroImage', finalPaths.heroImage);
      if (finalPaths.heroVideo) formData.append('heroVideo', finalPaths.heroVideo);
      if (finalPaths.heroPoster) formData.append('heroPoster', finalPaths.heroPoster);
      if (finalPaths.heroNameImage) formData.append('heroNameImage', finalPaths.heroNameImage);
      formData.append('showFallingPetals', String(showPetals));

      const res = await updateClientHero(client.id, formData);
      if (res?.error) {
        showSnackbar(res.error, 'error');
      } else {
        showSnackbar('บันทึกข้อมูลหน้าปกเรียบร้อย!', 'success');
        setSavedPaths(finalPaths);
        setPendingFiles({ heroImage: null, heroVideo: null, heroPoster: null, heroNameImage: null, bridePic: null, groomPic: null });
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoupleSave = async (formData: FormData) => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const finalPaths = { ...savedPaths };
      if (pendingFiles.bridePic) finalPaths.bridePic = await uploadOneFile(pendingFiles.bridePic, 'bridePic');
      if (pendingFiles.groomPic) finalPaths.groomPic = await uploadOneFile(pendingFiles.groomPic, 'groomPic');

      if (finalPaths.bridePic) formData.append('bridePic', finalPaths.bridePic);
      if (finalPaths.groomPic) formData.append('groomPic', finalPaths.groomPic);
      formData.append('coupleStyle', coupleStyle);

      const res = await updateClientCouple(client.id, formData);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกข้อมูลบ่าวสาวเรียบร้อย!', 'success');
        setSavedPaths(finalPaths);
        setPendingFiles({ ...pendingFiles, bridePic: null, groomPic: null });
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeSave = async (formData: FormData) => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const res = await updateClientTheme(client.id, formData);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกธีมสีและฟอนต์เรียบร้อย!', 'success');
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !client) return;
    setIsSaving(true);

    try {
      const files = Array.from(e.target.files);
      const newUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('clientId', client.id);
        formData.append('fileType', 'gallery');

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
      }

      setGalleryItems(prev => [...newUrls, ...prev]);
      showSnackbar(`อัปโหลดรูปภาพ ${newUrls.length} รูปเรียบร้อย!`, 'success');
    } catch (err: any) {
      showSnackbar('อัปโหลดล้มเหลว: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
      e.target.value = ''; // Clear for re-uploading same files
    }
  };

  const handleGallerySave = async () => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const res = await updateClientGallery(client.id, galleryItems, galleryLayout);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกแกลเลอรีเรียบร้อย!', 'success');
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCountdownSave = async (formData: FormData) => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const res = await updateClientCountdown(client.id, formData);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกส่วนนับถอยหลังเรียบร้อย!', 'success');
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDressCodeSave = async () => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const res = await updateClientDressCode(client.id, dressCodeTitle, dressCodeSubtitle, dressCodeColors);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกธีมการแต่งกายเรียบร้อย!', 'success');
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScheduleSave = async () => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const res = await updateClientSchedule(client.id, scheduleItems);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกตารางพิธีการเรียบร้อย!', 'success');
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocationSave = async (formData: FormData) => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const res = await updateClientLocation(client.id, formData);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
        showSnackbar('บันทึกสถานที่จัดงานเรียบร้อย!', 'success');
        setEditingItem(null);
      }
    } catch (err: any) {
      showSnackbar('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>

      {/* Editor Main */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="700">ลำดับการแสดงผล (Layout Sections)</Typography>
          <Button variant="contained" disabled={isSaving} startIcon={<Save2 variant="Bold" size={20} color="currentColor" />} onClick={handleSave} sx={{ bgcolor: '#f472b6', color: '#ffffff', borderRadius: 1, fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
            บันทึก Layout
          </Button>
        </Box>

        <Reorder.Group axis="y" values={items} onReorder={setItems} as="div">
          {items.map(item => (
            <Reorder.Item value={item} key={item.id} as="div" style={{ listStyle: 'none' }}>
              <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 1, p: 0, cursor: 'grab', border: '1px solid #e2e8f0', '&:hover': { borderColor: '#f472b6', boxShadow: '0 2px 8px rgba(244,114,182,0.15)' }, transition: 'all 0.15s' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', cursor: 'grab' }}>
                    <Menu variant="Outline" size={20} color="currentColor" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <Typography fontSize="1.2rem">{item.icon}</Typography>
                    <Typography variant="body2" fontWeight="700" color="#0f172a">{item.title}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#f472b6', bgcolor: '#fdf2f8' } }} onClick={() => setEditingItem(item)}>
                      <ColorSwatch variant="Outline" size={18} color="currentColor" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0ea5e9', bgcolor: '#f0f9ff' } }}>
                      <Eye variant="Outline" size={18} color="currentColor" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Box>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        sx={{ zIndex: 1250 }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 500, md: 550, lg: 600 },
            p: { xs: 3, md: 5 },
            bgcolor: '#f8fafc',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
          }
        }}
      >
        {editingItem && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="800" color="#0f172a">ปรับแต่ง: {editingItem.title}</Typography>
              <IconButton onClick={() => setEditingItem(null)}>
                <CloseSquare variant="Outline" size={24} color="#64748b" />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {/* ===== Hero Section Form ===== */}
            {editingItem.id === 'hero' && (
              <Box component="form" action={handleHeroSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* --- ข้อมูลพื้นฐาน --- */}
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ข้อมูลคู่บ่าวสาว</Typography>
                <TextField name="groomName" label="ชื่อเจ้าบ่าว" defaultValue={client?.groomName || "Pu"} size="small" fullWidth sx={{ bgcolor: 'white' }} />
                <TextField name="brideName" label="ชื่อเจ้าสาว" defaultValue={client?.brideName || "Pim"} size="small" fullWidth sx={{ bgcolor: 'white' }} />

                <input type="hidden" name="eventDate" value={eventDate ? eventDate.toISOString() : ''} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="วันที่จัดงาน" value={eventDate} onChange={(val) => setEventDate(val)} format="DD/MM/YYYY" slotProps={{ textField: { size: 'small', fullWidth: true, sx: { bgcolor: 'white' } } }} />
                </LocalizationProvider>

                <TextField name="locationText" label="สถานที่จัดงาน" defaultValue={client?.heroSection?.locationText || "PATTAYA • CHONBURI"} size="small" fullWidth sx={{ bgcolor: 'white' }} />

                {/* --- เลือกสไตล์ Hero --- */}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>สไตล์การจัดวาง (Hero Style)</Typography>
                <TextField select value={heroStyle} onChange={(e) => setHeroStyle(e.target.value as any)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                  <MenuItem value="classic">Classic Center (ดั้งเดิม - กลาง)</MenuItem>
                  <MenuItem value="editorial">Editorial Left (นิตยสาร - ชิดซ้าย)</MenuItem>
                  <MenuItem value="minimal">Minimal Vertical (มินิมอล - แนวตั้ง)</MenuItem>
                </TextField>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showPetals}
                      onChange={(e) => setShowPetals(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#22c55e',
                          '&:hover': {
                            backgroundColor: 'rgba(34, 197, 94, 0.08)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#22c55e',
                        },
                      }}
                    />
                  }
                  label={<Typography variant="body2" fontWeight={600} color={showPetals ? "#166534" : "#475569"}>แสดงกลีบดอกไม้ร่วง ✨</Typography>}
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>รูปภาพชื่อบ่าวสาว (Calligraphy/Logo)</Typography>
                <Typography variant="caption" color="text.secondary">ถ้าแนบรูปจะแสดงรูปแทนที่ชื่อแบบตัวอักษร</Typography>
                {previewNameImage && (
                  <Box sx={{ position: 'relative' }}>
                    <Box component="img" src={previewNameImage} sx={{ width: '100%', height: 120, objectFit: 'contain', borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }} />
                    <IconButton onClick={() => handleFileRemove('heroNameImage')} size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}>
                      <Trash size={14} color="currentColor" variant="Bold" />
                    </IconButton>
                  </Box>
                )}
                <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', borderRadius: 1, py: 1.2, borderStyle: 'dashed', borderWidth: 2, color: '#64748b', borderColor: '#cbd5e1', '&:hover': { bgcolor: '#fdf2f8', borderColor: '#db2777' } }}>
                  {previewNameImage ? 'เปลี่ยนรูปภาพชื่อ' : '+ เลือกรูปชื่อบ่าวสาว'}
                  <input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'heroNameImage')} />
                </Button>

                {/* --- เลือกสื่อหน้าปก --- */}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>สื่อหน้าปก</Typography>

                <FormControl component="fieldset">
                  <RadioGroup row value={mediaType} onChange={(e) => setMediaType(e.target.value as 'video' | 'image' | 'color')}>
                    <FormControlLabel value="image" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#f472b6' } }} />} label={<Typography variant="body2" fontWeight={600}>รูปภาพ</Typography>} />
                    <FormControlLabel value="video" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#f472b6' } }} />} label={<Typography variant="body2" fontWeight={600}>วิดีโอ</Typography>} />
                    <FormControlLabel value="color" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#f472b6' } }} />} label={<Typography variant="body2" fontWeight={600}>สีพื้น</Typography>} />
                  </RadioGroup>
                </FormControl>

                {mediaType === 'image' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {previewImage && (
                      <Box sx={{ position: 'relative' }}>
                        <Box component="img" src={previewImage} sx={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 1, border: '1px solid #e2e8f0' }} />
                        <IconButton onClick={() => handleFileRemove('heroImage')} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}>
                          <Trash size={16} color="currentColor" variant="Bold" />
                        </IconButton>
                      </Box>
                    )}
                    <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', borderRadius: 1, py: 1.5, borderStyle: 'dashed', borderWidth: 2, color: '#64748b', borderColor: '#cbd5e1', '&:hover': { bgcolor: '#fdf2f8', borderColor: '#db2777' } }}>
                      + เลือกรูปภาพหน้าปก
                      <input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'heroImage')} />
                    </Button>
                  </Box>
                ) : mediaType === 'video' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {previewVideo && (
                      <Box sx={{ position: 'relative' }}>
                        <Box component="video" src={previewVideo} controls sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#000' }} />
                        <IconButton onClick={() => handleFileRemove('heroVideo')} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}>
                          <Trash size={16} color="currentColor" variant="Bold" />
                        </IconButton>
                      </Box>
                    )}
                    <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', borderRadius: 1, py: 1.5, borderStyle: 'dashed', borderWidth: 2, color: '#64748b', borderColor: '#cbd5e1', '&:hover': { bgcolor: '#fdf2f8', borderColor: '#db2777' } }}>
                      + เลือกวิดีโอ (MP4)
                      <input hidden accept="video/mp4" type="file" onChange={(e) => handleFileSelect(e, 'heroVideo')} />
                    </Button>

                    {previewPoster && (
                      <Box sx={{ position: 'relative' }}>
                        <Box component="img" src={previewPoster} sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 1, border: '1px solid #e2e8f0' }} />
                        <IconButton onClick={() => handleFileRemove('heroPoster')} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}>
                          <Trash size={16} color="currentColor" variant="Bold" />
                        </IconButton>
                      </Box>
                    )}
                    <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', borderRadius: 1, py: 1.5, borderStyle: 'dashed', borderWidth: 2, color: '#64748b', borderColor: '#cbd5e1', '&:hover': { bgcolor: '#fdf2f8', borderColor: '#db2777' } }}>
                      + เลือกรูปปกวิดีโอ (Poster)
                      <input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'heroPoster')} />
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                      <Typography variant="body2" fontWeight={600} mb={1}>พื้นหลัง (Background Color)</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <input
                          type="color"
                          value={heroBackgroundColor}
                          onChange={(e) => setHeroBackgroundColor(e.target.value)}
                          style={{ width: 60, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                        />
                        <TextField
                          value={heroBackgroundColor}
                          onChange={(e) => setHeroBackgroundColor(e.target.value)}
                          size="small"
                          fullWidth
                          sx={{ bgcolor: 'white' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* --- ปุ่ม Submit --- */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button type="submit" disabled={isSaving} variant="contained" fullWidth startIcon={isSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null} sx={{ bgcolor: '#f472b6', color: '#ffffff', borderRadius: 1, py: 1.5, fontWeight: 700, fontSize: '1rem', '&:hover': { bgcolor: '#db2777' }, '&.Mui-disabled': { bgcolor: '#f9a8d4', color: '#fff' } }}>
                    {isSaving ? 'กำลังบันทึกและอัปโหลด...' : 'บันทึกทั้งหมด'}
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => setEditingItem(null)} sx={{ borderRadius: 1, py: 1.2, fontWeight: 600, color: '#64748b', borderColor: '#e2e8f0', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' } }}>
                    ยกเลิก
                  </Button>
                </Box>
              </Box>
            )}

            {/* ===== Couple Section Form ===== */}
            {editingItem.id === 'couple' && (
              <Box component="form" action={handleCoupleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ชื่อที่แสดง (Display Names)</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    name="brideName"
                    label="ชื่อเจ้าสาว"
                    defaultValue={client?.coupleSection?.brideName || client?.brideName}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                  <TextField
                    name="groomName"
                    label="ชื่อเจ้าบ่าว"
                    defaultValue={client?.coupleSection?.groomName || client?.groomName}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>

                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ข้อความแนะนำ (Intro Text)</Typography>
                <TextField
                  name="introText"
                  label="คำขวัญ / บทนำ"
                  multiline
                  rows={3}
                  defaultValue={client?.coupleSection?.introText || "Two paths that led to one beautiful journey..."}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />

                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ผู้ใหญ่ฝั่งเจ้าสาว (Bride Parents)</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    name="brideFather"
                    label="ชื่อคุณพ่อ (เจ้าสาว)"
                    defaultValue={client?.coupleSection?.brideFather || ''}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                  <TextField
                    name="brideMother"
                    label="ชื่อคุณแม่ (เจ้าสาว)"
                    defaultValue={client?.coupleSection?.brideMother || ''}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>

                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ผู้ใหญ่ฝั่งเจ้าบ่าว (Groom Parents)</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    name="groomFather"
                    label="ชื่อคุณพ่อ (เจ้าบ่าว)"
                    defaultValue={client?.coupleSection?.groomFather || ''}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                  <TextField
                    name="groomMother"
                    label="ชื่อคุณแม่ (เจ้าบ่าว)"
                    defaultValue={client?.coupleSection?.groomMother || ''}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>สไตล์การจัดวาง (Couple Style)</Typography>
                <TextField select value={coupleStyle} onChange={(e) => setCoupleStyle(e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                  <MenuItem value="arch-duo">Arch Duo (ซุ้มโค้งสุดคลาสสิก)</MenuItem>
                  <MenuItem value="rounded-portrait">Rounded Portrait (รูปวงกลมเน้นใบหน้า)</MenuItem>
                </TextField>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {/* Bride Pic */}
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>รูปเจ้าสาว</Typography>
                    <Box sx={{ position: 'relative', width: '100%', pt: '140%', bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      {previewBridePic ? (
                        <Box component="img" src={previewBridePic} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>ไม่มีรูป</Box>
                      )}
                      {previewBridePic && (
                        <IconButton onClick={() => handleFileRemove('bridePic')} size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}>
                          <Trash size={12} color="currentColor" variant="Bold" />
                        </IconButton>
                      )}
                    </Box>
                    <Button variant="outlined" component="label" size="small" fullWidth sx={{ mt: 1, fontSize: '0.7rem', textTransform: 'none' }}>
                      เลือกรูปเจ้าสาว
                      <input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'bridePic')} />
                    </Button>
                  </Box>

                  {/* Groom Pic */}
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>รูปเจ้าบ่าว</Typography>
                    <Box sx={{ position: 'relative', width: '100%', pt: '140%', bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      {previewGroomPic ? (
                        <Box component="img" src={previewGroomPic} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>ไม่มีรูป</Box>
                      )}
                      {previewGroomPic && (
                        <IconButton onClick={() => handleFileRemove('groomPic')} size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}>
                          <Trash size={12} color="currentColor" variant="Bold" />
                        </IconButton>
                      )}
                    </Box>
                    <Button variant="outlined" component="label" size="small" fullWidth sx={{ mt: 1, fontSize: '0.7rem', textTransform: 'none' }}>
                      เลือกรูปเจ้าบ่าว
                      <input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'groomPic')} />
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button type="submit" disabled={isSaving} variant="contained" fullWidth startIcon={isSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null} sx={{ bgcolor: '#f472b6', color: '#ffffff', borderRadius: 1, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกส่วนบ่าวสาว'}
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => setEditingItem(null)} sx={{ borderRadius: 1, py: 1.2, fontWeight: 600, color: '#64748b', borderColor: '#e2e8f0' }}>ยกเลิก</Button>
                </Box>
              </Box>
            )}

            {/* ===== Gallery Section Form ===== */}
            {editingItem.id === 'gallery' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>สไตล์การจัดวาง (Gallery Layout)</Typography>
                <TextField select value={galleryLayout} onChange={(e) => setGalleryLayout(e.target.value as any)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                  <MenuItem value="coverflow">3D Coverflow (รูปเด้งตรงกลาง แบบเดิม)</MenuItem>
                  <MenuItem value="cards">Stacked Cards (ซ้อนกันเป็นกองการ์ด)</MenuItem>
                  <MenuItem value="slide">Modern Slide (เน้นความเรียบหรู ปัดลื่นๆ)</MenuItem>
                </TextField>

                <Divider sx={{ my: 1 }} />

                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: 1 }}>รูปภาพในแกลเลอรี ({galleryItems.length})</Typography>
                  <Button component="label" fullWidth variant="outlined" disabled={isSaving} sx={{ height: 60, borderStyle: 'dashed', borderRadius: 2, color: '#f472b6', borderColor: '#f472b6', mb: 2 }}>
                    {isSaving ? 'กำลังอัปโหลด...' : '+ เพิ่มรูปภาพ (เลือกได้หลายรูป)'}
                    <input type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />
                  </Button>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, maxHeight: 400, overflowY: 'auto', p: 1, border: '1px solid #f1f5f9', borderRadius: 2, bgcolor: '#fff' }}>
                    {galleryItems.map((img, idx) => (
                      <Box key={img + idx} sx={{ position: 'relative', pt: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid #e2e8f0', bgcolor: '#f1f5f9' }}>
                        <Box component="img" src={img} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton onClick={() => setGalleryItems(prev => prev.filter(item => item !== img))} size="small" sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.8)', color: '#ef4444', p: 0.5, '&:hover': { bgcolor: '#fff' } }}>
                          <Trash size={12} color="currentColor" variant="Bold" />
                        </IconButton>
                      </Box>
                    ))}
                    {galleryItems.length === 0 && (
                      <Box sx={{ gridColumn: 'span 3', py: 8, textAlign: 'center', color: '#94a3b8' }}>ยังไม่มีรูปภาพ</Box>
                    )}
                  </Box>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button disabled={isSaving} onClick={handleGallerySave} variant="contained" fullWidth startIcon={isSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null} sx={{ bgcolor: '#f472b6', color: '#ffffff', borderRadius: 1, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกแกลเลอรี'}
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => setEditingItem(null)} sx={{ borderRadius: 1, py: 1.2, fontWeight: 600, color: '#64748b', borderColor: '#e2e8f0' }}>ยกเลิก</Button>
                </Box>
              </Box>
            )}

            {/* ===== Countdown Section Form ===== */}
            {editingItem.id === 'countdown' && (
              <Box component="form" action={handleCountdownSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ข้อความแสดงผล (Display Messages)</Typography>
                <TextField
                  name="title"
                  label="หัวข้อหลัก"
                  defaultValue={client?.countdownSection?.title || 'นับถอยหลังสู่ช่วงเวลาแสนหวาน'}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />
                <TextField
                  name="subtitle"
                  label="หัวข้อรอง"
                  defaultValue={client?.countdownSection?.subtitle || 'See You Soon'}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />

                <Button fullWidth variant="contained" type="submit" disabled={isSaving} startIcon={isSaving ? null : <Save2 variant="Bold" size={20} color="currentColor" />} sx={{ mt: 2, height: 48, borderRadius: 1.5, bgcolor: '#f472b6', color: 'white', fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกส่วนนับถอยหลัง'}
                </Button>
              </Box>
            )}

            {/* ===== Schedule Section Form ===== */}
            {editingItem.id === 'schedule' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ตารางพิธีการ (Wedding Itinerary)</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {scheduleItems.map((item, index) => (
                    <Box key={index} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#f8fafc' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="#94a3b8">
                          ลำดับที่ {index + 1}
                        </Typography>
                        <IconButton size="small" onClick={() => setScheduleItems(prev => prev.filter((_, i) => i !== index))} sx={{ color: '#ef4444' }}>
                          <Trash variant="Bold" size={16} color="currentColor" />
                        </IconButton>
                      </Box>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="#64748b" display="block" mb={1}>เลือกไอคอนพิธีการ (1-9)</Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, p: 1, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#fff' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                              <Box
                                key={num}
                                onClick={() => {
                                  const newItems = [...scheduleItems];
                                  newItems[index].icon = num.toString();
                                  setScheduleItems(newItems);
                                }}
                                sx={{
                                  p: 0.5,
                                  border: '2px solid',
                                  borderColor: item.icon === num.toString() ? '#f472b6' : 'transparent',
                                  borderRadius: 1.5,
                                  cursor: 'pointer',
                                  bgcolor: item.icon === num.toString() ? 'rgba(244, 114, 182, 0.05)' : 'white',
                                  '&:hover': { bgcolor: '#f8fafc' },
                                  transition: 'all 0.1s ease'
                                }}
                              >
                                <Box component="img" src={`/images/icon/${num}.png`} sx={{ width: '100%', height: 'auto', display: 'block' }} />
                              </Box>
                            ))}
                          </Box>
                        </Box>

                        <TextField
                          label="เวลา" placeholder="เช่น 09:09" size="small" fullWidth sx={{ bgcolor: 'white' }}
                          value={item.time} onChange={(e) => {
                            const newItems = [...scheduleItems];
                            newItems[index].time = e.target.value;
                            setScheduleItems(newItems);
                          }}
                        />
                        <TextField
                          label="ชื่อพิธี (EN)" placeholder="เช่น Engagement Ceremony" size="small" fullWidth sx={{ bgcolor: 'white' }}
                          value={item.title} onChange={(e) => {
                            const newItems = [...scheduleItems];
                            newItems[index].title = e.target.value;
                            setScheduleItems(newItems);
                          }}
                        />
                        <TextField
                          label="ชื่อพิธี (TH)" placeholder="เช่น พิธีหมั้นและขบวนขันหมาก" size="small" fullWidth sx={{ bgcolor: 'white' }}
                          value={item.titleTh} onChange={(e) => {
                            const newItems = [...scheduleItems];
                            newItems[index].titleTh = e.target.value;
                            setScheduleItems(newItems);
                          }}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth variant="outlined"
                  onClick={() => setScheduleItems(prev => [...prev, { time: '', title: '', titleTh: '', description: '' }])}
                  sx={{ py: 1, borderRadius: 1.5, fontWeight: 600, borderStyle: 'dashed' }}
                >
                  + เพิ่มรายการพิธีการ
                </Button>

                <Button
                  fullWidth variant="contained" disabled={isSaving} onClick={() => handleScheduleSave()}
                  startIcon={isSaving ? null : <Save2 variant="Bold" size={20} color="currentColor" />}
                  sx={{ mt: 2, height: 48, borderRadius: 1.5, bgcolor: '#f472b6', color: 'white', fontWeight: 700, '&:hover': { bgcolor: '#db2777' }, mb: 4 }}
                >
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกตารางพิธีการ'}
                </Button>

                {/* ===== Dress Code Sub-Section inside Schedule ===== */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>👗</span> ธีมการแต่งกาย (Dress Code)
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <TextField
                    label="หัวข้อ"
                    value={dressCodeTitle}
                    onChange={(e) => setDressCodeTitle(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                  <TextField
                    label="คำอธิบาย"
                    multiline
                    rows={2}
                    value={dressCodeSubtitle}
                    onChange={(e) => setDressCodeSubtitle(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -1 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#475569">พาเลทสี (Color Palette)</Typography>
                    <Button size="small" onClick={() => setDressCodeColors([...dressCodeColors, '#ffffff'])}>+ เพิ่มสี</Button>
                  </Box>

                  <Stack spacing={1.5}>
                    {dressCodeColors.map((color, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...dressCodeColors];
                            newColors[index] = e.target.value;
                            setDressCodeColors(newColors);
                          }}
                          style={{ width: 40, height: 40, padding: 0, border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}
                        />
                        <TextField
                          value={color}
                          onChange={(e) => {
                            const newColors = [...dressCodeColors];
                            newColors[index] = e.target.value;
                            setDressCodeColors(newColors);
                          }}
                          size="small"
                          fullWidth
                          sx={{ bgcolor: 'white' }}
                        />
                        <IconButton size="small" color="error" onClick={() => setDressCodeColors(dressCodeColors.filter((_, i) => i !== index))}>
                          <Trash variant="Outline" size={18} color="currentColor" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>

                  <Button fullWidth variant="contained" disabled={isSaving} onClick={() => handleDressCodeSave()} startIcon={isSaving ? null : <Save2 variant="Bold" size={20} color="currentColor" />} sx={{ mt: 1, height: 44, borderRadius: 1.5, bgcolor: '#8e7d5d', color: 'white', fontWeight: 700, '&:hover': { bgcolor: '#7a6a4d' } }}>
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกธีมการแต่งกาย'}
                  </Button>
                </Box>
              </Box>
            )}
            {/* ===== Location Section Form ===== */}
            {editingItem.id === 'location' && (
              <Box component="form" action={handleLocationSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>รายละเอียดสถานที่จัดงาน (Venue Details)</Typography>
                <TextField
                  name="venueName"
                  label="ชื่อสถานที่จัดงาน"
                  defaultValue={client?.locationSection?.venueName || 'Cape Dara Resort Pattaya'}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />
                <TextField
                  name="venueAddress"
                  label="ที่อยู่สถานที่จัดงาน"
                  multiline
                  rows={3}
                  defaultValue={client?.locationSection?.venueAddress || '256 Dara Beach, Soi 20, Pattaya-Naklua Road, Pattaya City, Bang Lamung District, Chonburi 20150'}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />

                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>แผนที่ (Google Maps Integration)</Typography>

                <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#f1f5f9' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    วิธีการนำลิ้งค์ Embed: เปิด Google Maps → Share → Embed a map → คัดลอกค่าใน src ของ iframe
                  </Typography>
                  <TextField
                    name="googleMapEmbed"
                    label="Google Maps Embed URL (src)"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    defaultValue={client?.locationSection?.googleMapEmbed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.2435422830887!2d100.8809428!3d12.95627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102beab977fc641%3A0x67ee1c742cf6b5e0!2sCape%20Dara%20Resort%20Pattaya!5e0!3m2!1sen!2sth!4v1711000000000!5m2!1sen!2sth'}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white', mb: 2 }}
                  />
                  <TextField
                    name="googleMapExternal"
                    label="ลิ้งค์เปิดในแอปแผนที่ (External Link)"
                    placeholder="https://www.google.com/maps/search/..."
                    defaultValue={client?.locationSection?.googleMapExternal || 'https://www.google.com/maps/search/?api=1&query=Cape+Dara+Resort+Pattaya'}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>

                <Button fullWidth variant="contained" type="submit" disabled={isSaving} startIcon={isSaving ? null : <Save2 variant="Bold" size={20} color="currentColor" />} sx={{ mt: 2, height: 48, borderRadius: 1.5, bgcolor: '#f472b6', color: 'white', fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกสถานที่จัดงาน'}
                </Button>
              </Box>
            )}

            {/* ===== Color Theme ===== */}
            {editingItem.id === 'colorTheme' && (
              <Box component="form" action={handleThemeSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                  <Typography variant="body2" fontWeight={600} mb={1}>สีหลัก (Primary Color)</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <input type="color" name="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                    <TextField value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }} />
                  </Box>
                </Box>

                <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                  <Typography variant="body2" fontWeight={600} mb={1}>สีรอง (Secondary Color)</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <input type="color" name="secondaryColor" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                    <TextField value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }} />
                  </Box>
                </Box>

                <TextField name="fontFamily" label="รูปแบบฟอนต์ (Font Family)" select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                  <MenuItem value="Prompt">Prompt (Modern)</MenuItem>
                  <MenuItem value="Sarabun">Sarabun (Formal)</MenuItem>
                  <MenuItem value="Kanit">Kanit (Clean)</MenuItem>
                  <MenuItem value="Mitr">Mitr (Friendly)</MenuItem>
                  <MenuItem value="Niramit">Niramit (Elegant)</MenuItem>
                </TextField>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button type="submit" disabled={isSaving} variant="contained" fullWidth sx={{ bgcolor: '#f472b6', color: '#ffffff', borderRadius: 1, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกธีมสี'}
                  </Button>
                </Box>
              </Box>
            )}

            {/* ===== Gift & Bank Accounts ===== */}
            {editingItem.id === 'giftMoney' && (
              <Box component="form" action={handleGiftSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569">ข้อความส่วนคำอวยพร (Blessings Message)</Typography>

                <TextField
                  name="giftTitle"
                  label="หัวข้อ"
                  defaultValue={client?.giftSection?.title || 'Gifts & Blessings'}
                  size="small" fullWidth sx={{ bgcolor: 'white' }}
                />
                <TextField
                  name="giftSubtitle"
                  label="คำอธิบาย (บน)"
                  defaultValue={client?.giftSection?.subtitle || 'ของขวัญและคำอวยพร'}
                  size="small" fullWidth sx={{ bgcolor: 'white' }}
                />
                <TextField
                  name="giftMessage"
                  label="ข้อความแสดงความขอบคุณ"
                  multiline rows={4}
                  defaultValue={client?.giftSection?.message || '"The presence of our family and friends is the greatest gift of all. However, if you wish to honor our new beginning with a gift, a contribution would be sincerely appreciated."'}
                  size="small" fullWidth sx={{ bgcolor: 'white' }}
                />

                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569">ข้อมูลบัญชีธนาคาร (Bank Details)</Typography>

                <TextField
                  name="bankName"
                  label="ชื่อธนาคาร"
                  defaultValue={client?.giftSection?.bankName || 'KASIKORNBANK (KBank)'}
                  size="small" fullWidth sx={{ bgcolor: 'white' }}
                />
                <TextField
                  name="accountNumber"
                  label="เลขบัญชี"
                  defaultValue={client?.giftSection?.accountNumber || 'xxx-x-x-5678-x'}
                  size="small" fullWidth sx={{ bgcolor: 'white' }}
                />
                <TextField
                  name="accountName"
                  label="ชื่อบัญชี"
                  defaultValue={client?.giftSection?.accountName || 'Kamonluk'}
                  size="small" fullWidth sx={{ bgcolor: 'white' }}
                />

                <Box>
                  <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>รูปภาพ QR Code</Typography>

                  {!previewGiftQrCode ? (
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{
                        height: 120,
                        borderRadius: 2,
                        borderStyle: 'dashed',
                        borderColor: '#e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        textTransform: 'none',
                        color: 'text.secondary'
                      }}
                    >
                      <Typography variant="body2">คลิกเพื่อเลือกไฟล์ QR Code</Typography>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'giftQrCode')}
                      />
                    </Button>
                  ) : (
                    <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto' }}>
                      <Box
                        sx={{
                          width: 140,
                          height: 140,
                          border: '2px solid #f1f5f9',
                          borderRadius: 2,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'white'
                        }}
                      >
                        <img
                          src={previewGiftQrCode}
                          alt="QR Code Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <IconButton
                        onClick={() => handleFileRemove('giftQrCode')}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: '#ef4444',
                          color: 'white',
                          size: 'small',
                          padding: 0.5,
                          '&:hover': { bgcolor: '#dc2626' }
                        }}
                      >
                        <Trash size={16} variant="Bold" color="white" />
                      </IconButton>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                    รองรับไฟล์รูปภาพ PNG, JPG (ขนาดแนะนำ 500x500px)
                  </Typography>
                </Box>

                <Button fullWidth variant="contained" type="submit" disabled={isSaving} startIcon={isSaving ? null : <Save2 variant="Bold" size={20} color="currentColor" />} sx={{ mt: 2, height: 48, borderRadius: 1.5, bgcolor: '#f472b6', color: 'white', fontWeight: 700, '&:hover': { bgcolor: '#db2777' } }}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลของขวัญ'}
                </Button>
              </Box>
            )}


          </Box>
        )}
      </Drawer>

    </Box>
  );
}
