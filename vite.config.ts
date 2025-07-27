import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'
import { defineConfig, type ViteDevServer } from 'vite'
import fs from 'fs'
import mime from 'mime-types'

const filesDir = path.resolve(__dirname, 'files')


const rawFiles = () => {
  return {
    name: 'raw-files-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/files/')) {
          const filePath = path.join(filesDir, req.url.substring('/files/'.length))

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const extension = path.extname(filePath).toLowerCase()
            let mimeType

            if (['.ts', '.js', '.jsx', '.tsx', '.svelte', '.vue', '.css', '.html'].includes(extension)) {
              mimeType = 'text/plain; charset=utf-8'
            } else {
              mimeType = mime.lookup(filePath) || 'application/octet-stream'
            }

            res.setHeader('Content-Type', mimeType)
            res.writeHead(200)
            res.end(fs.readFileSync(filePath))
            return
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [sveltekit(), rawFiles()],
  server: {
    fs: {
      allow: ['files', 'static']
    },
    watch: {
      ignored: ['**/.env*']
    }
  }
})


