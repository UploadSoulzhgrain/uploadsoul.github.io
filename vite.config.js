import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    caseSensitive: true
  },
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Add sourcemap for better debugging
    sourcemap: true,
    // Copy public files
    copyPublicDir: true,
    // Improve chunking strategy
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom',
            'react-router-dom'
          ],
        },
      },
    }
  },
  server: {
    port: 5173,
    host: 'localhost',
    open: true,
    // 添加 SPA 路由支持
    historyApiFallback: {
      rewrites: [
        { from: /^\/sitemap\.xml$/, to: '/sitemap.xml' },
        { from: /^\/sitemap\.xsl$/, to: '/sitemap.xsl' },
        { from: /^\/robots\.txt$/, to: '/robots.txt' },
        { from: /./, to: '/index.html' }
      ]
    }
  },
  preview: {
    port: 5173,
    host: 'localhost',
    open: true,
    // 添加 SPA 路由支持
    historyApiFallback: {
      rewrites: [
        { from: /^\/sitemap\.xml$/, to: '/sitemap.xml' },
        { from: /^\/sitemap\.xsl$/, to: '/sitemap.xsl' },
        { from: /^\/robots\.txt$/, to: '/robots.txt' },
        { from: /./, to: '/index.html' }
      ]
    }
  }
})
