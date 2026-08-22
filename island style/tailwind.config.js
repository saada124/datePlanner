/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        island: {
          bg: '#e8f5e9',
          cream: '#fffdf0',
          card: '#ffffff',
          mint: '#5dc090',
          mintDark: '#3b9b6e',
          mintLight: '#e1f7ec',
          yellow: '#f9d849',
          yellowDark: '#e5be22',
          yellowLight: '#fff9d6',
          sky: '#5bb8e5',
          skyDark: '#388fb8',
          skyLight: '#e4f4fc',
          coral: '#ff7b72',
          text: '#44403c',
          textLight: '#78716c',
          brown: '#7d5233',
          wood: '#9c6644',
          woodLight: '#ddb892'
        }
      },
      fontFamily: {
        nook: ['"Varela Round"', '"Quicksand"', 'ui-rounded', 'system-ui', 'sans-serif'],
        dialogue: ['"M PLUS Rounded 1c"', '"Varela Round"', 'sans-serif']
      },
      boxShadow: {
        'nook': '0 8px 0 rgba(77, 124, 98, 0.2), 0 15px 25px rgba(0,0,0,0.06)',
        'nook-btn': '0 4px 0 rgba(0, 0, 0, 0.15)',
        'nook-active': '0 2px 0 rgba(0, 0, 0, 0.15)',
        'bubble': '0 10px 0 rgba(0,0,0,0.08), 0 20px 30px rgba(0,0,0,0.05)'
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      }
    },
  },
  plugins: [],
}
