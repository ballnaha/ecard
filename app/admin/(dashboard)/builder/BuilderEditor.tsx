'use client';
import React, { useState } from 'react';
import { Box, Card, Typography, Button, IconButton, Drawer, TextField, Divider, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress, Switch, Stack, alpha, Checkbox, List, ListItem, ListItemText, ListItemIcon, Paper, Tooltip } from '@mui/material';
import { Reorder } from 'framer-motion';
import { Menu, Eye, Save2, ColorSwatch, CloseSquare, Trash, EyeSlash, Layer, Home, Calendar, Gallery, Location, PresentionChart, Heart, People, Gift, MessageText1, Link1, Music, CloseCircle } from 'iconsax-react';
import { useSnackbar } from '../../components/SnackbarProvider';
import { updateClientLayout, updateClientHero, updateClientTheme, updateClientCouple, updateClientGallery, updateClientCountdown, updateClientSchedule, updateClientDressCode, updateClientLocation, updateClientGift, updateClientMobileNav } from '../clients/actions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const initialLayoutBase = [
  { id: 'hero', title: 'หน้าปก (Hero Section)', icon: '🎞️', isActive: true },
  { id: 'couple', title: 'ข้อมูลบ่าวสาว (Couple Section)', icon: '👫', isActive: true },
  { id: 'schedule', title: 'ตารางพิธีการ (Schedule)', icon: '📅', isActive: true },
  { id: 'dressCode', title: 'การแต่งกาย (Dress Code)', icon: '👕', isActive: true },
  { id: 'countdown', title: 'นับถอยหลัง (Countdown)', icon: '⏰', isActive: true },
  { id: 'gallery', title: 'แกลเลอรี่ (Gallery)', icon: '📸', isActive: true },
  { id: 'rsvp', title: 'ตอบรับบัตรเชิญ (RSVP)', icon: '✉️', isActive: true },
  { id: 'gift', title: 'ซองของขวัญ (Gift)', icon: '🎁', isActive: true },
  { id: 'guestbook', title: 'สมุดอวยพร (Guestbook)', icon: '📖', isActive: false },
  { id: 'location', title: 'สถานที่จัดงาน (Venue)', icon: '📍', isActive: true },
  { id: 'poweredBy', title: 'เครดิตผู้พัฒนา (Powered By)', icon: '🛡️', isActive: true },
  { id: 'mobileNav', title: 'เมนูนำทางมือถือ (Mobile Nav)', icon: '📱', isActive: true },
];

const sectionIconMap: Record<string, any> = {
  hero: <Home />,
  couple: <Heart />,
  schedule: <Calendar />,
  dressCode: <ColorSwatch />,
  countdown: <PresentionChart />,
  gallery: <Gallery />,
  location: <Location />,
  rsvp: <People />,
  gift: <Gift />,
  guestbook: <MessageText1 />,
};

