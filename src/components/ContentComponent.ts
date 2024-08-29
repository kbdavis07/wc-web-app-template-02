import SiteDataService from '../services/SiteDataService.js';
import { SiteData, PageData } from '../types.js';

export class ContentComponent extends HTMLElement {
  private siteDataService = SiteDataService.getInstance();
  private siteData: SiteData | null = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    await this.loadSiteData();
    this.renderContent();
    this.setupRouter();
  }

  private async loadSiteData() {
    try {
      this.siteData = await this.siteDataService.getSiteData();
    } catch (error) {
      console.error('Failed to load site data:', error);
    }
  }

  private renderContent() {
    if (!this.siteData) return;

    this.siteData.pages.forEach(page => {
      const section = document.createElement('section');
      section.id = page.name.toLowerCase();
      section.innerHTML = page.content;
      section.style.display = 'none';
      this.appendChild(section);
    });
  }

  private setupRouter() {
    window.addEventListener('popstate', () => this.updateContentVisibility());
    this.updateContentVisibility();
  }

  private updateContentVisibility() {
    if (!this.siteData) return;

    const path = window.location.pathname.slice(1) || 'home';
    this.siteData.pages.forEach(page => {
      const section = this.querySelector(`#${page.name.toLowerCase()}`) as HTMLElement;
      if (section) {
        section.style.display = page.name.toLowerCase() === path ? 'block' : 'none';
      }
    });
  }
}

customElements.define('main-content', ContentComponent);