export interface Profile {
  id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  email: string;
  location: string | null;
  role: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  url: string;
  alt: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}
