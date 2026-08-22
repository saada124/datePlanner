/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tahoma', '"MS Sans Serif"', 'sans-serif'],
        win95: ['"VT323"', 'Tahoma', 'monospace'],
      },
      colors: {
        win95: {
          gray: '#c0c0c0',
          silverLight: '#dfdfdf',
          grayDark: '#808080',
          navy: '#000080',
          blue: '#1084d0',
          teal: '#008080',
          black: '#000000',
          white: '#ffffff',
          bsod: '#0000aa'
        }
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
      },
      keyframes: {
        blink: {
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}