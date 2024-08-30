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
    this.setupLinkInterception();
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

    // Add a section for "Page Not Found"
    const notFoundSection = document.createElement('section');
    notFoundSection.id = 'not-found';
    notFoundSection.innerHTML = '<h1>404 Page Not Found</h1><p>The page you are looking for does not exist.</p>';
    notFoundSection.style.display = 'none';
    this.appendChild(notFoundSection);
  }

  private setupRouter() {
    window.addEventListener('popstate', () => {
      this.updateContentVisibility();
      this.updateMetaTags();
    });
    this.updateContentVisibility();
    this.updateMetaTags();
  }

  private setupLinkInterception() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
        event.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          history.pushState(null, '', href);
          this.updateContentVisibility();
          this.updateMetaTags();
        }
      }
    });
  }

  private updateContentVisibility() {
    if (!this.siteData) return;

    const path = window.location.pathname.slice(1) || 'home';
    let pageFound = false;

    this.siteData.pages.forEach(page => {
      const section = this.querySelector(`#${page.name.toLowerCase()}`) as HTMLElement;
      if (section) {
        const isCurrentPage = page.name.toLowerCase() === path;
        section.style.display = isCurrentPage ? 'block' : 'none';
        if (isCurrentPage) {
          pageFound = true;
        }
      }
    });

    // Show "Page Not Found" if no page matches the current path
    const notFoundSection = this.querySelector('#not-found') as HTMLElement;
    if (notFoundSection) {
      notFoundSection.style.display = pageFound ? 'none' : 'block';
    }
  }

  private updateMetaTags() {
    if (!this.siteData) return;

    const path = window.location.pathname.slice(1) || 'home';
    const page = this.siteData.pages.find(p => p.name.toLowerCase() === path);

    if (page) {
      document.title = page.title || 'Default Title';
      this.updateMetaTag('description', page.description || 'Default description');
      this.updateMetaTag('keywords', page.keywords || 'default, keywords');
    } else {
      document.title = '404 Page Not Found';
      this.updateMetaTag('description', 'The page you are looking for does not exist.');
      this.updateMetaTag('keywords', '404, page not found, error');
    }
  }

  private updateMetaTag(name: string, content: string) {
    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }
}

customElements.define('main-content', ContentComponent);