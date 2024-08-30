// generate-html.js
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Ensure the output directory exists
const outputDir = path.join('dist', 'html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read site data
const siteData = JSON.parse(fs.readFileSync('site.data.json', 'utf-8'));

// Generate HTML files for each page
(async () => {
    for (const page of siteData.pages) {
      const renderedContent = await renderPage(page);
      fs.writeFileSync(path.join('dist', `${page.name.toLowerCase()}.html`), renderedContent);
    }
  })();

// Function to render a page using Puppeteer
async function renderPage(page) {
  const browser = await puppeteer.launch();
  const pageInstance = await browser.newPage();

  // Get the rendered HTML content
  const content = await pageInstance.content();

  await browser.close();
  return content;
}


