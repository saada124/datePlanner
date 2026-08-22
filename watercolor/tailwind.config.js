/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Caveat"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        storybook: {
          bg: '#f2f7fb',
          paper: '#fdfcff',
          parchment: '#eef3f9',
          rose: '#e8a0b4',
          roseDark: '#c96f8a',
          blush: '#fdeef2',
          sage: '#9fc3b8',
          sageLight: '#e6f1ec',
          gold: '#e7c782',
          honey: '#fdf1d3',
          lavender: '#c9b8e8',
          lavenderLight: '#efeafa',
          terracotta: '#e09a7a',
          ink: '#3b4a63',
          inkLight: '#6d7a93',
          border: '#dfe6ee'
        }
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(93, 116, 150, 0.10), 0 2px 6px -1px rgba(93, 116, 150, 0.06)',
        'paper-lg': '0 10px 30px -4px rgba(93, 116, 150, 0.16), 0 4px 12px -2px rgba(93, 116, 150, 0.08)',
        'polaroid': '0 8px 24px -4px rgba(93, 116, 150, 0.14), 0 2px 6px -1px rgba(93, 116, 150, 0.06)',
        'seal': '0 4px 14px rgba(201, 111, 138, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'disc-spin': 'discSpin 5s linear infinite',
        'blob-drift': 'blobDrift 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.02)' },
        },
        discSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blobDrift: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, 25px) scale(0.95)' },
        },
      }
    },
  },
  plugins: [],
}