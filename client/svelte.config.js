import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true,
    }),
    alias: {
      $assets: './src/assets',
      '$assets/*': './src/assets/*',

      $services: './src/services',
      '$services/*': './src/services/*',

      $components: './src/components',
      '$components/*': './src/components/*',

      $models: './src/models',
      '$models/*': './src/models/*',
    },
  },
}

export default config

