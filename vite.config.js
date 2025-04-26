// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),      // enables JSX support
    tailwindcss() // processes your tailwind.config.js
  ],
  resolve: {
    alias: {
      '@lib': '/src/lib'
    }
  }
})
