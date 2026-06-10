/* ═══════════════════════════════════════════════════════
   SHARED TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════ */

export interface VideoClip {
  title: string;
  author: string;
  src: string;
  orientation?: 'portrait' | 'landscape';
}

export interface Milestone {
  id: number;
  label: string;
  description: string;
  percentage: number; // 0–1 position along the SVG path
  icon: React.ReactNode;
  tech?: string[];
  videos?: VideoClip[];
}

export interface Skill {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  image?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
