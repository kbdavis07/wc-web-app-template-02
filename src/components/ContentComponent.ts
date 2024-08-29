// import { Router } from '@simplr-wc/router';
import { SimplrRouter, SimplrRouterOptions } from "@simplr-wc/router";
import { SiteData, PageData } from '../types.js';

export class ContentComponent extends HTMLElement {
  private router: SimplrRouter;
  private siteData: SiteData | null = null;

  constructor() {
    super();
    this.router = new SimplrRouter(this);
  }

  async connectedCallback() {
    await this.loadSiteData();
    this.setupRouter();
  }

  private async loadSiteData() {
    try {
      const response = await fetch('/site.data.json');
      this.siteData = await response.json() as SiteData;
    } catch (error) {
      console.error('Failed to load site data:', error);
    }
  }

  private setupRouter() {
    if (!this.siteData) return;

    const routes = this.siteData.pages.map(page => ({
      path: page.name === 'home' ? '/' : `/${page.name}`,
      callback: () => this.renderContent(page)
    }));

    this.router.setRoutes(routes);
  }

  private renderContent(page: PageData) {
    this.innerHTML = page.content;
  }
}

customElements.define('main-content', ContentComponent);