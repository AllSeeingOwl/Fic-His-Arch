module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx,astro}',
  ],
  theme: {
    extend: {
      colors: {
        archive: {
          bg: '#121413',        // Deep obsidian desk matte
          surface: '#1c1f1d',   // Microfilm reader backing layer
          border: '#333b36',    // Weathered static cabinet dividers
          paper: '#f4f1ea',     // Restored vintage document text
          accent: '#cfa353',    // Aged gold institutional seal
          muted: '#8a948e',     // Low-contrast metadata descriptors
          terminal: '#4af626'   // Rare active system elements
        }
      },
      fontFamily: {
        serif: ['"Courier Prime"', 'Courier', 'monospace'], // Typewriter/Microfilm text
        sans: ['"Inter"', 'sans-serif'],                     // Clean interface labels
        display: ['"Playfair Display"', 'serif']            // Formal journalistic headings
      }
    }
  }
}
