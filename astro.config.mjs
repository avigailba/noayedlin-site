// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://noayedlin-site.vercel.app',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
