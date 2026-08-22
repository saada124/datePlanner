/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
      },
      colors: {
        retro: {
          pink: '#ff7597',
          pinkLight: '#ffb3c6',
          pinkDark: '#d94368',
          cream: '#fffdf0',
          yellow: '#ffe66d',
          lavender: '#c8b6ff',
          blue: '#90e0ef',
          dark: '#2b1b3d',
          purple: '#4a284e',
          accent: '#ff0055',
          gold: '#ffd166',
          card: '#fff9fb'
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #2b1b3d',
        'pixel-sm': '2px 2px 0px 0px #2b1b3d',
        'pixel-lg': '6px 6px 0px 0px #2b1b3d',
        'pixel-glow': '0 0 15px rgba(255, 117, 151, 0.6), 4px 4px 0px 0px #2b1b3d',
        'pixel-gold': '0 0 20px rgba(255, 209, 102, 0.8), 4px 4px 0px 0px #2b1b3d',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 0.3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
