import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  site: isVercel
    ? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://vercel.app'
    : 'https://allseeingowl.github.io',
  base: isVercel ? undefined : '/Fic-His-Arch',
  integrations: [react()],
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
    ssr: {
      external: ['@tailwindcss/vite'],
    },
  },
});
