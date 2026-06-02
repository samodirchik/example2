const fs = require('fs');
const path = require('path');

const sourceDir = '/Users/macbookpro/project/prussakoff_site/prussakoff.dp.ua';
const targetDir = '/Users/macbookpro/project/prussakoff_site/prussakoff_v2/src/pages';

function traverseTarget(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseTarget(fullPath);
        } else if (fullPath.endsWith('.astro') && fullPath !== path.join(targetDir, 'index.astro')) {
            restoreImagesInFile(fullPath);
        }
    }
}

function restoreImagesInFile(astroPath) {
    let astroContent = fs.readFileSync(astroPath, 'utf-8');
    
    let relativePath = path.relative(targetDir, astroPath);
    let baseName = relativePath.replace('.astro', ''); 
    
    let sourceHtmlPath = path.join(sourceDir, baseName, 'index.html');
    if (!fs.existsSync(sourceHtmlPath)) {
        let ruBaseName = baseName.replace(/-ua/g, '-ru');
        sourceHtmlPath = path.join(sourceDir, ruBaseName, 'index.html');
        if (!fs.existsSync(sourceHtmlPath)) {
            // Some generic pages might not match directory layout directly, skip if not found
            return;
        }
    }

    let sourceHtml = fs.readFileSync(sourceHtmlPath, 'utf-8');
    
    const imgRegex = /<img[^>]+>/gi;
    const sourceImgs = [];
    let match;
    while ((match = imgRegex.exec(sourceHtml)) !== null) {
        let img = match[0];
        let idMatch = img.match(/wp-image-\d+/);
        if (idMatch) {
            sourceImgs.push({ id: idMatch[0], full: img });
        } else if (img.includes('wp-content')) {
            // Fallback: match by filename
            let srcMatch = img.match(/src="([^"]+)"/);
            if (srcMatch) {
                let filename = path.basename(srcMatch[1]);
                sourceImgs.push({ id: filename, full: img });
            }
        }
    }
    
    let modified = false;
    astroContent = astroContent.replace(/<img[^>]+>/gi, (astroImg) => {
        let matchedSrcImgObj = null;
        
        let idMatch = astroImg.match(/wp-image-\d+/);
        if (idMatch) {
            matchedSrcImgObj = sourceImgs.find(s => s.id === idMatch[0]);
        } else {
            // Fallback to searching by some substring in the mangled src
            let srcMatch = astroImg.match(/src="([^"]+)"/);
            if (srcMatch) {
                let mangledSrc = srcMatch[1];
                matchedSrcImgObj = sourceImgs.find(s => s.id !== undefined && mangledSrc.includes(s.id));
            }
        }
        
        if (matchedSrcImgObj) {
            modified = true;
            let fig = matchedSrcImgObj.full;
            // Fix local paths
            fig = fig.replace(/src="(?:\.\.\/)*\/?(wp-content\/.*?)"/g, 'src="https://prussakoff.dp.ua/$1"');
            fig = fig.replace(/srcset="(.*?)"/g, (m, p1) => {
                let newSrcset = p1.split(',').map(part => {
                    let p = part.trim();
                    let parts = p.split(/\s+/);
                    if (parts.length > 0) {
                        let url = parts[0];
                        if (url.includes('wp-content')) {
                            url = url.replace(/^(?:\.\.\/)*\/?wp-content/, 'https://prussakoff.dp.ua/wp-content');
                        }
                        parts[0] = url;
                        return parts.join(' ');
                    }
                    return p;
                }).join(', ');
                return `srcset="${newSrcset}"`;
            });
            // Ensure style is added for layout compatibility
            if (!fig.includes('style=')) {
                fig = fig.replace('<img ', '<img style="aspect-ratio:16/9;object-fit:cover" ');
            }
            return fig;
        }
        
        return astroImg;
    });

    if (modified) {
        fs.writeFileSync(astroPath, astroContent, 'utf-8');
        console.log("Restored images in:", path.basename(astroPath));
    }
}

traverseTarget(targetDir);
console.log('Done restoring images from original source!');
