export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx,astro}'],
  theme: {
    extend: {
      colors: {
        archive: {
          bg: '#121413',
          surface: '#1c1f1d',
          border: '#333b36',
          paper: '#f4f1ea',
          accent: '#cfa353',
          muted: '#8a948e',
          terminal: '#4af626',
        },
      },
      fontFamily: {
        serif: ['"Courier Prime"', 'Courier', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
};
