// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://avigailba.github.io',
  base: '/noayedlin-site',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
