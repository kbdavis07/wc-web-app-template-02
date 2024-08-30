export interface PageData {
  name: string;
  content: string;
  title: string;
  description: string;
  keywords: string;
}

export interface SiteData {
  pages: PageData[];
}