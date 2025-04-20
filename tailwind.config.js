/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      /* Brand font */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* Flat colour tokens that Tailwind classes can find */
      colors: {
        'brand-primary':        '#10B981',  // emerald‑500
        'brand-primary-dark':   '#047857',  // emerald‑700
        'brand-accent':         '#FBBF24',  // amber‑400
        'brand-accent-dark':    '#D97706',  // amber‑600
        'brand-neutral-100':    '#F3F4F6',
        'brand-neutral-500':    '#6B7280',
        'brand-neutral-700':    '#374151',
      },
    },
  },
  plugins: [],
}
