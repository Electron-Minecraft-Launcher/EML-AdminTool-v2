import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  envDir: './env',
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), '/assets']
    },
    watch: {
      ignored: ['**/env/.env*']
    }
  }
})

