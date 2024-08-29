# Refactored TypeScript Web Components Project Guide

This guide details a refactored web application using TypeScript and Web Components. The app uses a single `ContentComponent` that dynamically loads content based on the current URL, using data from a JSON file.

## Project Structure

```
src/
  components/
    ContentComponent.ts
    NavComponent.ts
  index.ts
  types.ts
index.html
site.data.json
package.json
tsconfig.json
web-dev-server.config.js
```

## File Contents

### 1. src/types.ts

```typescript
export interface PageData {
  name: string;
  content: string;
}

export interface SiteData {
  pages: PageData[];
}
```

### 2. src/components/ContentComponent.ts

```typescript
import { Router } from '@simplr-wc/router';
import { SiteData, PageData } from '../types.js';

export class ContentComponent extends HTMLElement {
  private router: Router;
  private siteData: SiteData | null = null;

  constructor() {
    super();
    this.router = new Router(this);
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
```

### 3. src/components/NavComponent.ts

```typescript
import { SiteData } from '../types.js';

export class NavComponent extends HTMLElement {
  private siteData: SiteData | null = null;

  async connectedCallback() {
    await this.loadSiteData();
    this.render();
  }

  private async loadSiteData() {
    try {
      const response = await fetch('/site.data.json');
      this.siteData = await response.json() as SiteData;
    } catch (error) {
      console.error('Failed to load site data:', error);
    }
  }

  private render() {
    if (!this.siteData) return;

    const links = this.siteData.pages.map(page => {
      const path = page.name === 'home' ? '/' : `/${page.name}`;
      return `<a href="${path}">${page.name}</a>`;
    }).join('');

    this.innerHTML = `<nav>${links}</nav>`;
  }
}

customElements.define('nav-component', NavComponent);
```

### 4. src/index.ts

```typescript
import './components/ContentComponent.js';
import './components/NavComponent.js';
```

### 5. index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Content Web App</title>
    <script type="module" src="/src/index.ts"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        nav {
            background-color: #333;
            padding: 1rem;
        }
        nav a {
            color: white;
            text-decoration: none;
            margin-right: 1rem;
        }
        main {
            padding: 2rem;
        }
    </style>
</head>
<body>
    <nav-component></nav-component>
    <main-content></main-content>
</body>
</html>
```

### 6. site.data.json

```json
{
  "pages": [
    {
      "name": "home",
      "content": "<h1>Welcome to the Home Page</h1><p>This is the main content of the home page.</p>"
    },
    {
      "name": "about",
      "content": "<h1>About Us</h1><p>This is the about page content.</p>"
    },
    {
      "name": "resume",
      "content": "<h1>Resume</h1><p>This is where you can find my resume.</p>"
    }
  ]
}
```

## How It Works

1. The `types.ts` file defines the structure of our site data, aiding in type checking and code completion.

2. The `ContentComponent`:
   - Loads the site data from the JSON file.
   - Sets up routes based on the pages in the site data.
   - Renders the appropriate content when a route is accessed.

3. The `NavComponent` loads the site data and dynamically generates navigation links based on the pages in the data.

4. The `index.ts` file imports the two components.

5. The `index.html` file uses the `<main-content>` and `<nav-component>` elements.

6. The `site.data.json` file contains all the page data, separating the content from the application logic.

## Advantages

- More DRY: No need for separate components for each page.
- More flexible: Adding a new page only requires updating the JSON file.
- Separates data from presentation: All content is in the JSON file, making it easier to update or localize.
- Smaller and simpler: The application logic is concentrated in fewer files.

## Usage

1. Update your project files as shown above.
2. Ensure your `site.data.json` file is in the root directory of your project.
3. Start the development server:
   ```
   npm start
   ```

The application will now load content dynamically based on the URL, using data from the JSON file.

## Potential Improvements

1. **Error handling**: Add more robust error handling, especially for cases where a requested page doesn't exist in the JSON data.

2. **Loading indicator**: Implement a loading indicator to improve user experience during asynchronous content loading.

3. **Caching**: If the site data is large, implement caching to avoid reloading it on every navigation.

4. **Content sanitization**: If the content in your JSON includes HTML, implement sanitization to prevent XSS attacks.

5. **SEO considerations**: This approach might not be ideal for SEO as the content is loaded dynamically. Consider implementing server-side rendering or using appropriate meta tags for better SEO.

## Conclusion

This refactored version offers a more streamlined and maintainable approach to building a simple web application with TypeScript and Web Components. It separates concerns effectively, making it easier to update content without changing the application logic.
