'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Glass, Heart, Record, Sun1, Music, Calendar, Profile2User } from 'iconsax-react';

interface ScheduleItem {
  time: string;
  title: string;
  titleTh: string;
  description?: string;
  icon?: string;
}

interface ParentInfo {
  father?: string;
  mother?: string;
}

interface DressCodeInfo {
  title?: string;
  subtitle?: string;
  colors?: string[];
}

export default function ScheduleSection({
  data,
  eventDate,
  brideParents,
  groomParents,
  dressCode,
  brideName,
  groomName
}: {
  data?: ScheduleItem[];
  eventDate?: Date;
  brideParents?: ParentInfo;
  groomParents?: ParentInfo;
  dressCode?: DressCodeInfo;
  brideName?: string;
  groomName?: string;
}) {
  const scheduleItems = (data && data.length > 0) ? data : [];
  const dressCodeColors = dressCode?.colors || [];
  const formattedDate = eventDate ? dayjs(eventDate).locale('th') : dayjs('2026-10-10').locale('th');

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Calendar variant="Outline" size={36} />;

    // Ceremony Image Icons
    const ceremonyIcons = ['monk', 'water', 'engagement', 'ceremonial', 'dinner', 'food'];
    if (ceremonyIcons.includes(iconName)) {
      return (
        <Box
          component="img"
          src={`/images/icon/${iconName}.png`}
          sx={{ width: 56, height: 56, objectFit: 'contain' }}
        />
      );
    }

    // Legacy Numeric check
    if (/^[1-9]$/.test(iconName)) {
      return (
        <Box
          component="img"
          src={`/images/icon/${iconName}.png`}
          sx={{ width: 56, height: 56, objectFit: 'contain' }}
        />
      );
    }

    switch (iconName) {
      case 'cup': return <Glass variant="Outline" size={36} />;
      case 'ring': return <Profile2User variant="Outline" size={36} />;
      case 'church': return <Record variant="Outline" size={36} />;
      case 'heart': return <Heart variant="Outline" size={36} />;
      case 'shell': return <Sun1 variant="Outline" size={36} />;
      case 'glass': return <Music variant="Outline" size={36} />;
      default: return <Calendar variant="Outline" size={36} />;
    }
  };

  const hasBrideParents = brideParents?.father || brideParents?.mother;
  const hasGroomParents = groomParents?.father || groomParents?.mother;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">

        {/* Invitation Header (The Parents & Formal Invite) */}
        <Box sx={{ mb: { xs: 8, md: 10 }, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            {/* Parents Group - Show if available */}
            {hasBrideParents && (
              <Stack spacing={0.5} alignItems="center">
                {brideParents?.father && (
                  <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.05rem', color: '#1a1a1a', fontWeight: 500 }}>
                    {brideParents.father}
                  </Typography>
                )}
                {brideParents?.mother && (
                  <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.05rem', color: '#1a1a1a', fontWeight: 500 }}>
                    {brideParents.mother}
                  </Typography>
                )}
              </Stack>
            )}

            {/* Decorative "และ" */}
            {hasBrideParents && hasGroomParents && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: '200px' }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'var(--primary-color)', opacity: 0.15 }} />
                <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1rem', color: 'var(--primary-color)', fontStyle: 'italic' }}>
                  และ
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'var(--primary-color)', opacity: 0.15 }} />
              </Box>
            )}

            {hasGroomParents && (
              <Stack spacing={0.5} alignItems="center">
                {groomParents?.father && (
                  <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.05rem', color: '#1a1a1a', fontWeight: 500 }}>
                    {groomParents.father}
                  </Typography>
                )}
                {groomParents?.mother && (
                  <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.05rem', color: '#1a1a1a', fontWeight: 500 }}>
                    {groomParents.mother}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>

          <Box sx={{ mt: 6, maxWidth: '700px', mx: 'auto' }}>
            <Typography sx={{
              fontFamily: '"Prompt", sans-serif',
              fontSize: '1.1rem',
              color: 'rgba(0,0,0,0.7)',
              lineHeight: 1.8,
              fontWeight: 400
            }}>
              มีความยินดีขอเรียนเชิญเพื่อมาเป็นเกียรติ<br />เนื่องในพิธีมงคลสมรส ระหว่าง
            </Typography>

            <Box sx={{ my: 3.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography sx={{
                fontFamily: '"Prompt", sans-serif',
                fontSize: { xs: '1.4rem', md: '2.2rem' },
                color: 'var(--primary-color)',
                fontWeight: 600,
                lineHeight: 1.1
              }}>

                {brideName || "Bride Name"}
              </Typography>

              <Typography sx={{
                fontFamily: 'var(--script-font, "Parisienne", cursive)',
                fontSize: '1.6rem',
                color: 'rgba(0,0,0,0.25)',
                fontStyle: 'italic',
                my: 0.5
              }}>
                &
              </Typography>

              <Typography sx={{
                fontFamily: '"Prompt", sans-serif',
                fontSize: { xs: '1.4rem', md: '2.2rem' },
                color: 'var(--primary-color)',
                fontWeight: 600,
                lineHeight: 1.1
              }}>
                {groomName || "Groom Name"}
              </Typography>
            </Box>


          </Box>
          <Box sx={{ mt: 8, mb: 2 }}>
            <Divider sx={{ maxWidth: '400px', mx: 'auto', borderColor: 'var(--primary-color)', opacity: 0.15 }} />
          </Box>
        </Box>

        {/* Main Content Layout using Box Flex */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 6, md: 10 }
        }}>

          {/* Left Side: Large Date Display */}
          <Box sx={{
            flex: { md: '0 0 35%' },
            position: { md: 'sticky' },
            top: 100,
            height: 'fit-content',
            borderRight: { md: '1.5px solid rgba(142, 125, 93, 0.12)' },
            pr: { md: 8 },
            textAlign: { xs: 'center', md: 'right' }
          }}>
            <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: 500, letterSpacing: '0.1em', mb: 1 }}>
              {formattedDate.format('วันddddที่')}
            </Typography>

            <Typography sx={{ fontFamily: 'var(--script-font, "Parisienne", cursive)', fontSize: { xs: '4rem', md: '5.5rem' }, lineHeight: 0.9, color: '#1a1a1a', fontWeight: 400, mb: 1 }}>
              {formattedDate.format('D')}
            </Typography>

            <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.8rem', color: '#1a1a1a', fontWeight: 300, letterSpacing: '0.05em' }}>
              {formattedDate.format('MMMM')} {formattedDate.add(543, 'year').format('YYYY')}
            </Typography>
          </Box>

          {/* Right Side: Timeline List */}
          <Box sx={{ flex: 1, pl: { xs: 0, md: 2 } }}>
            <Stack spacing={0}>
              {scheduleItems.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                  <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 }, py: 4, position: 'relative' }}>
                    {/* Iconsax Icon */}
                    <Box sx={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', opacity: 0.9, flexShrink: 0 }}>
                      {getIcon(item.icon)}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.1rem', color: 'var(--primary-color)', fontWeight: 600, mb: 0.5 }}>
                        {item.time} น.
                      </Typography>

                      <Typography sx={{ fontFamily: '"Prompt", sans-serif', fontSize: '1.25rem', color: '#1a1a1a', fontWeight: 400, lineHeight: 1.4 }}>
                        {item.titleTh}
                      </Typography>

                      <Typography sx={{ fontFamily: 'var(--script-font, "Parisienne", cursive)', fontSize: '0.95rem', color: 'rgba(0,0,0,0.4)', fontStyle: 'italic', mt: 0.2 }}>
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}

            </Stack>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
