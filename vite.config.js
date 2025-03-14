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
  },
  base: './', // Change base to relative path for better local file loading
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Add sourcemap for better debugging
    sourcemap: true,
    // Improve chunking strategy
    rollupOptions: {
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
  }
})
