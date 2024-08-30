// SiteDataService.ts
import { SiteData } from '../types.js';

class SiteDataService {
  private static instance: SiteDataService;
  private siteData: SiteData | null = null;

  private constructor() {}

  public static getInstance(): SiteDataService {
    if (!SiteDataService.instance) {
      SiteDataService.instance = new SiteDataService();
    }
    return SiteDataService.instance;
  }

  public async getSiteData(): Promise<SiteData> {
    if (this.siteData) {
      return this.siteData;
    }

    try {
      const response = await fetch('/pages.json');
      this.siteData = await response.json() as SiteData;
      return this.siteData;
    } catch (error) {
      console.error('Failed to load site data:', error);
      throw error;
    }
  }
}

export default SiteDataService;