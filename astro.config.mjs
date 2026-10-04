import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Tailwind 4 por su plugin de Vite; tema y colores en src/styles/global.css.
export default defineConfig({
  site: 'https://artesmarciales.cat',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
