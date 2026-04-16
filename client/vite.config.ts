import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  mode:'production',
  plugins: [react(), tailwindcss(),
     visualizer({
      open: true,        // auto opens in browser
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
