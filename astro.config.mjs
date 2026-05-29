import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://allseeingowl.github.io',
  base: '/Fic-His-Arch',
  integrations: [react(), tailwind()],
});
