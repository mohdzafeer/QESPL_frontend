/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'classs',
  content: ['./index.html', './src//*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        themeColor: 'rgb(var(--color-theme) / <alpha-value>)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};