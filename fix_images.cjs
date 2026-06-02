const fs = require('fs');
const path = require('path');

function fixImagesInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Fix missing closing quote on src before alt
    content = content.replace(/src="([^"]+?)\s+alt="/g, 'src="$1" alt="');
    
    // Fix src attribute pointing to local /wp-content or ../../wp-content
    content = content.replace(/src="(?:\.\.\/)*\/?(wp-content\/.*?)"/g, 'src="https://prussakoff.dp.ua/$1"');
    
    // Fix srcset attribute having local ../../wp-content or /wp-content
    content = content.replace(/srcset="(.*?)"/g, (match, p1) => {
        let newSrcset = p1.split(',').map(part => {
            let p = part.trim();
            // Split by space to separate URL and size (e.g., "url 1024w")
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
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed:', filePath);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.astro')) {
            fixImagesInFile(fullPath);
        }
    }
}

traverse(path.join(__dirname, 'src', 'pages'));
console.log('Fixed images!');
