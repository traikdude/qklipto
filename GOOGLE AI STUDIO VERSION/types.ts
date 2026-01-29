
export enum ClipType {
  TEXT = 'text',
  CODE = 'code',
  IMAGE = 'image',
}

export interface AIAnalysis {
  summary: string;
  category: string;
  keyPoints: string[];
  explanation?: string;
  sentiment?: string;
}

export interface Clip {
  id: string;
  content: string;
  type: ClipType;
  title: string;
  timestamp: number;
  tags: string[];
  aiAnalysis?: AIAnalysis;
  isFavorite: boolean;
  metadata?: {
    language?: string;
    imageSrc?: string;
  };
}

export type CategoryFilter = 'all' | 'text' | 'code' | 'image' | 'favorites';
