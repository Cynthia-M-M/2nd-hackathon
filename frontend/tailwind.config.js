import formsPlugin from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f6f7',
          100: '#ebedef',
          200: '#d6dade',
          300: '#b3bcc4',
          400: '#8997a3',
          500: '#677787',
          600: '#526070',
          700: '#444f5c',
          800: '#3b444e',
          900: '#353c44',
          950: '#23282d',
        },
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7594',
          500: '#e04471',
          600: '#cc2754',
          700: '#ac1d45',
          800: '#8f1b3f',
          900: '#7a1b3a',
          950: '#44091b',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [formsPlugin],
} 