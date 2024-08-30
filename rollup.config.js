import html from 'rollup-plugin-html';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';

// Read site data
const siteData = JSON.parse(fs.readFileSync('pages.json', 'utf-8'));

// Generate HTML files for each page
const htmlPlugins = siteData.pages.map(page => {
  return html({
    fileName: `${page.name.toLowerCase()}.html`,
    template: () => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${page.title}</title>
        <meta name="description" content="${page.description}">
        <meta name="keywords" content="${page.keywords}">
      </head>
      <body>
        <main-content></main-content>
        <script src="bundle.js"></script>
      </body>
      </html>
    `
  });
});

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    plugins: [terser()]
  },
  plugins: [
    json(),
    ...htmlPlugins
  ]
};