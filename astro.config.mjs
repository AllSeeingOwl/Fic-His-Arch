import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Render sets RENDER=true during builds, plus RENDER_EXTERNAL_URL (e.g. https://fic-his-arch.onrender.com).
const isRender = process.env.RENDER === 'true';

// SITE_URL lets a custom domain override the default host on any platform.
const site =
  process.env.SITE_URL ||
  (isRender
    ? process.env.RENDER_EXTERNAL_URL || 'https://fic-his-arch.onrender.com'
    : 'https://allseeingowl.github.io');

// GitHub Pages serves the site from /Fic-His-Arch; Render serves it from the root.
const base = isRender ? undefined : '/Fic-His-Arch';

export default defineConfig({
  site,
  base,
  integrations: [react()],
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
    ssr: {
      external: ['@tailwindcss/vite'],
    },
  },
});
