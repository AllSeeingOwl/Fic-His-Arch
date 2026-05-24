# Visual Style Guide & Component Blueprint

This document defines the interface aesthetics and user-interface components for the Fictional History Archive. The design blends an institutional, microfilm-inspired archive feeling with clean, modern digital-museum presentation.

## 1. Visual Theme (Tailwind CSS Configuration)
Instruct the styling agents to utilize the following color values and typography configurations to build the theme layout:

```javascript
// tailwind.config.js
module.exports = {
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