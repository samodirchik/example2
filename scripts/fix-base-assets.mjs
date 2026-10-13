import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.css') || entry.name.endsWith('.js'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace absolute public asset paths with /example2/ prefix
      if (content.includes('"/images/')) {
        content = content.replaceAll('"/images/', '"/example2/images/');
        changed = true;
      }
      if (content.includes("'/images/")) {
        content = content.replaceAll("'/images/", "'/example2/images/");
        changed = true;
      }
      if (content.includes('url(/images/')) {
        content = content.replaceAll('url(/images/', 'url(/example2/images/');
        changed = true;
      }
      if (content.includes('url("/images/')) {
        content = content.replaceAll('url("/images/', 'url("/example2/images/');
        changed = true;
      }

      if (content.includes('"/wp-content/')) {
        content = content.replaceAll('"/wp-content/', '"/example2/wp-content/');
        changed = true;
      }
      if (content.includes("'/wp-content/")) {
        content = content.replaceAll("'/wp-content/", "'/example2/wp-content/");
        changed = true;
      }

      // Handle srcset where paths might be separated by space
      // e.g. /images/wp-content/...
      content = content.replace(/(srcset=")([^"]+)(")/g, (match, p1, p2, p3) => {
        const updated = p2.replace(/(^|,\s*)(\/(images|wp-content)\/)/g, '$1/example2/$3/');
        if (updated !== p2) changed = true;
        return p1 + updated + p3;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir(distDir);

// Ensure .nojekyll exists
const nojekyllPath = path.join(distDir, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '', 'utf8');
}

console.log('✓ Successfully post-processed dist/ for GitHub Pages /example2');