export default function BuilderEditor({ client }: { client: any }) {
  const [items, setItems] = useState(() => {
    // If client has a saved layout order
    if (client?.layoutOrder && Array.isArray(client.layoutOrder) && client.layoutOrder.length > 0) {
      const savedLayout = client.layoutOrder as any[];

      // Step 1: Create a map of saved items for quick access to their isActive status and saved index
      const savedMap = new Map();
      savedLayout.forEach((item, index) => {
        const id = typeof item === 'string' ? item : item.id;
        const isActive = typeof item === 'string' ? true : (item.isActive ?? true);
        savedMap.set(id, { isActive, index });
      });

      // Step 2: Hydrate items based on saved order (to preserve user customization)
      const hydratedItems = savedLayout.map((item: any) => {
        const id = typeof item === 'string' ? item : item.id;
        const base = initialLayoutBase.find(l => l.id === id);
        if (!base) return null;

        const savedData = savedMap.get(id);
        return { ...base, isActive: savedData.isActive };
      }).filter(Boolean) as typeof initialLayoutBase;

      // Step 3: Find any items that exist in initialLayoutBase but are missing in the saved layout
      const missingItems = initialLayoutBase.filter(l => !savedMap.has(l.id));

      // Return the combined list: Saved items first (in their saved order), then missing items (in their default order)
      return [...hydratedItems, ...missingItems];
    }

    // Default: Strictly follow initialLayoutBase if no layoutOrder exists
    return [...initialLayoutBase];
  });

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'color'>(() => client?.heroSection?.mediaType || 'image');
  const [previewImage, setPreviewImage] = useState<string | null>(client?.heroSection?.heroImage || null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(client?.heroSection?.heroVideo || null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(client?.heroSection?.heroPoster || null);
  const [previewNameImage, setPreviewNameImage] = useState<string | null>(client?.heroSection?.heroNameImage || null);
  const [heroStyle, setHeroStyle] = useState<'classic' | 'editorial' | 'minimal'>(() => client?.heroSection?.heroStyle || 'classic');
  const [heroBackgroundColor, setHeroBackgroundColor] = useState<string>(() => client?.heroSection?.heroBackgroundColor || '#ffffff');

  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>({ heroImage: null, heroVideo: null, heroPoster: null, heroNameImage: null, bridePic: null, groomPic: null, music: null });
  const [savedPaths, setSavedPaths] = useState<Record<string, string>>({
    heroImage: client?.heroSection?.heroImage || '',
    heroVideo: client?.heroSection?.heroVideo || '',
    heroPoster: client?.heroSection?.heroPoster || '',
    heroNameImage: client?.heroSection?.heroNameImage || '',
    bridePic: client?.coupleSection?.bridePic || '',
    groomPic: client?.coupleSection?.groomPic || '',
    giftQrCode: client?.giftSection?.qrCode || '',
    music: client?.musicUrl || '',
  });

  const [musicUrl, setMusicUrl] = useState<string | null>(client?.musicUrl || null);

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

  // Footer Nav Setup
  const [mobileNavItems, setMobileNavItems] = useState<{ id: string, label: string, isActive: boolean }[]>(() => {
    const saved = (client?.mobileNavSection?.items || []) as any[];

    // Create a comprehensive list from initialLayoutBase to ensure new sections exist in the menu config
    const merged = [...saved];
    initialLayoutBase.forEach(base => {
      if (!merged.find(m => m.id === base.id)) {
        merged.push({
          id: base.id,
          label: base.title.split(' ')[0],
          isActive: false
        });
      }
    });

    return merged;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [eventDate, setEventDate] = useState<Dayjs | null>(client?.eventDate ? dayjs(client.eventDate) : dayjs('2026-05-14'));
  const { showSnackbar } = useSnackbar();

  const handleToggleActive = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const handleSave = async () => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    const layoutData = items.map(i => ({ id: i.id, isActive: i.isActive }));
    const res = await updateClientLayout(client.id, layoutData, client.slug);
    setIsSaving(false);
    if (res?.error) showSnackbar(res.error, 'error');
    else showSnackbar('บันทึกการจัดเรียงและสถานะการแสดงผลสำเร็จ!', 'success');
  };

  const handleResetOrder = () => {
    // Keep the current isActive status but reset the order to match initialLayoutBase
    const resetItems = initialLayoutBase.map(base => {
      const current = items.find(i => i.id === base.id);
      return current ? { ...base, isActive: current.isActive } : base;
    });
    setItems(resetItems);
    showSnackbar('คืนค่าลำดับแสดงผลเป็นค่าเริ่มต้นแล้ว (อย่าลืมกดบันทักเพื่อยืนยัน)', 'info');
  };

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'heroImage' | 'heroVideo' | 'heroPoster' | 'heroNameImage' | 'bridePic' | 'groomPic' | 'giftQrCode' | 'music') => {
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
    if (fileType === 'music') setMusicUrl(url);
  };

  const handleFileRemove = async (fileType: 'heroImage' | 'heroVideo' | 'heroPoster' | 'heroNameImage' | 'bridePic' | 'groomPic' | 'giftQrCode' | 'music') => {
    setPendingFiles(prev => ({ ...prev, [fileType]: null }));
    if (fileType === 'heroImage') setPreviewImage(null);
    if (fileType === 'heroVideo') setPreviewVideo(null);
    if (fileType === 'heroPoster') setPreviewPoster(null);
    if (fileType === 'heroNameImage') setPreviewNameImage(null);
    if (fileType === 'bridePic') setPreviewBridePic(null);
    if (fileType === 'groomPic') setPreviewGroomPic(null);
    if (fileType === 'giftQrCode') setPreviewGiftQrCode(null);
    if (fileType === 'music') setMusicUrl(null);
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

  const handleHeroSave = async (formData: FormData) => {
    if (!client) { showSnackbar('โหมด Demo ไม่สามารถบันทึกได้', 'error'); return; }
    setIsSaving(true);
    try {
      const finalPaths = { ...savedPaths };
      for (const [key, file] of Object.entries(pendingFiles)) {
        if (file) finalPaths[key] = await uploadOneFile(file, key);
      }
      formData.append('mediaType', mediaType);
      formData.append('heroStyle', heroStyle);
      formData.append('heroBackgroundColor', heroBackgroundColor);
      if (finalPaths.heroImage) formData.append('heroImage', finalPaths.heroImage);
      if (finalPaths.heroVideo) formData.append('heroVideo', finalPaths.heroVideo);
      if (finalPaths.heroPoster) formData.append('heroPoster', finalPaths.heroPoster);
      if (finalPaths.heroNameImage) formData.append('heroNameImage', finalPaths.heroNameImage);
      formData.append('showFallingPetals', String(showPetals));
      const res = await updateClientHero(client.id, formData);
      if (res?.error) showSnackbar(res.error, 'error');
      else {
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
      const finalPaths = { ...savedPaths };
      if (pendingFiles.music) finalPaths.music = await uploadOneFile(pendingFiles.music, 'music');
      formData.set('musicUrl', finalPaths.music || '');

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
      e.target.value = '';
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

  const handleGiftSave = async (formData: FormData) => {
    if (!client) { showSnackbar('ไม่พบข้อมูลลูกค้า', 'error'); return; }
    setIsSaving(true);
    try {
      let finalQrCode = savedPaths.giftQrCode;
      if (pendingFiles.giftQrCode) finalQrCode = await uploadOneFile(pendingFiles.giftQrCode, 'giftQrCode');
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

  const handleMobileNavSave = async () => {
    if (!client) return;
    setIsSaving(true);
    const res = await updateClientMobileNav(client.id, mobileNavItems, client.slug);
    setIsSaving(false);
    if (res.success) {
      showSnackbar('บันทึกเมนูนำทางเรียบร้อย!', 'success');
      setEditingItem(null);
    } else {
      showSnackbar(res.error || 'ล้มเหลว', 'error');
    }
  };

  const activeBuilderSections = items.filter(i => i.isActive && i.id !== 'mobileNav' && i.id !== 'poweredBy');

  return (
    <Box sx={{ maxWidth: 'auto', mx: 'auto', px: { xs: 0, sm: 2 } }}>
      <Box>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          mb: 3,
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          <Typography variant="h6" fontWeight="800" color="#0f172a" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            ลำดับการแสดงผล (Layout Sections)
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetOrder}
              sx={{
                borderRadius: '50px',
                color: '#94a3b8',
                borderColor: '#e2e8f0',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
              }}
            >
              รีเซ็ตลำดับ
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ColorSwatch variant="Bold" size={20} color="#f2a1a1" />}
              onClick={() => setEditingItem({ id: 'theme', title: 'ธีมและเพลงประกอบ' })}
              sx={{ color: '#f2a1a1', borderColor: '#f2a1a1', borderRadius: '50px', fontWeight: 800, px: 3, textTransform: 'none', '&:hover': { bgcolor: '#fff5f5', borderColor: '#e89191' } }}
            >
              ธีม & เพลง
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={isSaving}
              startIcon={<Save2 variant="Bold" size={20} color="currentColor" />}
              onClick={handleSave}
              sx={{ bgcolor: alpha('#f2a1a1', 1), color: '#ffffff', borderRadius: '50px', fontWeight: 800, px: 3, textTransform: 'none', '&:hover': { bgcolor: '#e89191', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease', boxShadow: '0 8px 25px rgba(242, 161, 161, 0.3)' }}
            >
              บันทึกหน้า
            </Button>
          </Stack>
        </Box>

        <Reorder.Group axis="y" values={items} onReorder={setItems} as="div">
          {items.map(item => (
            <Reorder.Item value={item} key={item.id} as="div" style={{ listStyle: 'none' }}>
              <Card variant="outlined" sx={{
                mb: 1.5, borderRadius: 1, p: 0, cursor: 'grab', border: '1px solid #e2e8f0',
                opacity: item.isActive ? 1 : 0.4,
                backgroundColor: item.isActive ? '#ffffff' : '#f8fafc',
                transition: 'all 0.3s ease',
                '&:hover': { borderColor: item.isActive ? '#f2a1a1' : '#cbd5e1', boxShadow: item.isActive ? '0 2px 8px rgba(242,161,161,0.15)' : 'none' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', cursor: 'grab' }}>
                    <Menu variant="Outline" size={20} color="currentColor" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <Typography fontSize="1.2rem">{item.icon}</Typography>
                    <Typography variant="body2" fontWeight="700" color={item.isActive ? "#0f172a" : "#94a3b8"}>
                      {item.title} {!item.isActive && '(ซ่อนไว้)'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={item.isActive ? "ซ่อนส่วนนี้" : "แสดงส่วนนี้"} arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(item.id)}
                        sx={{ color: item.isActive ? '#22c55e' : '#94a3b8', '&:hover': { bgcolor: item.isActive ? alpha('#22c55e', 0.1) : '#f1f5f9' } }}
                      >
                        {item.isActive ? <Eye variant="Bold" size={18} color="#22c55e" /> : <EyeSlash variant="Bold" size={18} color="#94a3b8" />}
                      </IconButton>
                    </Tooltip>

                    {item.isActive && (
                      <Tooltip title="ตั้งค่าส่วนนี้" arrow>
                        <IconButton
                          size="small"
                          onClick={() => setEditingItem(item)}
                          sx={{ color: '#f2a1a1', '&:hover': { bgcolor: alpha('#f2a1a1', 0.1) } }}
                        >
                          <ColorSwatch variant="Bold" size={18} color="#f2a1a1" />
                        </IconButton>
                      </Tooltip>
                    )}
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
            width: { xs: '100%', sm: 500, md: 550 },
            p: { xs: 2.5, md: 4.5 },
            bgcolor: '#f8fafc',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
            borderTopLeftRadius: { xs: '24px', sm: 0 },
            borderBottomLeftRadius: { xs: '24px', sm: 0 }
          }
        }}
      >
        {editingItem && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="800" color="#0f172a">ปรับแต่ง: {editingItem.title}</Typography>
              <IconButton onClick={() => setEditingItem(null)}><CloseSquare variant="Outline" size={24} color="#64748b" /></IconButton>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {/* Mobile Nav Configuration */}
            {editingItem.id === 'mobileNav' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569">
                  เลือกเมนูที่แสดงบน Footer Bar (Sync จาก Section ที่เปิดอยู่)
                </Typography>
                <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                  <Reorder.Group axis="y" values={mobileNavItems} onReorder={setMobileNavItems} as="div">
                    <List dense sx={{ p: 0 }}>
                      {mobileNavItems.filter(nav => activeBuilderSections.find(s => s.id === nav.id)).map((nav) => {
                        const sec = activeBuilderSections.find(s => s.id === nav.id);
                        if (!sec) return null;
                        return (
                          <Reorder.Item key={nav.id} value={nav} as="div">
                            <ListItem
                              sx={{
                                py: 1.5,
                                bgcolor: 'white',
                                borderBottom: '1px solid #f1f5f9',
                                cursor: 'grab',
                                '&:hover': { bgcolor: '#f8fafc' }
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 36, color: '#94a3b8' }}>
                                <Menu variant="Outline" size={18} color="currentColor" />
                              </ListItemIcon>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {sectionIconMap[sec.id] || <Layer size={18} variant="Outline" />}
                              </ListItemIcon>
                              <ListItemText
                                primary={<Typography variant="body2" fontWeight={700}>{sec.title}</Typography>}
                              />
                              <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                  size="small"
                                  placeholder="Label"
                                  value={nav.label || ''}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    setMobileNavItems(prev => prev.map(p => p.id === nav.id ? { ...p, label: newVal } : p));
                                  }}
                                  sx={{ width: 100, '& .MuiInputBase-input': { p: '6px 10px', fontSize: '0.8rem' } }}
                                />
                                <Checkbox
                                  checked={nav.isActive}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setMobileNavItems(prev => prev.map(p => p.id === nav.id ? { ...p, isActive: checked } : p));
                                  }}
                                  sx={{ color: '#f2a1a1', '&.Mui-checked': { color: '#f2a1a1' } }}
                                />
                              </Stack>
                            </ListItem>
                          </Reorder.Item>
                        );
                      })}
                    </List>
                  </Reorder.Group>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  * รายการเมนูจะแสดงเมื่อคุณเลือก "เปิด (Check)" และ Section นั้นๆ เปิดใช้งานอยู่ในหน้าเลย์เอาต์หลักครับ
                </Typography>
                <Button onClick={handleMobileNavSave} fullWidth variant="contained" sx={{ bgcolor: '#f2a1a1', py: 1.5, fontWeight: 700 }}>
                  บันทึกเมนู Footer Bar
                </Button>
              </Box>
            )}

            {editingItem.id === 'hero' && (
              <Box component="form" action={handleHeroSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>ข้อมูลคู่บ่าวสาว</Typography>
                <TextField name="groomName" label="ชื่อเจ้าบ่าว" defaultValue={client?.groomName || "Pu"} size="small" fullWidth sx={{ bgcolor: 'white' }} />
                <TextField name="brideName" label="ชื่อเจ้าสาว" defaultValue={client?.brideName || "Pim"} size="small" fullWidth sx={{ bgcolor: 'white' }} />
                <input type="hidden" name="eventDate" value={eventDate ? eventDate.toISOString() : ''} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="วันที่จัดงาน" value={eventDate} onChange={(val) => setEventDate(val)} format="DD/MM/YYYY" slotProps={{ textField: { size: 'small', fullWidth: true, sx: { bgcolor: 'white' } } }} />
                </LocalizationProvider>
                <TextField name="locationText" label="สถานที่จัดงาน" defaultValue={client?.heroSection?.locationText || "PATTAYA • CHONBURI"} size="small" fullWidth sx={{ bgcolor: 'white' }} />
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569" sx={{ mb: -1 }}>สไตล์การจัดวาง (Hero Style)</Typography>
                <TextField select value={heroStyle} onChange={(e) => setHeroStyle(e.target.value as any)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                  <MenuItem value="classic">Classic Center (ดั้งเดิม - กลาง)</MenuItem>
                  <MenuItem value="editorial">Editorial Left (นิตยสาร - ชิดซ้าย)</MenuItem>
                  <MenuItem value="minimal">Minimal Vertical (มินิมอล - แนวตั้ง)</MenuItem>
                </TextField>
                <FormControlLabel control={<Switch checked={showPetals} onChange={(e) => setShowPetals(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' } }} />} label={<Typography variant="body2" fontWeight={600}>แสดงกลีบดอกไม้ร่วง ✨</Typography>} />
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569">รูปภาพชื่อบ่าวสาว (Calligraphy/Logo)</Typography>
                {previewNameImage && (
                  <Box sx={{ position: 'relative' }}>
                    <Box component="img" src={previewNameImage} sx={{ width: '100%', height: 120, objectFit: 'contain', borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }} />
                    <Tooltip title="ลบรูปภาพชื่อ" arrow>
                      <IconButton onClick={() => handleFileRemove('heroNameImage')} size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                        <Trash size={14} variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                <Button variant="outlined" component="label" fullWidth sx={{ borderRadius: 1, borderStyle: 'dashed' }}>
                  {previewNameImage ? 'เปลี่ยนรูปภาพชื่อ' : '+ เลือกรูปชื่อบ่าวสาว'}
                  <input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'heroNameImage')} />
                </Button>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#475569">สื่อหน้าปก</Typography>
                <RadioGroup row value={mediaType} onChange={(e) => setMediaType(e.target.value as any)}><FormControlLabel value="image" control={<Radio size="small" />} label="รูปภาพ" /><FormControlLabel value="video" control={<Radio size="small" />} label="วิดีโอ" /><FormControlLabel value="color" control={<Radio size="small" />} label="สีพื้น" /></RadioGroup>
                {mediaType === 'image' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {previewImage && <Box sx={{ position: 'relative' }}><Box component="img" src={previewImage} sx={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 1 }} /><Tooltip title="ลบรูปภาพหน้าปก" arrow><IconButton onClick={() => handleFileRemove('heroImage')} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}><Trash size={16} variant="Bold" /></IconButton></Tooltip></Box>}
                    <Button variant="outlined" component="label" fullWidth sx={{ borderStyle: 'dashed' }}>+ เลือกรูปภาพหน้าปก<input hidden accept="image/*" type="file" onChange={(e) => handleFileSelect(e, 'heroImage')} /></Button>
                  </Box>
                ) : mediaType === 'video' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {previewVideo && <Box sx={{ position: 'relative' }}><Box component="video" src={previewVideo} controls sx={{ width: '100%', height: 220, objectFit: 'cover' }} /><Tooltip title="ลบวิดีโอ" arrow><IconButton onClick={() => handleFileRemove('heroVideo')} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}><Trash size={16} variant="Bold" color="#fff" /></IconButton></Tooltip></Box>}
                    <Button variant="outlined" component="label" fullWidth sx={{ borderStyle: 'dashed' }}>+ เลือกวิดีโอ (MP4)<input hidden accept="video/mp4" type="file" onChange={(e) => handleFileSelect(e, 'heroVideo')} /></Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}><input type="color" value={heroBackgroundColor} onChange={(e) => setHeroBackgroundColor(e.target.value)} style={{ width: 60, height: 40 }} /><TextField value={heroBackgroundColor} onChange={(e) => setHeroBackgroundColor(e.target.value)} size="small" fullWidth /></Box>
                )}
                <Button type="submit" disabled={isSaving} variant="contained" fullWidth sx={{ bgcolor: '#f2a1a1', py: 1.5, fontWeight: 700 }}>{isSaving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}</Button>
              </Box>
            )}

            {editingItem.id === 'couple' && (
              <Box component="form" action={handleCoupleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}><TextField name="brideName" label="ชื่อเจ้าสาว" defaultValue={client?.coupleSection?.brideName || client?.brideName} size="small" /><TextField name="groomName" label="ชื่อเจ้าบ่าว" defaultValue={client?.coupleSection?.groomName || client?.groomName} size="small" /></Box>
                <TextField name="introText" label="คำขวัญ / บทนำ" multiline rows={3} defaultValue={client?.coupleSection?.introText || "Two paths that led to one beautiful journey..."} size="small" />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}><TextField name="brideFather" label="คุณพ่อ (เจ้าสาว)" defaultValue={client?.coupleSection?.brideFather || ''} size="small" /><TextField name="brideMother" label="คุณแม่ (เจ้าสาว)" defaultValue={client?.coupleSection?.brideMother || ''} size="small" /></Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}><TextField name="groomFather" label="คุณพ่อ (เจ้าบ่าว)" defaultValue={client?.coupleSection?.groomFather || ''} size="small" /><TextField name="groomMother" label="คุณแม่ (เจ้าบ่าว)" defaultValue={client?.coupleSection?.groomMother || ''} size="small" /></Box>
                <TextField select value={coupleStyle} onChange={(e) => setCoupleStyle(e.target.value)} size="small" fullWidth><MenuItem value="arch-duo">Arch Duo</MenuItem><MenuItem value="rounded-portrait">Rounded Portrait</MenuItem></TextField>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Box sx={{ position: 'relative', pt: '140%', bgcolor: '#f1f5f9' }}>{previewBridePic && <img src={previewBridePic} style={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}</Box>
                    <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>รูปเจ้าสาว<input hidden type="file" onChange={(e) => handleFileSelect(e, 'bridePic')} /></Button>
                  </Box>
                  <Box>
                    <Box sx={{ position: 'relative', pt: '140%', bgcolor: '#f1f5f9' }}>{previewGroomPic && <img src={previewGroomPic} style={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}</Box>
                    <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>รูปเจ้าบ่าว<input hidden type="file" onChange={(e) => handleFileSelect(e, 'groomPic')} /></Button>
                  </Box>
                </Box>
                <Button type="submit" disabled={isSaving} variant="contained" fullWidth sx={{ bgcolor: '#f2a1a1' }}>บันทึกบ่าวสาว</Button>
              </Box>
            )}

            {editingItem.id === 'gallery' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField select value={galleryLayout} onChange={(e) => setGalleryLayout(e.target.value as any)} size="small" fullWidth><MenuItem value="coverflow">Coverflow</MenuItem><MenuItem value="cards">Stacked Cards</MenuItem><MenuItem value="slide">Slide</MenuItem></TextField>
                <Button component="label" fullWidth variant="outlined" sx={{ borderStyle: 'dashed' }}>+ เพิ่มรูปภาพ<input type="file" hidden multiple onChange={handleGalleryUpload} /></Button>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5, maxHeight: 400, overflowY: 'auto', p: 1 }}>
                  {galleryItems.map((img, idx) => (
                    <Box key={idx} sx={{ position: 'relative', pt: '100%', mb: 1 }}>
                      <Box
                        component="img"
                        src={img}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <Tooltip title="ลบรูปนี้" arrow>
                        <IconButton
                          onClick={() => setGalleryItems(prev => prev.filter(i => i !== img))}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            width: 28,
                            height: 28,
                            p: 0,
                            bgcolor: '#ef4444',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            zIndex: 20,
                            '&:hover': { bgcolor: '#b91c1c', color: '#fff' },
                          }}
                        >
                          <Trash variant="Bold" size={16} color="#fff" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
                <Button onClick={handleGallerySave} variant="contained" fullWidth sx={{ bgcolor: '#f2a1a1' }}>บันทึกแกลเลอรี</Button>
              </Box>
            )}

            {editingItem.id === 'countdown' && (
              <Box component="form" action={handleCountdownSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField name="title" label="หัวข้อหลัก" defaultValue={client?.countdownSection?.title || 'Countdown'} size="small" />
                <TextField name="subtitle" label="หัวข้อรอง" defaultValue={client?.countdownSection?.subtitle || 'See You Soon'} size="small" />
                <Button fullWidth variant="contained" type="submit" sx={{ bgcolor: '#f2a1a1' }}>บันทึก</Button>
              </Box>
            )}

            {editingItem.id === 'schedule' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {scheduleItems.map((item, idx) => (
                  <Box key={idx} sx={{ p: 2, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Stack spacing={2}>
                      <TextField label="เวลา" value={item.time} onChange={(e) => { const n = [...scheduleItems]; n[idx].time = e.target.value; setScheduleItems(n); }} size="small" />
                      <Box>
                        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>เลือกไอคอนพิธีการ (1-9)</Typography>
                        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((icon) => (
                            <Box
                              key={icon}
                              onClick={() => { const n = [...scheduleItems]; n[idx].icon = icon; setScheduleItems(n); }}
                              sx={{
                                width: 40,
                                height: 40,
                                p: 0.5,
                                borderRadius: 1,
                                border: '2px solid',
                                borderColor: item.icon === icon ? '#f2a1a1' : 'transparent',
                                bgcolor: 'white',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#f1f5f9' }
                              }}
                            >
                              <img src={`/images/icon/${icon}.png`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                      <TextField label="EN" value={item.title} onChange={(e) => { const n = [...scheduleItems]; n[idx].title = e.target.value; setScheduleItems(n); }} size="small" />
                      <TextField label="TH" value={item.titleTh} onChange={(e) => { const n = [...scheduleItems]; n[idx].titleTh = e.target.value; setScheduleItems(n); }} size="small" />
                      <Button size="small" color="error" onClick={() => setScheduleItems(prev => prev.filter((_, i) => i !== idx))}>ลบ</Button>
                    </Stack>
                  </Box>
                ))}
                <Button variant="outlined" sx={{ borderStyle: 'dashed' }} onClick={() => setScheduleItems([...scheduleItems, { time: '', title: '', titleTh: '', icon: 'ceremonial' }])}>+ เพิ่มขบวนพิธี</Button>
                <Button onClick={handleScheduleSave} variant="contained" sx={{ bgcolor: '#f2a1a1' }}>บันทึก</Button>
              </Box>
            )}

            {editingItem.id === 'location' && (
              <Box component="form" action={handleLocationSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField name="venueName" label="ชื่อสถานที่" defaultValue={venueName} onChange={e => setVenueName(e.target.value)} size="small" fullWidth />
                <TextField name="venueAddress" label="ที่อยู่" multiline rows={2} defaultValue={venueAddress} onChange={e => setVenueAddress(e.target.value)} size="small" fullWidth />
                <TextField name="googleMapExternal" label="ลิงก์ Google Maps (ภายนอก)" defaultValue={googleMapExternal} onChange={e => setGoogleMapExternal(e.target.value)} size="small" fullWidth />
                <TextField name="googleMapEmbed" label="ลิงก์ Embed Map (iframe src)" defaultValue={googleMapEmbed} onChange={e => setGoogleMapEmbed(e.target.value)} size="small" fullWidth />
                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#f2a1a1' }}>บันทึกสถานที่</Button>
              </Box>
            )}

            {editingItem.id === 'gift' && (
              <Box component="form" action={handleGiftSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField name="giftTitle" label="หัวข้อ (Title)" defaultValue={client?.giftSection?.title || 'Gifts & Blessings'} size="small" fullWidth />
                <TextField name="giftSubtitle" label="หัวข้อรอง (Subtitle)" defaultValue={client?.giftSection?.subtitle || 'ของขวัญและคำอวยพร'} size="small" fullWidth />
                <TextField name="giftMessage" label="ข้อความแสดงความขอบคุณ" multiline rows={3} defaultValue={client?.giftSection?.message || ''} size="small" fullWidth />
                <Divider sx={{ my: 1 }} />
                <TextField name="bankName" label="ธนาคาร" defaultValue={client?.giftSection?.bankName || ''} size="small" fullWidth />
                <TextField name="accountName" label="ชื่อบัญชี" defaultValue={client?.giftSection?.accountName || ''} size="small" fullWidth />
                <TextField name="accountNumber" label="เลขบัญชี" defaultValue={client?.giftSection?.accountNumber || ''} size="small" fullWidth />
                <Box>
                  <Typography variant="caption" fontWeight={700}>รูป QR Code</Typography>
                  {previewGiftQrCode && <Box sx={{ position: 'relative', my: 1 }}><img src={previewGiftQrCode} style={{ width: '100%', height: 200, objectFit: 'contain', border: '1px solid #ddd' }} /><Tooltip title="ลบ QR Code" arrow><IconButton onClick={() => handleFileRemove('giftQrCode')} sx={{ position: 'absolute', top: 4, right: 4 }}><Trash size={16} variant="Bold" /></IconButton></Tooltip></Box>}
                  <Button variant="outlined" component="label" fullWidth sx={{ borderStyle: 'dashed' }}>เลือกไฟล์ QR Code<input hidden type="file" accept="image/*" onChange={e => handleFileSelect(e, 'giftQrCode')} /></Button>
                </Box>
                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#f2a1a1' }}>บันทึกข้อมูลของขวัญ</Button>
              </Box>
            )}

            {editingItem.id === 'rsvp' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#475569">ลิงก์ดูข้อมูล RSVP สำหรับคู่บ่าวสาว</Typography>

                <Paper variant="outlined" sx={{ p: 3, borderRadius: '24px', bgcolor: '#fff', border: '1px solid #f1f5f9' }}>
                  <Stack spacing={2.5}>
                    <Box sx={{ p: 2, bgcolor: '#fff9f0', borderRadius: '16px', border: '1px solid #ffecb3', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Link1 size="24" color="#f59e0b" variant="Bulk" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <Box>
                        <Typography variant="body2" fontWeight={800} color="#92400e" sx={{ mb: 0.5 }}>RSVP Dashboard Link</Typography>
                        <Typography variant="caption" sx={{ color: '#b45309', display: 'block', mb: 1, wordBreak: 'break-all' }}>
                          {window.location.origin}/dashboard/{client?.slug}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Link1 size="16" variant="Bold" color="#fff" />}
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/dashboard/${client?.slug}`);
                            showSnackbar('คัดลอกลิงก์ Dashboard เรียบร้อย!', 'success');
                          }}
                          sx={{ bgcolor: '#f59e0b', borderRadius: '50px', fontWeight: 700, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#d97706' } }}
                        >
                          Copy Link
                        </Button>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <Typography variant="body2" fontWeight={800} color="#475569" sx={{ mb: 1 }}>🔑 ข้อมูลการเข้าสู่ระบบสำหรับลูกค้า:</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>• <b>Passcode:</b> เลขวันที่แต่งงาน (ววดดปปปป)</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>• <b>ของลูกค้า:</b> {client?.eventDate ? dayjs(client.eventDate).format('DDMMYYYY') : '14052026'}</Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', px: 2 }}>
                  * คุณสามารถส่งลิงก์และรหัสผ่านนี้ให้ลูกค้า เพื่อความสะดวกในการจัดการรายชื่อแขกและ Export ไฟล์ Excel ครับ
                </Typography>
              </Box>
            )}

            {editingItem.id === 'dressCode' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Box sx={{ p: 2.5, bgcolor: '#fdf4f4', borderRadius: '24px', border: '1px solid #fce7e7' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#991b1b" sx={{ mb: 1 }}>👗 ธีมสีการแต่งกาย (Dress Code)</Typography>
                  <Typography variant="caption" sx={{ color: '#b91c1c', display: 'block', mb: 2 }}>
                    กำหนดโทนสีเพื่อให้แขกในงานเตรียมตัวมาร่วมงานได้อย่างสวยงาม และคุมโทนภาพในงานครับ
                  </Typography>

                  <Stack spacing={2.5}>
                    <TextField
                      label="หัวข้อหลัก"
                      value={dressCodeTitle}
                      onChange={(e) => setDressCodeTitle(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ bgcolor: 'white' }}
                    />
                    <TextField
                      label="ข้อความเชิญชวน"
                      value={dressCodeSubtitle}
                      onChange={(e) => setDressCodeSubtitle(e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                      fullWidth
                      sx={{ bgcolor: 'white' }}
                    />
                  </Stack>
                </Box>

                <Box sx={{ px: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#334155" sx={{ mb: 2 }}>พาเลทสี (Color Palette)</Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    {dressCodeColors.map((color, idx) => (
                      <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            sx={{
                              width: 55,
                              height: 55,
                              borderRadius: '15px',
                              bgcolor: color,
                              border: '3px solid #fff',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              display: 'block'
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => setDressCodeColors(prev => prev.filter((_, i) => i !== idx))}
                            sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#ef4444', color: '#fff', '&:hover': { bgcolor: '#dc2626' }, width: 22, height: 22, p: 0 }}
                          >
                            <Trash variant="Outline" size={14} color="#fff" />
                          </IconButton>
                        </Box>
                        <TextField
                          value={color}
                          onChange={(e) => {
                            const newColors = [...dressCodeColors];
                            newColors[idx] = e.target.value;
                            setDressCodeColors(newColors);
                          }}
                          size="small"
                          placeholder="#000000"
                          inputProps={{ sx: { fontSize: '0.65rem', textAlign: 'center', p: 0.5, width: 68, textTransform: 'uppercase', height: '24px' } }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                        />
                      </Box>
                    ))}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box
                        onClick={() => setDressCodeColors(prev => [...prev, '#A78B71'])}
                        sx={{
                          width: 55, height: 55, borderRadius: '15px', border: '2px dashed #cbd5e1',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc', transform: 'scale(1.05)' }
                        }}
                      >
                        <Typography variant="h5" color="#94a3b8">+</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem' }}>เพิ่มสี</Typography>
                    </Box>
                  </Stack>
                </Box>

                <Button
                  onClick={handleDressCodeSave}
                  variant="contained"
                  fullWidth
                  disabled={isSaving}
                  sx={{ py: 2, bgcolor: '#f2a1a1', borderRadius: '50px', fontWeight: 800 }}
                >
                  {isSaving ? <CircularProgress size={24} color="inherit" /> : 'บันทึก Dress Code'}
                </Button>
              </Box>
            )}

            {editingItem.id === 'guestbook' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ p: 2.5, bgcolor: '#f0f9ff', borderRadius: '24px', border: '1px solid #e0f2fe' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#0369a1" sx={{ mb: 1 }}>📖 สมุดอวยพรดิจิทัล (Guestbook)</Typography>
                  <Typography variant="caption" sx={{ color: '#0369a1', display: 'block', mb: 2 }}>
                    ให้แขกสามารถเขียนคำอวยพรด้วยลายมือ หรือพิมพ์ข้อความ และแนบรูปถ่ายได้โดยตรงครับ
                  </Typography>
                  <TextField
                    label="หัวข้อ (Title)"
                    defaultValue="Wishes & Blessings"
                    size="small"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                    * ส่วนนี้จะแสดงแบบฟอร์มให้แขกใช้งานได้ทันทีในหน้าเว็บครับ คุณสามารถจัดการคำอวยพรได้ที่หน้า Dashboard หลักของลูกค้ารายนี้
                  </Typography>
                </Paper>

                <Button variant="contained" fullWidth sx={{ bgcolor: '#f2a1a1', py: 1.5, fontWeight: 700 }} onClick={() => setEditingItem(null)}>
                  เสร็จสิ้น
                </Button>
              </Box>
            )}

            {editingItem.id === 'theme' && (
              <Box component="form" action={handleThemeSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Box sx={{ p: 2.5, bgcolor: '#fdf4f4', borderRadius: '24px', border: '1px solid #fce7e7', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#991b1b" sx={{ mb: 1 }}>✨ สีหลัก (Primary Color)</Typography>
                  <Typography variant="caption" sx={{ color: '#b91c1c', display: 'block', mb: 2, lineHeight: 1.5 }}>
                    สีนี้จะถูกนำไปใช้ในปุ่มต่างๆ, เมนูนำทางด้านล่าง, เส้นคั่น และส่วนประกอบหลักของเว็บทั้งหมดครับ
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 60, height: 60, borderRadius: '16px', bgcolor: primaryColor, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <TextField
                      name="primaryColor"
                      label="รหัสสี (Hex Code)"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      placeholder="#f2a1a1"
                    />
                  </Stack>
                </Box>

                <Box sx={{ px: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#334155" sx={{ mb: 2 }}>โทนสีรอง และ ฟอนต์หลัก</Typography>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 45, height: 45, borderRadius: '12px', bgcolor: secondaryColor, border: '2px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} />
                      <TextField
                        name="secondaryColor"
                        label="สีพื้นหลัง (Secondary Color)"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Stack>
                    <TextField
                      name="fontFamily"
                      select
                      label="ฟอนต์ภาษาอังกฤษ (หัวข้อ/ชื่อ)"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                      <MenuItem value="Parisienne">Parisienne (ตัวเขียนพริ้วไหว - ยอดนิยม)</MenuItem>
                      <MenuItem value="Great Vibes">Great Vibes (หรูหรา คลาสสิก)</MenuItem>
                      <MenuItem value="Playball">Playball (ทันสมัย อ่อนช้อย)</MenuItem>
                      <MenuItem value="Montserrat">Montserrat (ตัวพิมพ์เรียบหรู)</MenuItem>
                    </TextField>
                    <Box sx={{ p: 1.5, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                      <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600, display: 'block' }}>
                        💡 ภาษาไทยถูกตั้งค่าให้ใช้ฟอนต์ <b>Prompt</b> โดยอัตโนมัติเพื่อความสวยงามและอ่านง่ายที่สุดครับ
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ p: 2.5, bgcolor: '#f0fdf4', borderRadius: '24px', border: '1px solid #dcfce7' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#166534" sx={{ mb: 1 }}>🎵 เพลงประกอบ (Background Music)</Typography>
                  <Typography variant="caption" sx={{ color: '#15803d', display: 'block', mb: 2 }}>
                    อัปโหลดไฟล์เพลง (.mp3) เพื่อสร้างบรรยากาศให้กับการ์ดครับ
                  </Typography>

                  {musicUrl ? (
                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '16px', border: '1px solid #bbf7d0', mb: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: '#f0fdf4', borderRadius: '50%', color: '#22c55e' }}>
                          <Music size="20" variant="Bold" color="#22c55e" />
                        </Box>
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {savedPaths.music ? savedPaths.music.split('/').pop() : 'ไฟล์ที่เลือกอยู่ขณะนี้'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">Ready to play</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => handleFileRemove('music')} sx={{ color: '#ef4444' }}>
                          <Trash size={18} variant="Bold" color="#ef4444" />
                        </IconButton>
                      </Stack>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{
                        borderRadius: '16px',
                        py: 3,
                        borderStyle: 'dashed',
                        borderColor: '#22c55e',
                        color: '#166534',
                        bgcolor: 'rgba(34, 197, 94, 0.05)',
                        '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' }
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <Music size="32" variant="Bulk" />
                        <Typography variant="body2" fontWeight={700}>กดเพื่อเลือกไฟล์เพลง (.mp3)</Typography>
                        <Typography variant="caption">แนะนำขนาดไม่เกิน 5MB</Typography>
                      </Stack>
                      <input hidden type="file" accept="audio/mpeg" onChange={(e) => handleFileSelect(e, 'music')} />
                    </Button>
                  )}
                </Box>

                <Divider sx={{ my: 1 }} />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSaving}
                  sx={{ py: 2, bgcolor: primaryColor, borderRadius: '50px', fontWeight: 800, fontSize: '1rem', color: 'white', boxShadow: `0 8px 25px ${alpha(primaryColor, 0.3)}`, '&:hover': { bgcolor: primaryColor, opacity: 0.9, transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}
                >
                  {isSaving ? <CircularProgress size={24} color="inherit" /> : 'บันทึกการตั้งค่าธีม'}
                </Button>

                <Typography variant="caption" sx={{ color: '#94a3b8', textAlign: 'center', mt: 1 }}>
                  * การบันทึกสีจะส่งผลต่อทุก Section ที่มีสถานะ Active ครับ
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

const successGreen = '#10b981';
