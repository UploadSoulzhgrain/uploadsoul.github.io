import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'UploadSoul',
        short_name: 'UploadSoul',
        id: '/',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#156b5c',
        background_color: '#212223',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: "/screenshot-mobile.png",
            sizes: "360x720",
            type: "image/png"
          },
          {
            src: "/screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4000000
      }
    })
  ],
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
    host: '127.0.0.1',
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path
      }
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
