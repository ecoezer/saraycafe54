import tailwindForms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-blue': {
          50: '#f0f5f6',
          100: '#d9e7e9',
          200: '#b8d3d7',
          300: '#a8c5c9',
          400: '#8eb3b8',
          500: '#6d9ca3',
          600: '#5a8389',
          700: '#496a6f',
          800: '#3a555a',
          900: '#2f454a',
        }
      },
      keyframes: {
        'rgb-border': {
          '0%, 100%': { borderColor: '#ff0000' },
          '16%': { borderColor: '#ff7f00' },
          '33%': { borderColor: '#ffff00' },
          '50%': { borderColor: '#00ff00' },
          '66%': { borderColor: '#0000ff' },
          '83%': { borderColor: '#8b00ff' },
        }
      },
      animation: {
        'rgb-border': 'rgb-border 3s linear infinite',
      }
    }
  },
  plugins: [tailwindForms]
};

