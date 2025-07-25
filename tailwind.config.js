/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        themeColor: 'var(--theme-color)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
