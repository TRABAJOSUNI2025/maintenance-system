/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d33f2',
          50: '#f0f4ff',
          100: '#e6ecff',
          200: '#c9d9ff',
          300: '#adc7ff',
          400: '#7ba3ff',
          500: '#4d80ff',
          600: '#0d33f2',
          700: '#0a2ac9',
          800: '#0821a0',
          900: '#061977',
        },
        background: {
          light: '#f5f6f8',
          dark: '#101322',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

