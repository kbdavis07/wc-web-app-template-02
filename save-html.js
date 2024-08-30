import { startDevServer } from '@web/dev-server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  // Start the dev server
  const server = await startDevServer({
    config: {
      rootDir: './', // Adjust the root directory as needed
      port: 8080,
    },
  });

  // List of pages to save
  const pages = ['/', '/about', '/contact']; // Add your page routes here

  // Launch Puppeteer with the bundled Chromium
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(), // Use Puppeteer's bundled Chromium
  });
  const page = await browser.newPage();

  for (const route of pages) {
    const url = `http://localhost:8080${route}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    const html = await page.content();
    const filePath = path.join(__dirname, `${route === '/' ? 'index' : route}.html`);
    fs.writeFileSync(filePath, html);
    console.log(`Saved ${url} to ${filePath}`);
  }

  await browser.close();
  server.stop();
})();