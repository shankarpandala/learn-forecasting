import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/learn-forecasting/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Learn Forecasting — Practical Forecasting for Practitioners',
        short_name: 'LearnForecasting',
        description: 'Comprehensive interactive learning resource for time series forecasting — statistical methods, machine learning, deep learning, foundation models, and real-world applications in supply chain, finance, and trading.',
        theme_color: '#0ea5e9',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/learn-forecasting/',
        start_url: '/learn-forecasting/',
        orientation: 'any',
        categories: ['education', 'books'],
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ],
        navigateFallback: '/learn-forecasting/index.html',
        navigateFallbackDenylist: [/^\/learn-forecasting\/api/]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('katex')) return 'vendor-katex'
            if (id.includes('react-router')) return 'vendor-router'
            return 'vendor'
          }
          const subjectMatch = id.match(/subjects\/([\d]+-[^/]+)/)
          if (subjectMatch) return `subject-${subjectMatch[1]}`
        }
      }
    }
  }
})
