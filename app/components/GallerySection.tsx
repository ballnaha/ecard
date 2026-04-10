'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Dialog, Fade } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseSquare, Maximize1 } from 'iconsax-react';
import { getFontFamily, isThai } from '../utils/fontHelper';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination, Autoplay, EffectCoverflow, EffectCreative, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

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
              width: { xs: '310px', md: '480px' },
              height: { xs: '510px', md: '780px' }, // Slightly more height for bullets
              overflow: 'visible',
              paddingBottom: '40px'
            },
            '.swiper-slide': {
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }
          }}>
            <Swiper
              effect={'creative'}
              grabCursor={true}
              modules={[EffectCreative, Autoplay, Pagination]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop={images.length > 2}
              creativeEffect={{
                prev: {
                    shadow: false,
                    translate: ['-120%', 0, 500],
                    rotate: [0, 0, -15],
                    opacity: 1
                },
                next: {
                    shadow: false,
                    translate: ['8%', '8%', -1],
                    scale: 0.93,
                    opacity: 1
                },
              }}
              speed={500}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <Box 
                      component={motion.div} 
                      onClick={() => setSelectedImg(src)}
                      sx={{ 
                        width: '100%', 
                        height: '100%', 
                        position: 'relative',
                        cursor: 'zoom-in',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        '.swiper-slide:not(.swiper-slide-active) &': {
                          pointerEvents: 'none',
                        },
                        '.swiper-slide-active &': {
                          pointerEvents: 'auto',
                        },
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                      }}
                    >
                        <Image src={src} alt={`Gallery Image ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                        {/* Border overlay — renders on top of the image */}
                        <Box sx={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '20px',
                          border: '6px solid #fff',
                          zIndex: 2,
                          pointerEvents: 'none',
                        }} />
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
            '.swiper': { width: '100%', paddingTop: '20px', paddingBottom: '80px' },
            '.swiper-slide': {
              width: { xs: '75%', md: '45.0%' },
              borderRadius: '24px',
              overflow: 'hidden',
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(0.85)',
              opacity: 0.4,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              '&.swiper-slide-active': {
                opacity: 1,
                transform: 'scale(1) translateZ(0)',
                boxShadow: '0 25px 60px rgba(142, 125, 93, 0.25)',
              }
            }
          }}>
            <Swiper
              slidesPerView={'auto'} centeredSlides={true} spaceBetween={20}
              pagination={{ clickable: true }} autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[Pagination, Autoplay]} loop={images.length > 2}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} onClick={() => setSelectedImg(src)} style={{ cursor: 'zoom-in' }}>
                   <Box component={motion.div} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} sx={{ width: '100%', aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
                        <Image src={src} alt={`Gallery Image ${index + 1}`} fill style={{ objectFit: 'cover' }} />
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
            '.swiper': { width: '100%', paddingTop: '50px', paddingBottom: '80px' },
            '.swiper-slide': {
              backgroundPosition: 'center', backgroundSize: 'cover',
              width: { xs: '320px', md: '550px' }, height: { xs: '450px', md: '750px' },
              borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)', opacity: 0.35,
              willChange: 'transform', backfaceVisibility: 'hidden',
              '&.swiper-slide-active': { opacity: 1, transform: 'scale(1.08) translateZ(0)' }
            }
          }}>
            <Swiper
              effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'} loop={images.length > 3}
              coverflowEffect={{
                rotate: 50,
                stretch: -30,
                depth: 200,
                modifier: 1,
                slideShadows: false
              }}
              pagination={{ clickable: true }} autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} onClick={() => setSelectedImg(src)} style={{ cursor: 'zoom-in' }}>
                   <Box component={motion.div} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <Image src={src} alt={`Gallery Image ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                    </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        );
    }
  };

  return (
    <Box component="section" className="embossed-paper" sx={{ 
      py: { xs: 6, md: 10 }, 
      backgroundColor: '#fff', 
      position: 'relative', 
      overflow: 'hidden',
      // Global Modern Pagination Styles
      '.swiper-pagination': {
        bottom: '30px !important',
      },
      '.swiper-pagination-bullet': { 
        width: '12px', 
        height: '2px', 
        borderRadius: '2px',
        backgroundColor: 'var(--primary-color, #8e7d5d)', 
        opacity: 0.12, 
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        margin: '0 4px !important'
      },
      '.swiper-pagination-bullet-active': { 
        width: '40px', 
        opacity: 1,
        backgroundColor: 'var(--primary-color, #8e7d5d)'
      }
    }}>
      {/* Decorative Text */}
      <Typography sx={{ 
        position: 'absolute', 
        top: '15%', 
        right: '-5%', 
        fontSize: { xs: '8rem', md: '16rem' }, 
        fontFamily: getFontFamily('Memories'), 
        color: 'rgba(142, 125, 93, 0.03)', 
        whiteSpace: 'nowrap', 
        zIndex: 0, 
        userSelect: 'none', 
        pointerEvents: 'none' 
      }}>
        Memories
      </Typography>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: '#8e7d5d', letterSpacing: '0.6em', fontSize: '0.75rem', mb: 2, display: 'block' }}>
            Our Love Story
          </Typography>
          <Typography sx={{ 
            fontFamily: getFontFamily('Captured Moments'), 
            fontSize: isThai('Captured Moments') ? { xs: '2rem', md: '3.2rem' } : { xs: '3.2rem', md: '5rem' }, 
            color: '#1a1a1a', 
            fontWeight: isThai('Captured Moments') ? 600 : 400,
            lineHeight: 1.1 
          }}>
            Captured Moments
          </Typography>
          <Box sx={{ height: '1px', width: '60px', bgcolor: '#8e7d5d', opacity: 0.5, mx: 'auto', mt: 3 }} />
        </Box>

        {renderSwiper()}
      </Container>

      {/* Lightbox / Image Preview */}
      <Dialog
        fullScreen open={!!selectedImg} onClose={() => setSelectedImg(null)}
        TransitionComponent={Fade} TransitionProps={{ timeout: 300 }}
        disableScrollLock
        keepMounted={false}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            willChange: 'opacity',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }
        }}
      >
        <IconButton onClick={() => setSelectedImg(null)} sx={{ position: 'fixed', top: 20, right: 20, color: '#fff', zIndex: 10 }}>
          <CloseSquare variant="Bold" size={40} color="currentColor" />
        </IconButton>

        <AnimatePresence>
          {selectedImg && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: '95vw', height: '90vh' }}>
                <Image src={selectedImg} alt="Gallery Preview" fill style={{ objectFit: 'contain' }} />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  );
}
