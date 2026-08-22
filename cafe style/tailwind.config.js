/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bistro: {
          bg: '#fcfaf6',
          linen: '#f7f2ea',
          paper: '#fffdfa',
          warm: '#f3ece2',
          border: '#e7dccc',
          text: '#2b231f',
          muted: '#7a6e65',
          gold: '#c59b27',
          goldLight: '#faeec7',
          wine: '#80182a',
          wineLight: '#fbebed',
          espresso: '#442b1d',
          receipt: '#fffff8'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        typewriter: ['"Courier Prime"', '"Special Elite"', 'Courier', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'menu': '0 20px 40px -15px rgba(68, 43, 29, 0.12), 0 0 0 1px rgba(68, 43, 29, 0.06)',
        'receipt': '0 15px 35px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        'gold-btn': '0 4px 14px rgba(197, 155, 39, 0.3)'
      }
    },
  },
  plugins: [],
}
