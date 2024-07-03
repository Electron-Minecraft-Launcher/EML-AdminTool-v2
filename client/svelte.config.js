import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      includePaths: ['src/assets/scss/']
    }
  }),

  kit: {
    adapter: adapter({ out: '../dist/client'})
  }
}

export default config

