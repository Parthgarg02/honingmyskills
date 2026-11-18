import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL: used for canonical links, RSS and the sitemap.
export default defineConfig({
  site: 'https://honingmyskills.com',
  integrations: [sitemap()],
});
