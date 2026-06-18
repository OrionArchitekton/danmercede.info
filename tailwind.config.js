/** @type {import('tailwindcss').Config} */
// Bundled Tailwind config — replaces the production Tailwind CDN JIT compiler (a
// ~123KB-gzip render-blocking script that recompiled CSS on every page load).
// Mirrors the inline `tailwind.config` that previously lived in index.html so the
// utility set and custom tokens are unchanged; Vite now emits a compiled
// stylesheet at build time. The build-time body-bake (vite-plugin-bodybake.ts)
// is in the content globs so the skip-link/landmark classes it emits into the
// baked/pre-hydration markup are not purged.
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './constants.ts',
    './vite-plugin-bodybake.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};
