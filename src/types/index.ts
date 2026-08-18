export type ToolCategory = 'image' | 'text' | 'calculator' | 'generator' | 'converter';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
  metaTitle: string;
  metaDescription: string;
  howToUse: string[];
  features: string[];
  faqs: ToolFaq[];
  relatedToolSlugs: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export type AdSlotType = 'TopAd' | 'ToolTopAd' | 'ToolBottomAd' | 'ContentAd';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
