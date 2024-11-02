import adapter from '@sveltejs/adapter-node'
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    scss: {
      includePaths: ['src/assets/scss/']
    }
  }),
  compilerOptions: {
    warningFilter: (warning) => !warning.code?.includes('unused')
  },
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('css-unused-selector')) return
    handler(warning)
  },
  kit: {
    adapter: adapter({ out: '../dist/client' })
  }
}

export default config



