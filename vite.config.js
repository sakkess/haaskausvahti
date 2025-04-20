import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No @tailwindcss/vite import here

export default defineConfig({
  plugins: [react()],       // only the React plugin now
})
