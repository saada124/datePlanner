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
        typewriter: ['"Special Elite"', '"Courier New"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        mixtape: {
          bg: '#f6efe3',
          paper: '#fdfaf2',
          parchment: '#efe6d2',
          cream: '#fbf4e8',
          tape: '#d9a679',
          amber: '#e0a458',
          gold: '#d9a441',
          terracotta: '#c96f4a',
          rose: '#d88a8a',
          roseDark: '#b45f6f',
          blush: '#f9e8dd',
          coffee: '#4a3b32',
          coffeeLight: '#8a7568',
          border: '#e2d5c2'
        }
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(74, 59, 50, 0.12), 0 2px 6px -1px rgba(74, 59, 50, 0.06)',
        'paper-lg': '0 12px 32px -6px rgba(74, 59, 50, 0.2), 0 4px 12px -2px rgba(74, 59, 50, 0.1)',
        'tape': '0 6px 18px -4px rgba(201, 111, 74, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
        'record-glow': '0 0 0 4px rgba(216, 138, 138, 0.25), 0 6px 24px -4px rgba(180, 95, 111, 0.5)',
      },
      animation: {
        'reel-spin': 'reelSpin 3s linear infinite',
        'reel-spin-slow': 'reelSpin 4.5s linear infinite',
        'heart-beat': 'heartBeat 1.4s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'blink-slow': 'blinkSlow 1.2s steps(2, start) infinite',
        'wobble': 'wobble 0.5s ease-in-out infinite',
      },
      keyframes: {
        reelSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.12)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        blinkSlow: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      }
    },
  },
  plugins: [],
}