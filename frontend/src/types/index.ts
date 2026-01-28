import { ObjectId } from 'mongodb';

// Projects & Blogs (Static - in Git)
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  features?: string[];
  demoUrl?: string;
  githubUrl?: string;
  status: 'operational' | 'building' | 'published';
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  excerpt: string;
  tags: string[];
  slug: string;
}

// MongoDB Collections (Dynamic)
export interface ProjectStats {
  _id?: ObjectId;
  projectId: string;
  likeCount: number;
  viewCount: number;
  updatedAt: Date;
}

export interface VisitorStats {
  _id: string; // 'global' or 'daily-YYYY-MM-DD'
  count: number;
  updatedAt: Date;
}

export interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub heatmap intensity
}

export interface GitHubContributionData {
  _id?: string; // 'github-contributions'
  username: string;
  totalContributions: number;
  contributions: GitHubContribution[];
  fetchedAt: Date;
  expiresAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface LikeResponse {
  projectId: string;
  likeCount: number;
  isLiked: boolean;
}
