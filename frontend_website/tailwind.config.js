/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}', // Adjust the paths based on your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'educraft-purple': '#6A1B9A',
        'educraft-orange': '#FF6F00',
        'educraft-green': '#00C853',
        'educraft-yellow': '#FFD600',
        'educraft-grey': '#37474F',
      },
    },
  },
  plugins: [],
}
