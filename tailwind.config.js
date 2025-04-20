/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      /* ➊ brand font */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* ➋ brand palette */
      colors: {
        brand: {
          primary: {               // emerald
            DEFAULT: '#10B981',
            dark:    '#047857',
          },
          accent: {                // amber
            DEFAULT: '#FBBF24',
            dark:    '#D97706',
          },
          neutral: {               // gray
            100: '#F3F4F6',
            500: '#6B7280',
            700: '#374151',
          },
        },
      },
    },
  },
  plugins: [],
}
