// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isBuild = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  site: 'https://samodirchik.github.io',
  base: isBuild ? '/example2' : '/',
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'dev-redirect-example2',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/example2/')) {
              res.writeHead(302, { Location: req.url.replace('/example2/', '/') });
              return res.end();
            } else if (req.url === '/example2') {
              res.writeHead(302, { Location: '/' });
              return res.end();
            }
            next();
          });
        }
      }
    ]
  }
});