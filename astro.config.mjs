import { defineConfig } from 'astro/config';

// Tailwind 3 entra por PostCSS (postcss.config.cjs + src/styles/global.css):
// la integración @astrojs/tailwind no es compatible con Astro 7.
export default defineConfig({
  site: 'https://artesmarciales.cat',
  output: 'static',
});
