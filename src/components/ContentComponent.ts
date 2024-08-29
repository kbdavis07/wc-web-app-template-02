import { SimplrRouter, SimplrRouterOptions } from "@simplr-wc/router";
import { SiteData, PageData } from '../types.js';

export class ContentComponent extends HTMLElement {
  private router!: SimplrRouter;
  private siteData: SiteData | null = null;

  constructor() {
    super();
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
      name: page.name,
      path: page.name.toLowerCase() === 'home' ? '/' : `/${page.name.toLowerCase()}`,
      component: `${page.name.toLowerCase()}-component`,
      import: () => Promise.resolve({ default: this.createComponent(page) }),
    }));

    const routerOptions: SimplrRouterOptions = {
      routes,
      transitionSpeed: 50,
    };

    this.router = new SimplrRouter(routerOptions);
    this.router.init();
  }

  private createComponent(page: PageData) {
    return class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = page.content;
      }
    };
  }
}

customElements.define('main-content', ContentComponent);