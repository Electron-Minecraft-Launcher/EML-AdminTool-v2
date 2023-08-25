import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      includePaths: ['src/assets/scss/'],
    },
  }),

  kit: {
    adapter: adapter(),
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

