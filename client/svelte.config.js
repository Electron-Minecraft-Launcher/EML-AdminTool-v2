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
    adapter: adapter({ out: '../dist/client' })
  },
  onwarn: (warning, handler) => {
    const { code, frame, filename } = warning
    if (code === 'css-unused-selector' || code === 'css-unused-global') {
      return
    }
    handler(warning)
  }
}

export default config


