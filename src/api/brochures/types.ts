export interface BrochureItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface ContentBlock {
  id: string;
  title: string;
  items: BrochureItem[];
}

export interface BrochureSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface BrochureSectionResponse {
  success: boolean;
  data: BrochureSection;
  message: string;
}

export interface BrochureState {
  sections: BrochureSection[];
  isLoading: boolean;
  error: string | null;
}
