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
        },
        'orange': {
          50: '#fef5f0',
          100: '#fde9dd',
          200: '#fbd1bb',
          300: '#f8b898',
          400: '#f59e6f',
          500: '#f27e45',
          600: '#e56a1f',
          700: '#cc5515',
          800: '#b34512',
          900: '#8f3410',
        },
        'green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
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

