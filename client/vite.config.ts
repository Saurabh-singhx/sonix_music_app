import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' 

// https://vite.dev/config/
export default defineConfig({
  mode:'production',
  plugins: [react(), tailwindcss(),
     visualizer({
      open: true,        // auto opens in browser
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Sonix',
        short_name: 'Sonix',
        description: 'AI-powered music streaming',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
})
