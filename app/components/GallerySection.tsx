'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const images = [
  "/images/demo/gallery/1.jpg",
  "/images/demo/gallery/2.jpg",
  "/images/demo/gallery/3.jpg",
  "/images/demo/gallery/4.jpg",
  "/images/demo/gallery/5.jpg",
  "/images/demo/gallery/6.jpg",
  "/images/demo/gallery/7.jpg"
];

export default function GallerySection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background text */}
      <Typography
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-2%',
          fontSize: { xs: '6rem', md: '12rem' },
          fontFamily: '"Pinyon Script", cursive',
          color: 'rgba(142, 125, 93, 0.04)',
          whiteSpace: 'nowrap',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        Memory
      </Typography>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{
            color: '#8e7d5d',
            letterSpacing: '0.6em',
            fontSize: '0.75rem',
            mb: 2,
            display: 'block'
          }}>
            Our Journey
          </Typography>
          <Typography sx={{
            fontFamily: '"Bodoni Moda", serif',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#1a1a1a',
            fontStyle: 'italic',
            lineHeight: 1.2
          }}>
            Captured Moments
          </Typography>
          <Typography sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.5)',
            mt: 2
          }}>
            ภาพความทรงจำของเรา
          </Typography>
        </Box>
      </Container>

      {/* Swiper Gallery */}
      <Box sx={{ 
        width: '100%', 
        py: 4,
        '.swiper': {
          width: '100%',
          paddingTop: '50px',
          paddingBottom: '80px',
        },
        '.swiper-slide': {
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: { xs: '280px', md: '450px' },
          height: { xs: '380px', md: '600px' },
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          transition: 'all 0.5s ease',
          opacity: 0.4,
          filter: 'blur(2px)',
          '&.swiper-slide-active': {
            opacity: 1,
            filter: 'blur(0px)',
            transform: 'scale(1.05)'
          }
        },
        '.swiper-pagination-bullet': {
          width: '12px',
          height: '2px',
          borderRadius: '2px',
          backgroundColor: '#8e7d5d',
          opacity: 0.3,
          transition: 'all 0.3s ease'
        },
        '.swiper-pagination-bullet-active': {
          width: '40px',
          opacity: 1
        }
      }}>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <Box
                component="img"
                src={src}
                alt={`Gallery ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
