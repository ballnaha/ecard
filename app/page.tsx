'use client';

import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  ThemeProvider,
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Drawer,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, ArrowRight2, Music, Map, DeviceMessage, Image, GlobalSearch, HeartAdd, Message, VideoPlay, Timer1, TickCircle, CloseCircle, Star } from 'iconsax-react';
import theme from './theme';

/* ═══════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════ */

function useScrollY() {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

/** Wrapper component with built-in scroll reveal & optional line reveal */
function RevealBox({
  children,
  className = 'reveal',
  sx,
  withLine = false,
}: {
  children?: React.ReactNode;
  className?: string;
  sx?: import('@mui/material').SxProps<import('@mui/material').Theme>;
  withLine?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (withLine) {
    return <Box ref={ref} className="line-reveal" sx={sx} />;
  }

  return (
    <Box ref={ref} className={className} sx={sx}>
      {children}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════ */

const SectionTitle = ({
  overline,
  title,
  subtitle,
}: {
  overline: string;
  title: string;
  subtitle?: string;
}) => (
  <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 12 }, px: { xs: 2, md: 0 } }}>
    <RevealBox>
      <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
        {overline}
      </Typography>
    </RevealBox>
    <RevealBox className="reveal reveal-delay-1">
      <Typography variant="h2" sx={{ mt: 2, mb: 1, fontSize: { xs: '2.2rem', md: '3.8rem' }, fontStyle: 'italic', lineHeight: 1.2 }}>
        {title}
      </Typography>
    </RevealBox>
    <RevealBox withLine />
    {subtitle && (
      <RevealBox className="reveal reveal-delay-2">
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mt: { xs: 2, md: 4 }, lineHeight: 1.7, fontSize: { xs: '0.9rem', md: '1rem' } }}>
          {subtitle}
        </Typography>
      </RevealBox>
    )}
  </Box>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function Home() {
  const scrollY = useScrollY();
  const navSolid = scrollY > 80;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = ['หน้าแรก', 'ฟีเจอร์เด่น', 'รูปแบบการ์ด', 'ราคา'];

  return (
    <ThemeProvider theme={theme}>
      {/* Preloader */}
      <Box className="preloader">
        <Typography className="preloader-text" variant="overline">SETEVENT E-CARD</Typography>
      </Box>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* ═══════════════ NAVIGATION ═══════════════ */}
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            bgcolor: navSolid ? 'rgba(255,255,255,0.95)' : 'transparent',
            backdropFilter: navSolid ? 'blur(20px)' : 'none',
            borderBottom: navSolid ? '1px solid rgba(204,172,113,0.15)' : '1px solid transparent',
            py: navSolid ? 0.5 : 2,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
              {/* Left Side: Empty/Menu on Desktop, Null on Mobile */}
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Stack direction="row" spacing={4}>
                    {navItems.map((item) => (
                      <Typography
                        key={item}
                        variant="overline"
                        sx={{
                          color: 'text.primary',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          position: 'relative',
                          transition: 'color 0.3s ease',
                          '&::after': {
                            content: '""', position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                            width: 0, height: '2px', bgcolor: 'primary.main',
                            transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', borderRadius: 1
                          },
                          '&:hover': { color: 'primary.main' },
                          '&:hover::after': { width: '100%' },
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="/images/logo_black1.png"
                  alt="SetEvent E-Card"
                  sx={{ height: { xs: 40, md: 50 }, width: 'auto' }}
                />
              </Box>

              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'text.primary',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      position: 'relative',
                      transition: 'color 0.3s ease',
                      '&::after': {
                        content: '""', position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                        width: 0, height: '2px', bgcolor: 'primary.main',
                        transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', borderRadius: 1
                      },
                      '&:hover': { color: 'primary.main' },
                      '&:hover::after': { width: '100%' },
                    }}
                  >
                    เข้าสู่ระบบ
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      bgcolor: 'transparent',
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(204,172,113,0.3)',
                      }
                    }}
                  >
                    สร้างการ์ดของฉัน
                  </Button>
                </Box>
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{
                    display: { md: 'none' },
                    color: 'primary.main',
                    bgcolor: 'rgba(204,172,113,0.05)',
                    '&:hover': { bgcolor: 'rgba(204,172,113,0.1)' }
                  }}
                >
                  <MenuIcon size="24" variant="Bulk" color="#ccac71" />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* ═══════════════ MOBILE DRAWER ═══════════════ */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: '80%',
              maxWidth: 360,
              bgcolor: '#FFFFFF',
              px: 4,
              py: 5,
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box
              component="img"
              src="/images/logo_black1.png"
              alt="SetEvent E-Card"
              sx={{ height: 28, width: 'auto' }}
            />
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'text.primary' }}>
              <CloseCircle size="24" variant="Bulk" color="#ccac71" />
            </IconButton>
          </Box>

          <Stack spacing={0}>
            {navItems.map((item) => (
              <Box
                key={item}
                onClick={() => setMobileOpen(false)}
                sx={{
                  py: 2.5,
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { pl: 2, color: 'primary.main' },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1rem', letterSpacing: '0.05em' }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Stack spacing={2}>
            <Button variant="contained" fullWidth size="large" onClick={() => setMobileOpen(false)} sx={{ py: 1.5 }}>
              สร้างการ์ดของฉัน
            </Button>
            <Button variant="outlined" fullWidth onClick={() => setMobileOpen(false)} sx={{ py: 1.5 }}>
              เข้าสู่ระบบ
            </Button>
          </Stack>

          <Box sx={{ mt: 'auto', pt: 6 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
              © {new Date().getFullYear()} SetEvent E-Card
            </Typography>
          </Box>
        </Drawer>

        {/* ═══════════════ HERO ═══════════════ */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 'auto', md: '100vh' },
            bgcolor: '#FFFFFF',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            pt: { xs: 15, md: 10 },
            pb: { xs: 10, md: 0 },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 8 }}>

              {/* Left Side: Text Content */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <RevealBox>
                  <Typography 
                    variant="overline" 
                    sx={{ 
                      color: 'primary.main', 
                      letterSpacing: '0.6em', 
                      fontSize: { xs: '0.65rem', md: '0.75rem' },
                      fontWeight: 600,
                      display: 'block',
                      mb: 1
                    }}
                  >
                    TIMELESS DIGITAL ELEGANCE
                  </Typography>
                </RevealBox>
                <RevealBox className="reveal reveal-delay-1">
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'text.primary',
                      fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5.2rem' },
                      fontWeight: 300,
                      mt: 1,
                      mb: 3,
                      lineHeight: 1,
                      maxWidth: { xs: '100%', md: 700 },
                      mx: { xs: 'auto', md: 0 },
                      '& span': {
                        fontStyle: 'italic',
                        fontWeight: 300,
                        color: 'primary.main',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '15%',
                          left: 0,
                          width: '100%',
                          height: '1px',
                          bgcolor: 'rgba(204,172,113,0.3)',
                        }
                      }
                    }}
                  >
                    Crafting Your <br />
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>Exquisite</Box> <br />
                    <Box component="span">Moment</Box>
                  </Typography>
                </RevealBox>
                <RevealBox className="reveal reveal-delay-2">
                  <Typography variant="body1" sx={{ 
                    color: 'text.secondary', 
                    maxWidth: 480, 
                    mx: { xs: 'auto', md: 0 }, 
                    mb: 5, 
                    lineHeight: 1.8, 
                    fontWeight: 300, 
                    fontSize: { xs: '0.9rem', md: '1.05rem' },
                    letterSpacing: '0.02em'
                  }}>
                    ยกระดับการเริ่มต้นชีวิตคู่ด้วยสุนทรียภาพแห่งการเชิญแขก
                    ถ่ายทอดเรื่องราวความรักผ่านดีไซน์ที่ประณีตและเทคโนโลยีที่ทันสมัย
                    เพื่อสร้างความประทับใจที่เป็นนิรันดร์
                  </Typography>
                </RevealBox>
                <RevealBox className="reveal reveal-delay-3">
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ px: { xs: 4, md: 6 }, py: 2 }}
                    >
                      เริ่มสร้างการ์ดตอนนี้
                    </Button>
                    <Button
                      variant="text"
                      sx={{
                        color: 'text.primary',
                        borderBottom: '1px solid',
                        borderColor: 'primary.main',
                        pb: 0.5,
                        borderRadius: 0,
                        alignSelf: { xs: 'center', sm: 'auto' },
                        '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
                      }}
                    >
                      ดูรูปแบบทั้งหมด
                    </Button>
                  </Stack>
                </RevealBox>
              </Box>

              {/* Right Side: Device Mockup Image */}
              <Box sx={{
                flex: 1.3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4
              }}>
                <RevealBox className="reveal reveal-delay-2">
                  <Box
                    component="img"
                    src="/images/mockup.png"
                    alt="Wedding E-Card on iPhone and iPad"
                    sx={{
                      width: '100%',
                      maxWidth: 650,
                      height: 'auto',
                      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))',
                      animation: 'deviceFloat 6s ease-in-out infinite',
                    }}
                  />
                </RevealBox>
              </Box>

            </Box>
          </Container>

          {/* Decorative Gold Elements if needed, but keeping it minimalist white */}
        </Box>


        {/* ═══════════════ WHY E-CARD / FEATURES ═══════════════ */}
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: '#FAFAFA' }}>
          <Container maxWidth="lg">
            <SectionTitle overline="WHY SETEVENT E-CARD" title="Smart & Beautiful" subtitle="ยกระดับประสบการณ์การเชิญแขกด้วยฟังก์ชันการ์ดแต่งงานออนไลน์แบบครบวงจร ที่ไม่ได้มีแค่ความสวย แต่ยังใช้งานง่ายและชาญฉลาด" />

            <Box sx={{ mt: 8, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 5, md: 6 } }}>
              {[
                { title: 'Interactive Design', desc: 'ดีไซน์เคลื่อนไหว ลื่นไหล สร้างความประทับใจตั้งแต่เปิดอ่าน', icon: <GlobalSearch size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Online RSVP System', desc: 'ระบบให้แขกกดยืนยันเข้าร่วมงาน จัดการรายชื่อได้อย่างแม่นยำ', icon: <DeviceMessage size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Pre-Wedding Gallery', desc: 'คลังภาพพรีเวดดิ้ง ให้แขกได้ชมแบบไร้ขีดจำกัด ลดค่าใช้จ่ายอัดรูป', icon: <Image size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Google Maps Embedded', desc: 'นำทางเชื่อมต่อกับ Google Maps แขกคลิกเพื่อมาร่วมงานได้ทันที', icon: <Map size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Save to Calendar', desc: 'แขกสามารถกดปุ่มเพิ่มกำหนดการลงในสมาร์ตโฟนได้โดยตรง', icon: <HeartAdd size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Background Music', desc: 'เพิ่มความโรแมนติกด้วยบทเพลง เล่นคลออัตโนมัติขณะเปิดอ่าน', icon: <Music size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Digital Guestbook', desc: 'สมุดอวยพรดิจิทัล ให้แขกร่วมเขียนความรู้สึกเก็บไว้เป็นความทรงจำ', icon: <Message size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Video Presentation', desc: 'ฝังวิดีโอพรีเซนเทชั่นงานแต่ง ให้แขกได้รับชมอย่างลื่นไหล', icon: <VideoPlay size="28" variant="Bulk" color="#ccac71" /> },
                { title: 'Live Countdown', desc: 'วิดเจ็ตนับถอยหลังสู่วันสำคัญ สร้างความตื่นเต้นเตือนใจ', icon: <Timer1 size="28" variant="Bulk" color="#ccac71" /> },
              ].map((feature, i) => (
                <RevealBox key={i} className={`reveal reveal-delay-${i % 3 + 1}`}>
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                    <Box sx={{
                      flexShrink: 0,
                      p: 1.5,
                      bgcolor: 'white',
                      borderRadius: 2,
                      color: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      border: '1px solid rgba(204,172,113,0.1)'
                    }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontFamily: '"Cormorant Garamond", "Prompt", serif', fontSize: '1.2rem', color: 'text.primary' }}>{feature.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.85rem' }}>{feature.desc}</Typography>
                    </Box>
                  </Box>
                </RevealBox>
              ))}
            </Box>
          </Container>
        </Box>



        {/* ═══════════════ DEMO COLLECTIONS ═══════════════ */}
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: '#FFFFFF' }}>
          <Container maxWidth="xl">
            <SectionTitle overline="OUR DEMOS" title="ตัวอย่างการ์ดแต่งงานออนไลน์" subtitle="เลือกชมรูปแบบการ์ดแต่งงานออนไลน์ที่เราออกแบบไว้อย่างปราณีต เพื่อเป็นแรงบันดาลใจ หรือเลือกใช้โครงสร้างที่ตรงกับสไตล์ของคุณ" />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 10, md: 6 }, mt: 10 }}>
              {[
                { title: 'The Classic Elegance', sub: 'สไตล์หรูกรา คลาสสิก เน้นตัวอักษร', src: '/wedding_gallery_1.png', delay: 1 },
                { title: 'Modern Minimalist', sub: 'สไตล์มินิมอล เรียบง่ายแต่พรีเมียม', src: '/wedding_gallery_2.png', delay: 2 },
                { title: 'Romance in Garden', sub: 'สไตล์อบอุ่น อิงธรรมชาติและดวงดาว', src: '/wedding_gallery_3.png', delay: 3 }
              ].map((item, i) => (
                <RevealBox key={i} className={`reveal reveal-delay-${item.delay}`} sx={{ textAlign: 'center' }}>
                  {/* iPhone Mockup for Demo */}
                  <Box sx={{
                    position: 'relative',
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    transition: 'transform 0.4s var(--ease-slow)',
                    '&:hover': { transform: 'translateY(-10px)' }
                  }}>
                    <Box sx={{
                      position: 'relative',
                      width: { xs: 180, md: 220 },
                      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.12))',
                    }}>
                      <Box
                        component="img"
                        src="/images/iphone.png"
                        alt="iPhone Mockup"
                        sx={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 10 }}
                      />
                      {/* Screen Content */}
                      <Box sx={{
                        position: 'absolute',
                        top: '2.5%',
                        left: '5.5%',
                        right: '5.5%',
                        bottom: '2.5%',
                        borderRadius: '13%/6%',
                        overflow: 'hidden',
                        bgcolor: 'white',
                        zIndex: 5
                      }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${item.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'top center',
                            animation: 'scrollScreen 18s linear infinite alternate'
                          }}
                        />
                        {/* Overlay CTA on Hover */}
                        <Box sx={{
                          position: 'absolute', inset: 0, bgcolor: 'rgba(26,26,26,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.4s ease',
                          zIndex: 30,
                          '&:hover': { opacity: 1 }
                        }}>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: 'white',
                              color: 'text.primary',
                              fontSize: '0.65rem',
                              px: 2,
                              py: 1,
                              '&:hover': { bgcolor: 'primary.main', color: 'white' }
                            }}
                          >
                            Live Demo
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", "Prompt", serif', fontWeight: 600 }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>{item.sub}</Typography>
                </RevealBox>
              ))}
            </Box>
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Button variant="outlined" sx={{ py: 2, px: 6 }}>ดูแค็ตตาล็อกทั้งหมด (50+ รูปแบบ)</Button>
            </Box>
          </Container>
        </Box>

        {/* ═══════════════ PACKAGES & PRICING TABLE ═══════════════ */}
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: '#FFFFFF' }}>
          <Container maxWidth="lg">
            <SectionTitle overline="OUR PACKAGES" title="Transparent Pricing" subtitle="เลือกแพ็กเกจที่ตรงกับความต้องการของคุณ แจกแจงทุกฟีเจอร์อย่างชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง" />

            <Box sx={{ mt: 10, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'end' }}>

              {/* Feature List Column (Desktop Only) */}
              <Box sx={{ display: { xs: 'none', md: 'block' }, pb: 4 }}>
                <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', mb: 4, visibility: 'hidden' }}>Features</Typography>
                {[
                  'อายุการใช้งานลิงก์ (Days)', 'ข้อมูลบ่าวสาว & กำหนดการ', 'ระบบนำทาง Google Maps', 'เพิ่มลงปฏิทิน (Calendar)', 'ระบบตอบรับเข้าร่วมงาน (RSVP)',
                  'จำนวนรูปภาพพรีเวดดิ้ง', 'ระบบนับถอยหลังสู่วันงาน', 'เพลงประกอบพื้นหลัง (BGM)', 'สมุดอวยพรดิจิทัล (Guestbook)', 'วิดีโอพรีเซนเทชั่น (YouTube)'
                ].map((feature, i) => (
                  <Box key={i} sx={{ py: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>{feature}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Package Cards */}
              {[
                {
                  name: 'STARTER', price: '990', desc: 'สำหรับงานจัดเลี้ยงขนาดเล็ก เรียบง่ายและสวยงาม',
                  features: ['90 วัน', true, true, true, true, 'สูงสุด 10 รูป', false, false, false, false],
                  popular: false
                },
                {
                  name: 'PREMIUM', price: '1,590', desc: 'คุ้มค่าที่สุด! ครบทุกฟังก์ชันพื้นฐานที่แขกต้องการ',
                  features: ['180 วัน', true, true, true, true, 'สูงสุด 50 รูป', true, true, false, false],
                  popular: true
                },
                {
                  name: 'ULTIMATE', price: '2,990', desc: 'พรีเมียมตัวจบ! ครบทุกลูกเล่น เพื่อความทรงจำที่ดีที่สุด',
                  features: ['1 ปีเต็ม', true, true, true, true, 'ไม่จำกัดรูปภาพ', true, true, true, true],
                  popular: false
                }
              ].map((pkg, idx) => (
                <RevealBox key={idx} className={`reveal reveal-delay-${idx + 1}`} sx={{ height: '100%' }}>
                  <Box sx={{
                    position: 'relative',
                    bgcolor: pkg.popular ? '#fafafa' : '#fff',
                    border: '1px solid',
                    borderColor: pkg.popular ? 'primary.main' : 'rgba(0,0,0,0.05)',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    boxShadow: pkg.popular ? '0 20px 40px rgba(0,0,0,0.04)' : 'none',
                    height: '100%',
                    transform: pkg.popular ? { md: 'scale(1.05)' } : 'none',
                    zIndex: pkg.popular ? 2 : 1
                  }}>
                    {pkg.popular && (
                      <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'primary.main', color: 'white', px: 3, py: 0.5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star size="12" variant="Bold" />
                        <Typography variant="overline" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>MOST POPULAR</Typography>
                      </Box>
                    )}
                    <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.1em' }}>{pkg.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mt: 2, mb: 1 }}>
                      <Typography variant="h3" sx={{ fontFamily: '"Cormorant Garamond", serif', color: 'text.primary', mr: 1 }}>{pkg.price}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>THB</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 4, minHeight: 40, px: 2 }}>{pkg.desc}</Typography>

                    {/* Mobile Feature Description hidden on desktop, mapped side by side on desktop */}
                    <Box sx={{ mt: 4 }}>
                      {pkg.features.map((val, fIdx) => (
                        <Box key={fIdx} sx={{
                          py: 2,
                          borderBottom: '1px solid rgba(0,0,0,0.05)',
                          display: 'flex',
                          justifyContent: { xs: 'space-between', md: 'center' },
                          alignItems: 'center'
                        }}>
                          {/* Mobile label */}
                          <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, color: 'text.secondary', textAlign: 'left', flex: 1 }}>
                            {[
                              'อายุลิงก์', 'ข้อมูล & กำหนดการ', 'Google Maps', 'ลง Calendar', 'ระบบ RSVP',
                              'แกลเลอรีรูปภาพ', 'เวลาถอยหลัง', 'เพลงประกอบ BGM', 'สมุดอวยพร Guestbook', 'วิดีโอ YouTube'
                            ][fIdx]}
                          </Typography>

                          {/* Value */}
                          <Box sx={{ flex: { xs: 'none', md: 1 }, textAlign: 'center' }}>
                            {typeof val === 'boolean' ? (
                              val ? <TickCircle size="20" color="#ccac71" variant="Bulk" style={{ display: 'inline-block' }} />
                                : <CloseCircle size="20" color="#e0e0e0" variant="Bulk" style={{ display: 'inline-block', opacity: 0.5 }} />
                            ) : (
                              <Typography variant="body2" sx={{ color: pkg.popular ? 'primary.main' : 'text.primary', fontWeight: val.includes('ไม่จำกัด') ? 500 : 300 }}>{val as string}</Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant={pkg.popular ? 'contained' : 'outlined'}
                      fullWidth
                      sx={{ mt: 4, py: 1.5 }}
                    >
                      เลือกแพ็กเกจนี้
                    </Button>
                  </Box>
                </RevealBox>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ═══════════════ ORDERING STEPS ═══════════════ */}
        <Box sx={{ py: { xs: 12, md: 24 }, bgcolor: '#FAFAFA' }}>
          <Container maxWidth="lg">
            <SectionTitle overline="HOW IT WORKS" title="ขั้นตอนการสั่งซื้อ" subtitle="เริ่มต้นสร้างการ์ดแต่งงานดิจิทัลสุดหรูของคุณได้ง่ายๆ ใน 3 ขั้นตอน" />

            <Box sx={{ mt: 10, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 8, md: 6 } }}>
              {[
                { step: '01', title: 'เลือกแบบการ์ดแต่งงาน', desc: 'เลือกเทมเพลตและแพ็กเกจราคาที่คุณถูกใจจากแค็ตตาล็อก หรือสอบถามเพื่อให้แอดมินช่วยแนะนำแบบที่เหมาะกับธีมงาน', icon: <GlobalSearch size="32" variant="Bulk" color="#ccac71" /> },
                { step: '02', title: 'แจ้งรายละเอียดใช้งาน', desc: 'ส่งข้อมูล ชื่อบ่าวสาว, วันเวลา, สถานที่จัดงาน, กำหนดการ, และอัปโหลดรูปภาพพรีเวดดิ้งผ่านระบบฟอร์มของเรา', icon: <DeviceMessage size="32" variant="Bulk" color="#ccac71" /> },
                { step: '03', title: 'ส่งต่อความพิเศษ', desc: 'รับลิงก์การ์ดแต่งงานออนไลน์ของคุณ และพร้อมส่งแชร์ให้แขกคนสำคัญผ่านแชท LINE, Facebook หรือ Social Media อื่นๆ ได้ทันที', icon: <Message size="32" variant="Bulk" color="#ccac71" /> },
              ].map((s, i) => (
                <RevealBox key={i} className={`reveal reveal-delay-${i + 1}`} sx={{ textAlign: 'center', position: 'relative' }}>
                  <Typography variant="h2" sx={{ color: 'rgba(204,172,113,0.15)', fontSize: { xs: '4rem', md: '5.5rem' }, lineHeight: 1, fontFamily: '"Cormorant Garamond", serif', position: 'absolute', top: { xs: -20, md: -30 }, left: '50%', transform: 'translateX(-50%)' }}>
                    {s.step}
                  </Typography>
                  <Box sx={{ position: 'relative', zIndex: 1, mt: { xs: 2, md: 4 } }}>
                    <Box sx={{ width: { xs: 70, md: 80 }, height: { xs: 70, md: 80 }, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(204,172,113,0.1)' }}>
                      {s.icon}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 1.5, fontFamily: '"Cormorant Garamond", "Prompt", serif', fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, px: { xs: 2, md: 2 }, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>{s.desc}</Typography>
                  </Box>
                </RevealBox>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <Box sx={{ bgcolor: '#1c1c1c', color: 'white', borderTop: '1px solid rgba(255,255,255,0.05)', pt: { xs: 10, md: 16 }, pb: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 12, gap: 8 }}>
              <Box sx={{ maxWidth: 400 }}>
                <Box
                  component="img"
                  src="/images/logo_black1.png"
                  alt="SetEvent E-Card"
                  sx={{ height: 40, width: 'auto', mb: 4, filter: 'brightness(0) invert(1)' }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 2, fontWeight: 300 }}>
                  Premium Digital Wedding Invitations.<br />
                  Smart, Eco-Friendly, and Unforgettably Elegant.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 6, sm: 8, md: 12 } }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.main', mb: 3, display: 'block' }}>ติดต่อซัพพอร์ต</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5, fontWeight: 300, fontSize: '0.85rem' }}>support@seteventwedding.com</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5, fontWeight: 300, fontSize: '0.85rem' }}>Line: @setevent-ecard</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300, mt: 3, fontSize: '0.85rem' }}>Bangkok, Thailand</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.main', mb: 3, display: 'block' }}>เมนูด่วน</Typography>
                  <Stack spacing={1.5}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', '&:hover': { color: 'white' }, transition: 'color 0.3s', fontSize: '0.85rem' }}>แพ็กเกจและราคา</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', '&:hover': { color: 'white' }, transition: 'color 0.3s', fontSize: '0.85rem' }}>รวมผลงาน Demos</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', '&:hover': { color: 'white' }, transition: 'color 0.3s', fontSize: '0.85rem' }}>คำถามที่พบบ่อย (FAQ)</Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                © {new Date().getFullYear()} SETEVENT E-CARD. ALL RIGHTS RESERVED.
              </Typography>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', cursor: 'pointer', mr: 3 }}>
                  TERMS OF SERVICE
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', cursor: 'pointer' }}>
                  PRIVACY POLICY
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ═══════════════ FLOATING CONTROLS ═══════════════ */}
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 30 },
            right: { xs: 20, md: 30 },
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center'
          }}
        >
          {/* Back to Top */}
          <Box
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              position: 'relative',
              bgcolor: 'white',
              width: 54,
              height: 54,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
              border: '1px solid rgba(204,172,113,0.15)',
              cursor: 'pointer',
              opacity: scrollY > 400 ? 1 : 0,
              visibility: scrollY > 400 ? 'visible' : 'hidden',
              transform: scrollY > 400 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.8)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -2,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'primary.main',
                opacity: 0,
                transform: 'scale(0.8)',
                transition: 'all 0.4s ease',
              },
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'translateY(-8px) scale(1.05)',
                boxShadow: '0 20px 40px rgba(204,172,113,0.3)',
                '&::before': {
                  opacity: 0.4,
                  transform: 'scale(1.15)',
                },
                '& > svg': {
                  color: 'white',
                  transform: 'rotate(-90deg) translateY(-2px)',
                }
              },
              '& > svg': {
                transition: 'all 0.3s ease',
                color: '#ccac71',
              }
            }}
          >
            <ArrowRight2 style={{ transform: 'rotate(-90deg)' }} size="22" variant="Bulk" color="currentColor" />
          </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
}
