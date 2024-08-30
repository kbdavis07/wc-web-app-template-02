import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

function buildProject() {
    
    // Compile TypeScript
    exec('tsc', (error, stdout, stderr) => {if (error) {console.error(`💥 TypeScript compilation error!: ${error} 💥`); return;}
        
    console.log('TypeScript compiled successfully 😊');

    // Get the directory name
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
        
    console.log(__dirname);

    // Combine CSS files
    const cssDir = path.join(__dirname, '..', 'src', 'styles');

    console.log("Css Dir:", cssDir);

    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));

    console.log("Css Files:", cssFiles);

    const combinedCss = cssFiles.map(file => fs.readFileSync(path.join(cssDir, file), 'utf8')).join('\n');
        
    fs.writeFileSync(path.join(__dirname, '..', 'bundled.css'), combinedCss);

    // Define paths
    const srcIndexPath = path.join(__dirname, '..', 'index.html');
    const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');

    // Move index.html to /dist folder
    fs.copyFileSync(srcIndexPath, distIndexPath);
    
    // Read index.html from /dist folder
    let indexHtml = fs.readFileSync(distIndexPath, 'utf8');

    // Replace the script tag
    indexHtml = indexHtml.replace('<script type="module" src="/src/index.ts"></script>', '<script type="module" src="index.js"></script>');

    // Save the modified index.html back to /dist folder
    fs.writeFileSync(distIndexPath, indexHtml);

    fs.copyFileSync(path.join(__dirname, '..', 'public', 'pages.json'),path.join(__dirname, '..', 'dist', 'pages.json'));
    fs.copyFileSync(path.join(__dirname, '..', 'public', 'manifest.json'),path.join(__dirname, '..', 'dist', 'manifest.json'));

    console.log('Build has completed successfully and now ready to deploy the dist folder! 🚀 😊');

    });
}

buildProject();
