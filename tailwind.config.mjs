/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    '#DC2626',
          dark:   '#0A0A0A',
          gray:   '#141414',
          border: '#1F1F1F',
          muted:  '#9CA3AF', // gris-400: 7:1 sobre brand-dark (AA); el #6B7280 anterior no llegaba a 4,5:1
          light:  '#F9FAFB',
        },
      },
      // Texto rojo más claro que el de fondo de botón: #DC2626 sobre negro da 4,2:1
      // (no llega a AA); #F87171 da 6,9:1. Los fondos siguen con brand-red.
      textColor: { 'brand-red': '#F87171' },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
