import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 0,
    title: 'APK Sentinel',
    description:
      'Automated Android APK security analysis tool that identifies vulnerabilities, malware signatures, and permission risks in mobile applications.',
    tech: ['Python', 'Flask', 'Docker', 'PostgreSQL'],
  },
  {
    id: 1,
    title: 'ResumeCraft AI',
    description:
      'AI-powered resume builder with premium editorial design, PDF processing, and intelligent content suggestions for professional documents.',
    tech: ['React', 'TypeScript', 'Vite', 'Framer Motion'],
  },
  {
    id: 2,
    title: 'Security Dashboard',
    description:
      'Real-time cybersecurity monitoring dashboard with threat visualization, incident tracking, and automated alert systems.',
    tech: ['React', 'D3.js', 'Node.js', 'WebSocket'],
  },
  {
    id: 3,
    title: 'Portfolio Platform',
    description:
      'This portfolio — a cinematic, interactive video editor showcase built with modern tools and scroll-driven SVG animations.',
    tech: ['React', 'TypeScript', 'GSAP', 'Tailwind CSS'],
  },
];
