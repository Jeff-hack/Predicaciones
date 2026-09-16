export interface SermonOutline {
  intro: string;
  points: {
    title: string;
    content: string;
  }[];
  conclusion: string;
  application?: string;
}

export interface Sermon {
  id: string;
  title: string;
  theme: string;
  date: string; // ISO format: '2026-09-07'
  displayDate: string; // '07/09/2026'
  scripture: string;
  bibleBook: string;
  testament: 'AT' | 'NT';
  preacher: string;
  category: 'Predicación' | 'Estudio Bíblico' | 'Conferencia';
  tags: string[];
  file: string;
  fileSize?: string;
  pageCount?: number;
  description: string;
  proposition: string;
  outline?: SermonOutline;
}

export type ViewType = 'catalogo' | 'series' | 'indice' | 'predicadores';

export interface FilterOptions {
  search: string;
  dateRange: string;
  theme: string;
  category: string;
  sort: 'recent' | 'oldest' | 'title-asc' | 'title-desc';
}
