/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary green palette
        primary: {
          50:  '#f0fff4',
          100: '#c6f6d5',
          200: '#9ae6b4',
          300: '#68d391',
          400: '#48bb78',
          500: '#38a169',
          600: '#2f855a',
          700: '#276749',
          800: '#22543d',
          900: '#1c4532',
        },
        // Secondary neutral gray
        secondary: {
          DEFAULT: '#4A5568', // gray-600
        },
        // Accent highlight color (gold)
        accent: {
          DEFAULT: '#ECC94B', // yellow-400
        },
        // Background utility
        background: {
          DEFAULT: '#EDF2F7', // gray-100
        },
        // Text utility
        text: {
          DEFAULT: '#2D3748', // gray-800
        },
      },
    },
  },
  plugins: [],
};
