export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  active: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  email: string;
  location: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
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
