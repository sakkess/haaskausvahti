/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* ← NEW: numeric keys 50‑900, but we only need 500 + 700 */
      colors: {
        brand: {
          500: '#10B981',  // main emerald
          700: '#047857',  // darker hover / gradient end
        },
        accent: {
          400: '#FBBF24',
          600: '#D97706',
        },
      },
    },
  },
  plugins: [],
}
