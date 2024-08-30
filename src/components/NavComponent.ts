import { SiteData } from '../types.js';

export class NavComponent extends HTMLElement {
  private siteData: SiteData | null = null;

  async connectedCallback() {
    await this.loadSiteData();
    this.render();
  }

  private async loadSiteData() {
    try {
      const response = await fetch('/pages.json');
      this.siteData = await response.json() as SiteData;
    } catch (error) {
      console.error('Failed to load site data:', error);
    }
  }

  private render() {
    if (!this.siteData) return;

    const links = this.siteData.pages.map(page => {
      const path = page.name.toLowerCase() === 'home' ? '/' : `/${page.name.toLowerCase()}`;
      return `<a href="${path}">${page.name}</a>`;
    }).join('');

    this.innerHTML = `<nav>${links}</nav>`;
  }
}

customElements.define('nav-component', NavComponent);