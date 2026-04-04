'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Dialog, Fade } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseSquare } from 'iconsax-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow, EffectCards, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';

const demoImages = [
  "/images/demo/gallery/1.jpg",
  "/images/demo/gallery/2.jpg",
  "/images/demo/gallery/3.jpg",
  "/images/demo/gallery/4.jpg",
  "/images/demo/gallery/5.jpg",
  "/images/demo/gallery/6.jpg",
  "/images/demo/gallery/7.jpg"
];

interface GalleryData {
  items?: string[];
  layout?: 'coverflow' | 'cards' | 'slide';
}

export default function GallerySection({ data }: { data?: GalleryData }) {
  const images = (data?.items && data.items.length > 0) ? data.items : demoImages;
  const layout = data?.layout || 'coverflow';
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const renderSwiper = () => {
    switch (layout) {
      case 'cards':
        return (
          <Box sx={{ 
            width: '100%', py: { xs: 6, md: 10 }, display: 'flex', justifyContent: 'center',
            '.swiper': { 
              width: { xs: '280px', md: '400px' }, 
              height: { xs: '280px', md: '400px' } // 1:1 Ratio
            },
            '.swiper-slide': { 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
              border: '8px solid #fff' // White border like polaroid
            }
          }}>
            <Swiper
              effect={'cards'} grabCursor={true} modules={[EffectCards, Autoplay]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop={images.length > 1}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} onClick={() => setSelectedImg(src)} style={{ cursor: 'zoom-in' }}>
                  <Box sx={{ width: '100%', height: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                    <Box component="img" src={src} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        );

      case 'slide':
        return (
          <Box sx={{ 
            width: '100%', py: 4,
            '.swiper': { width: '100%', paddingTop: '20px', paddingBottom: '60px' },
            '.swiper-slide': { 
              width: { xs: '75%', md: '45.0%' }, 
              borderRadius: '24px', 
              overflow: 'hidden', 
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
              transform: 'scale(0.85)',
              opacity: 0.5,
              filter: 'blur(1px)',
              '&.swiper-slide-active': { 
                transform: 'scale(1)', 
                opacity: 1,
                filter: 'blur(0px)',
                boxShadow: '0 25px 60px rgba(142, 125, 93, 0.25)' 
              }
            },
            '.swiper-pagination-bullet': { width: '8px', height: '8px', backgroundColor: '#8e7d5d', opacity: 0.2, transition: 'all 0.3s ease' },
            '.swiper-pagination-bullet-active': { width: '30px', borderRadius: '4px', opacity: 1 }
          }}>
            <Swiper
              slidesPerView={'auto'} centeredSlides={true} spaceBetween={0}
              pagination={{ clickable: true }} autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[Pagination, Autoplay]} loop={images.length > 2}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} onClick={() => setSelectedImg(src)} style={{ cursor: 'zoom-in' }}>
                  <Box sx={{ width: '100%', aspectRatio: '2/3', overflow: 'hidden' }}>
                    <Box component="img" src={src} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        );

      case 'coverflow':
      default:
        return (
          <Box sx={{ 
            width: '100%', py: 4, position: 'relative', zIndex: 1,
            '.swiper': { width: '100%', paddingTop: '50px', paddingBottom: '100px' },
            '.swiper-slide': {
              backgroundPosition: 'center', backgroundSize: 'cover',
              width: { xs: '320px', md: '550px' }, height: { xs: '450px', md: '750px' },
              borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', opacity: 0.3, filter: 'blur(3px)',
              '&.swiper-slide-active': { opacity: 1, filter: 'blur(0px)', transform: 'scale(1.1)' }
            },
            '.swiper-pagination-bullet': { width: '12px', height: '2px', borderRadius: '2px', backgroundColor: '#8e7d5d', opacity: 0.3, transition: 'all 0.3s ease' },
            '.swiper-pagination-bullet-active': { width: '40px', opacity: 1 }
          }}>
            <Swiper
              effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'} loop={images.length > 3}
              coverflowEffect={{ 
                rotate: 50, // More tilted
                stretch: -30, // Tighter overlap
                depth: 200, // More perspective
                modifier: 1, 
                slideShadows: false 
              }}
              pagination={{ clickable: true }} autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} onClick={() => setSelectedImg(src)} style={{ cursor: 'zoom-in' }}>
                  <Box component="img" src={src} alt={`Gallery ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        );
    }
  };

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Text */}
      <Typography sx={{ position: 'absolute', top: '15%', right: '-5%', fontSize: { xs: '8rem', md: '16rem' }, fontFamily: '"Pinyon Script", cursive', color: 'rgba(142, 125, 93, 0.03)', whiteSpace: 'nowrap', zIndex: 0, userSelect: 'none', pointerEvents: 'none' }}>
        Memories
      </Typography>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: '#8e7d5d', letterSpacing: '0.6em', fontSize: '0.75rem', mb: 2, display: 'block' }}>
            Our Love Story
          </Typography>
          <Typography sx={{ fontFamily: '"Bodoni Moda", serif', fontSize: { xs: '2.5rem', md: '4rem' }, color: '#1a1a1a', fontStyle: 'italic', lineHeight: 1.1 }}>
            Captured Moments
          </Typography>
          <Box sx={{ height: '1px', width: '60px', backgroundColor: 'rgba(142, 125, 93, 0.3)', mx: 'auto', mt: 3 }} />
        </Box>

        {renderSwiper()}
      </Container>

      {/* Lightbox / Image Preview */}
      <Dialog 
        fullScreen open={!!selectedImg} onClose={() => setSelectedImg(null)} 
        TransitionComponent={Fade} TransitionProps={{ timeout: 500 }}
        PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 } }}
      >
        <IconButton onClick={() => setSelectedImg(null)} sx={{ position: 'fixed', top: 20, right: 20, color: '#fff', zIndex: 10 }}>
          <CloseSquare variant="Bold" size={40} color="currentColor" />
        </IconButton>
        
        <AnimatePresence>
          {selectedImg && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box component="img" src={selectedImg} sx={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  );
}
