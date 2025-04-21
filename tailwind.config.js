/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                         // future dark‑mode toggle: <html class="dark">
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      /* ➊ Colour system */
      colors: {
        brand:  {
          50:'#ECFDF5', 100:'#D1FAE5', 200:'#A7F3D0',
          300:'#6EE7B7', 400:'#34D399', 500:'#10B981',
          600:'#059669', 700:'#047857', 800:'#065F46', 900:'#064E3B',
        },
        accent: {
          50:'#FFFBEB', 100:'#FEF3C7', 200:'#FDE68A',
          300:'#FCD34D', 400:'#FBBF24', 500:'#F59E0B',
          600:'#D97706', 700:'#B45309', 800:'#92400E', 900:'#78350F',
        },
        neutral: {
          50:'#F9FAFB', 100:'#F3F4F6', 200:'#E5E7EB',
          300:'#D1D5DB', 400:'#9CA3AF', 500:'#6B7280',
          600:'#4B5563', 700:'#374151', 800:'#1F2937', 900:'#111827',
        },
      },

      /* ➋ Typography scale */
      fontFamily: {
        sans: ['Inter','system-ui','sans-serif'],
      },
      fontSize: {
        h1: ['2.5rem',{ lineHeight:'1.2', fontWeight:'700' }],  // 40 px
        h2: ['1.875rem',{ lineHeight:'1.3', fontWeight:'700' }],// 30 px
        h3: ['1.5rem',{ lineHeight:'1.35',fontWeight:'600' }],  // 24 px
      },
      /* spacing, radius, shadows can stay default for now */
    },
  },
  plugins: [],
}
