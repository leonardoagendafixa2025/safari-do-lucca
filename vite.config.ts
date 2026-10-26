/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

function serveFundoPlugin(): Plugin {
  const rootDir = import.meta.dirname || process.cwd()

  return {
    name: 'serve-fundo',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next()
        const cleanUrl = req.url.split('?')[0]
        if (cleanUrl === '/luca.mp4' || cleanUrl === '/fundo/luca.mp4' || cleanUrl.startsWith('/fundo/')) {
          const fileName = cleanUrl.replace(/^\/fundo\//, '').replace(/^\//, '')
          const candidatePaths = [
            path.resolve(rootDir, 'fundo', fileName),
            path.resolve(rootDir, 'public', fileName),
            path.resolve(rootDir, 'fundo', 'luca.mp4'),
            path.resolve(rootDir, 'public', 'luca.mp4'),
          ]
          for (const cand of candidatePaths) {
            if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
              res.setHeader('Content-Type', 'video/mp4')
              return fs.createReadStream(cand).pipe(res)
            }
          }
        }
        next()
      })
    },
    closeBundle() {
      const fundoDir = path.resolve(rootDir, 'fundo')
      const distFundoDir = path.resolve(rootDir, 'dist', 'fundo')
      if (fs.existsSync(fundoDir)) {
        if (!fs.existsSync(distFundoDir)) {
          fs.mkdirSync(distFundoDir, { recursive: true })
        }
        const files = fs.readdirSync(fundoDir)
        for (const file of files) {
          const src = path.join(fundoDir, file)
          const dest = path.join(distFundoDir, file)
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest)
          }
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveFundoPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})

