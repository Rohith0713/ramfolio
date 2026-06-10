import type { Milestone } from '../types';

export const milestones: Milestone[] = [
  {
    id: 0,
    label: 'Short Form Content',
    description: 'Scroll-stopping short form content optimized for engagement and viral potential.',
    percentage: 2 / 13,
    icon: '📱',
    tech: ['Reels', 'Shorts', 'TikTok'],
    videos: [
      { title: 'Charminar', author: 'Rohith', src: 'https://www.youtube.com/embed/ILU-zrD3mkM' },
      { title: 'Earth', author: 'Rohith', src: 'https://www.youtube.com/embed/9Ka0SHnGFvc' },
      { title: 'Motor Bike', author: 'Rohith', src: 'https://www.youtube.com/embed/3xxG6FKFRfE' },
      { title: 'My Reel 2', author: 'Rohith', src: 'https://www.youtube.com/embed/iZkXPlAtEls' },
      { title: 'Petrol Pump', author: 'Rohith', src: 'https://www.youtube.com/embed/jH5MVjnIKBM' },
      { title: 'Sky Reel', author: 'Rohith', src: 'https://www.youtube.com/embed/OEEPGTCfS6w' },
      { title: 'Cinematic Reel 1', author: 'Rohith', src: 'https://www.youtube.com/embed/OwCEwVRCgLc' },
    ],
  },
  {
    id: 1,
    label: 'Long Form Content',
    description: 'Cinematic long form videos with professional color grading and engaging storytelling.',
    percentage: 6 / 13,
    icon: '🎬',
    tech: ['YouTube', 'Documentaries', 'Vlogs'],
    videos: [
      { title: 'Long Form Film 1', author: 'Rohith', src: 'https://www.youtube.com/embed/hjxbIVF2ypI', orientation: 'landscape' },
      { title: 'Long Form Film 2', author: 'Rohith', src: 'https://www.youtube.com/embed/0vwVwK3iCsc', orientation: 'landscape' },
      { title: 'Long Form Film 3', author: 'Rohith', src: 'https://www.youtube.com/embed/7XGwEwGCEFM', orientation: 'landscape' },
      { title: 'Long Form Film 4', author: 'Rohith', src: 'https://www.youtube.com/embed/uX6vtL_Ul1Q', orientation: 'landscape' },
    ],
  },
  {
    id: 2,
    label: 'Motion Graphics Content',
    description: 'Dynamic motion graphics and VFX to bring ideas to life with premium visual appeal.',
    percentage: 10 / 13,
    icon: '✨',
    tech: ['After Effects', 'Animation', 'VFX'],
    videos: [
      { title: 'Motion Graphic Reel', author: 'Rohith', src: 'https://www.youtube.com/embed/bTDb5WdzKdE' },
    ],
  },
];
