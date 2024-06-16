import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      includePaths: ['src/assets/scss/']
    }
  }),

  kit: {
    adapter: adapter()
  }
}

export default config


