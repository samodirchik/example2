const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x').default || require('google-translate-api-x');

const sourceDir = '/Users/macbookpro/project/prussakoff_site/prussakoff.dp.ua';
const targetDir = '/Users/macbookpro/project/prussakoff_site/prussakoff_v2/src/pages';

async function extractData(html, lang) {
    let titleMatch = html.match(/<title>(.*?)<\/title>/is);
    let title = titleMatch ? titleMatch[1].trim() : '';

    let descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/is);
    let description = descMatch ? descMatch[1].trim() : '';

    let h1Match = html.match(/<h1 class="title_page">\s*([\s\S]*?)\s*<\/h1>/is);
    let h1 = h1Match ? h1Match[1].trim() : '';

    // Fix H1 if it's broken
    if (h1.includes('<')) h1 = h1.replace(/<[^>]+>/g, '').trim();

    let contentMatch = html.match(/<div class="block_center page_content_text_full">([\s\S]*?)<a class="page_lang_link"/is);
    let content = contentMatch ? contentMatch[1].trim() : '';

    if (!content) {
        let altContentMatch = html.match(/<div class="block_center page_content_text_full">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/header>/is);
        if (altContentMatch) content = altContentMatch[1].trim();
    }

    // Fix image paths
    content = content.replace(/src="\.\.\/\.\.\/wp-content/g, 'src="/wp-content');
    content = content.replace(/srcset="\.\.\/\.\.\/wp-content/g, 'srcset="/wp-content');

    // Extract breadcrumbs name (usually the last span)
    let breadcrumbMatch = html.match(/<span class="name_page">(.*?)<\/span>/is);
    let breadcrumb = breadcrumbMatch ? breadcrumbMatch[1].trim() : '';

    // TRANSLATION LOGIC
    console.log(`Translating to ${lang}...`);
    try {
        const toLang = lang === 'ua' ? 'uk' : 'ru';
        const opts = { to: toLang, forceBatch: false, rejectOnPartialFail: false };
        
        async function safeTranslate(text) {
            if (!text) return text;
            try {
                // simple retry logic
                let res = await translate(text, opts);
                await new Promise(r => setTimeout(r, 1000));
                return res.text;
            } catch (e) {
                console.error("Single translation failed:", e.message);
                return text;
            }
        }

        if (title) title = await safeTranslate(title);
        if (description) description = await safeTranslate(description);
        if (h1) h1 = await safeTranslate(h1);
        if (breadcrumb) breadcrumb = await safeTranslate(breadcrumb);
        
        if (content) {
            // Split content into chunks by </p> or </h2> to avoid 5000 char limit
            const chunks = content.split(/(<\/p>|<\/h2>|<\/li>)/g);
            let translatedContent = '';
            let currentChunk = '';
            
            for (let i = 0; i < chunks.length; i++) {
                currentChunk += chunks[i];
                // if we hit a split tag, and currentChunk is getting big, or it's the last chunk
                if (chunks[i].startsWith('</') || i === chunks.length - 1) {
                    if (currentChunk.length > 2000 || i === chunks.length - 1) {
                        let tc = await safeTranslate(currentChunk);
                        translatedContent += tc;
                        currentChunk = '';
                    }
                }
            }
            content = translatedContent;
        }

    } catch (e) {
        console.error("Translation failed:", e);
    }

    return { title, description, h1, content, breadcrumb };
}

async function processDirectory(baseDir, lang, folderNameParam) {
    if (!fs.existsSync(baseDir)) return;

    const items = fs.readdirSync(baseDir);
    for (const item of items) {
        const itemPath = path.join(baseDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            const indexPath = path.join(itemPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                console.log(`Processing ${indexPath}`);
                const html = fs.readFileSync(indexPath, 'utf-8');
                const data = await extractData(html, lang);
                
                // Create astro file
                let destFolder = path.join(targetDir, folderNameParam);
                
                if (!fs.existsSync(destFolder)) {
                    fs.mkdirSync(destFolder, { recursive: true });
                }

                const destFile = path.join(destFolder, `${item}.astro`);
                
                // For layout
                const homeLink = lang === 'ru' ? '/ru' : '/';
                const homeText = lang === 'ru' ? 'Главная' : 'Головна';

                const astroContent = `---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import ConsultationForm from '../../components/sections/ConsultationForm.astro';
import ParticleBackground from '../../components/ParticleBackground.astro';

const lang = '${lang}';
---

<Layout title="${data.title.replace(/"/g, '&quot;')}" description="${data.description.replace(/"/g, '&quot;')}" lang={lang}>
  <ParticleBackground />
  <Header lang={lang} />
  
  <main class="pt-32 pb-16 relative z-10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <nav class="flex text-sm text-[var(--color-text-muted)] mb-8 font-medium">
        <ol class="flex items-center space-x-2">
          <li>
            <a href="${homeLink}" class="hover:text-[var(--color-accent-primary)] transition-colors">${homeText}</a>
          </li>
          <li><span class="mx-2">/</span></li>
          <li class="text-[var(--color-text-main)]">
            ${data.breadcrumb || data.h1}
          </li>
        </ol>
      </nav>

      <div class="glass-panel p-8 md:p-12 rounded-3xl shadow-xl">
        <h1 class="text-4xl md:text-5xl font-black mb-8 text-[var(--color-text-main)] tracking-tight leading-tight">
          ${data.h1}
        </h1>
        
        <div class="prose prose-lg prose-headings:font-bold prose-headings:text-[var(--color-text-main)] prose-p:text-[var(--color-text-muted)] prose-img:rounded-2xl prose-img:shadow-lg max-w-none">
          ${data.content}
        </div>
      </div>
    </div>
  </main>
  
  <ConsultationForm lang={lang} />
  <Footer lang={lang} />
</Layout>
`;
                fs.writeFileSync(destFile, astroContent);
                console.log(`Created ${destFile}`);
            }
        }
    }
}

// Main files
async function processMain(indexPath, destFile, lang) {
    if (fs.existsSync(indexPath)) {
        console.log(`Processing main ${indexPath}`);
        const html = fs.readFileSync(indexPath, 'utf-8');
        const data = await extractData(html, lang);
        
        const homeLink = lang === 'ru' ? '/ru' : '/';
        const homeText = lang === 'ru' ? 'Главная' : 'Головна';
        
        const astroContent = `---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ConsultationForm from '../components/sections/ConsultationForm.astro';
import ParticleBackground from '../components/ParticleBackground.astro';

const lang = '${lang}';
---

<Layout title="${data.title.replace(/"/g, '&quot;')}" description="${data.description.replace(/"/g, '&quot;')}" lang={lang}>
  <ParticleBackground />
  <Header lang={lang} />
  
  <main class="pt-32 pb-16 relative z-10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <nav class="flex text-sm text-[var(--color-text-muted)] mb-8 font-medium">
        <ol class="flex items-center space-x-2">
          <li>
            <a href="${homeLink}" class="hover:text-[var(--color-accent-primary)] transition-colors">${homeText}</a>
          </li>
          <li><span class="mx-2">/</span></li>
          <li class="text-[var(--color-text-main)]">
            ${data.breadcrumb || data.h1}
          </li>
        </ol>
      </nav>

      <div class="glass-panel p-8 md:p-12 rounded-3xl shadow-xl">
        <h1 class="text-4xl md:text-5xl font-black mb-8 text-[var(--color-text-main)] tracking-tight leading-tight">
          ${data.h1}
        </h1>
        
        <div class="prose prose-lg prose-headings:font-bold prose-headings:text-[var(--color-text-main)] prose-p:text-[var(--color-text-muted)] prose-img:rounded-2xl prose-img:shadow-lg max-w-none">
          ${data.content}
        </div>
      </div>
    </div>
  </main>
  
  <ConsultationForm lang={lang} />
  <Footer lang={lang} />
</Layout>
`;
        fs.writeFileSync(destFile, astroContent);
        console.log(`Created main file ${destFile}`);
    }
}

const categories = [
    { ru: 'галерея', ua: 'галерея-2' },
    { ru: 'статті', ua: 'статті-ua' }
];

async function run() {
    for (const cat of categories) {
        if (cat.ru) {
            await processDirectory(path.join(sourceDir, cat.ru), 'ru', cat.ru);
            await processMain(path.join(sourceDir, cat.ru, 'index.html'), path.join(targetDir, cat.ru + '.astro'), 'ru', cat.ru);
        }
        if (cat.ua) {
            await processDirectory(path.join(sourceDir, cat.ua), 'ua', cat.ua);
            await processMain(path.join(sourceDir, cat.ua, 'index.html'), path.join(targetDir, cat.ua + '.astro'), 'ua', cat.ua);
        }
    }
    console.log("Migration and Translation Complete");
}

run();
