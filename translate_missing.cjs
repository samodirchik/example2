const fs = require('fs');
const translate = require('google-translate-api-x').default || require('google-translate-api-x');

async function safeTranslate(text) {
    if (!text || text.trim() === '') return text;
    try {
        let res = await translate(text, { to: 'uk' });
        await new Promise(r => setTimeout(r, 1000));
        return res.text;
    } catch (e) {
        console.error("Single translation failed:", e.message);
        return text;
    }
}

async function translateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Change lang='ru' to lang='ua'
    content = content.replace(/const lang = 'ru';/, "const lang = 'ua';");
    content = content.replace(/href="\/ru"/, 'href="/"');
    content = content.replace(/>Главная</, '>Головна<');
    
    // Title
    let titleMatch = content.match(/title="([^"]+)"/);
    if (titleMatch) {
        let translatedTitle = await safeTranslate(titleMatch[1]);
        content = content.replace(titleMatch[0], `title="${translatedTitle}"`);
    }

    // Description
    let descMatch = content.match(/description="([^"]+)"/);
    if (descMatch) {
        let translatedDesc = await safeTranslate(descMatch[1]);
        content = content.replace(descMatch[0], `description="${translatedDesc}"`);
    }

    // H1
    let h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1Match) {
        let translatedH1 = await safeTranslate(h1Match[1].trim());
        content = content.replace(h1Match[1], '\n          ' + translatedH1 + '\n        ');
    }

    // Breadcrumb
    let breadMatch = content.match(/<li class="text-\[var\(--color-text-main\)\]">\s*([\s\S]*?)\s*<\/li>/);
    if (breadMatch) {
        let translatedBread = await safeTranslate(breadMatch[1].trim());
        content = content.replace(breadMatch[1], '\n            ' + translatedBread + '\n          ');
    }

    // Prose
    let proseMatch = content.match(/<div class="prose[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/);
    if (proseMatch) {
        let htmlContent = proseMatch[1];
        const chunks = htmlContent.split(/(<\/p>|<\/h2>|<\/li>)/g);
        let translatedContent = '';
        let currentChunk = '';
        
        for (let i = 0; i < chunks.length; i++) {
            currentChunk += chunks[i];
            if (chunks[i].startsWith('</') || i === chunks.length - 1) {
                if (currentChunk.length > 500 || i === chunks.length - 1) {
                    let tc = await safeTranslate(currentChunk);
                    translatedContent += tc;
                    currentChunk = '';
                }
            }
        }
        content = content.replace(htmlContent, translatedContent);
    }

    fs.writeFileSync(filePath, content);
    console.log("Translated:", filePath);
}

async function run() {
    await translateFile('/Users/macbookpro/project/prussakoff_site/prussakoff_v2/src/pages/dezinfekciya-ua/virusy-i-bakterii-ua.astro');
    await translateFile('/Users/macbookpro/project/prussakoff_site/prussakoff_v2/src/pages/dezinfekciya-ua/plesen-i-gribok-ua.astro');
}
run();
