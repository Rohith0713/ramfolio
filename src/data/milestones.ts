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
      { title: 'Charminar', author: 'Rohith', src: '/videos/short_form_content/charminar.mp4' },
      { title: 'Earth', author: 'Rohith', src: '/videos/short_form_content/earth.mp4' },
      { title: 'Motor Bike', author: 'Rohith', src: '/videos/short_form_content/motor bike.mp4' },
      { title: 'My Reel 2', author: 'Rohith', src: '/videos/short_form_content/my reel2.mp4' },
      { title: 'Petrol Pump', author: 'Rohith', src: '/videos/short_form_content/petrol pump.mp4' },
      { title: 'Sky Reel', author: 'Rohith', src: '/videos/short_form_content/sky reel.mp4' },
      { title: 'Cinematic Reel 1', author: 'Rohith', src: '/videos/short_form_content/VID_20250703141003.mp4' },
      { title: 'Cinematic Reel 2', author: 'Rohith', src: '/videos/short_form_content/VID_20250703141116.mp4' },
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
      { title: 'Long Form Film 1', author: 'Rohith', src: '/videos/Long _form_content/1.mp4', orientation: 'landscape' },
      { title: 'Long Form Film 2', author: 'Rohith', src: '/videos/Long _form_content/2.mov', orientation: 'landscape' },
      { title: 'Long Form Film 3', author: 'Rohith', src: '/videos/Long _form_content/3.mp4', orientation: 'landscape' },
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
      { title: 'Motion Graphic Reel', author: 'Rohith', src: '/videos/Some_graphics_content/motion graphic reel.mp4' },
    ],
  },
];
