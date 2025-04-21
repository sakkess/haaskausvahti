import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';    // ✅ the only Tailwind plugin

export default defineConfig({
  plugins: [tailwindcss(), react()],
});