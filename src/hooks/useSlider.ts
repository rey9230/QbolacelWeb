import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://api.qbolacel.com/api/v1';

// Types based on the API response
export interface SliderVisual {
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  aspectRatio: string;
  title?: string;
  subtitle?: string;
  overlayText?: string;
  ctaText?: string;
}

export interface SliderLink {
  action: 'external' | 'internal' | 'whatsapp';
  url?: string;
  keepCurrentFilters?: boolean;
  phoneNumber?: string;
  message?: string;
}

export interface SliderPreset {
  presetType: string;
  payload: {
    url: string;
    title: string;
    subtitle: string;
    overlayText?: string;
    aspectRatio: string;
    mediaType: string;
  };
}

export interface SliderItem {
  id: string;
  kind: string;
  slot: number;
  config: {
    backgroundColor: string;
    visual?: SliderVisual;
  };
  media: unknown | null;
  promo: unknown | null;
  link: SliderLink | null;
  product: unknown | null;
  preset: SliderPreset | null;
}

export interface SliderSection {
  id: string;
  type: string;
  order: number;
  title: string | null;
  config: {
    backgroundColor: string;
  };
  items: SliderItem[];
}

export interface SliderVersion {
  id: string;
  pageId: string;
  number: number;
  createdBy: string;
  createdAt: string;
  publishedAt: string;
  note: string;
  version: string;
  sections: SliderSection[];
}

export interface SliderPage {
  id: string;
  title: string;
  slug: string;
  route: string;
  description: string | null;
  currentVersionId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SliderResponse {
  page: SliderPage;
  version: SliderVersion;
}

async function fetchSlider(): Promise<SliderResponse> {
  const response = await fetch(`${API_BASE_URL}/public/pages/web-slider`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch slider data');
  }

  return response.json();
}

export function useSlider() {
  return useQuery({
    queryKey: ['web-slider'],
    queryFn: fetchSlider,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
