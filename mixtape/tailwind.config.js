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
        display: ['"Abril Fatface"', 'cursive', 'serif'],
        handwriting: ['"Caveat"', 'cursive'],
        typewriter: ['"Special Elite"', '"Courier New"', 'monospace'],
        mono: ['"Share Tech Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        mixtape: {
          bg: '#161311',
          bgWarm: '#1e1a17',
          chassis: '#2a2420',
          metalDark: '#1a1614',
          metalLight: '#3a332c',
          paper: '#fffdfa',
          parchment: '#f7f1e5',
          cream: '#fcf6ec',
          tape: '#d9a679',
          oxide: '#4a2c1d',
          oxideDark: '#321c11',
          amber: '#e0a458',
          gold: '#d4af37',
          terracotta: '#c96f4a',
          rose: '#d88a8a',
          roseDark: '#b45f6f',
          blush: '#f9e8dd',
          coffee: '#2d221c',
          coffeeLight: '#6d5a4e',
          border: '#e4d6c3',
          ledGreen: '#10b981',
          ledAmber: '#f59e0b',
          ledRed: '#ef4444'
        }
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(26, 20, 16, 0.15), 0 2px 6px -1px rgba(26, 20, 16, 0.08)',
        'paper-lg': '0 16px 40px -8px rgba(18, 14, 11, 0.35), 0 6px 16px -2px rgba(18, 14, 11, 0.18)',
        'deck-deep': '0 30px 70px -15px rgba(0, 0, 0, 0.75), 0 10px 24px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'acrylic-window': 'inset 0 4px 18px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.4)',
        'btn-tactile': '0 6px 0 #181310, 0 10px 18px rgba(0, 0, 0, 0.4)',
        'btn-tactile-pressed': '0 2px 0 #181310, 0 4px 8px rgba(0, 0, 0, 0.3)',
        'btn-rec': '0 6px 0 #7f1d1d, 0 10px 22px rgba(239, 68, 68, 0.4)',
        'btn-rec-pressed': '0 2px 0 #7f1d1d, 0 4px 10px rgba(239, 68, 68, 0.3)',
        'led-glow-green': '0 0 10px #10b981, 0 0 20px rgba(16, 185, 129, 0.4)',
        'led-glow-amber': '0 0 10px #f59e0b, 0 0 20px rgba(245, 158, 11, 0.4)',
        'led-glow-red': '0 0 10px #ef4444, 0 0 25px rgba(239, 68, 68, 0.6)',
      },
      animation: {
        'reel-spin': 'reelSpin 3s linear infinite',
        'reel-spin-fast': 'reelSpin 0.75s linear infinite',
        'reel-spin-slow': 'reelSpin 4.5s linear infinite',
        'rec-pulse': 'recPulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'meter-needle': 'meterNeedle 1.8s ease-in-out infinite alternate',
      },
      keyframes: {
        reelSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        recPulse: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' },
          '50%': { opacity: '0.4', filter: 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.2))' },
        },
        meterNeedle: {
          '0%': { transform: 'rotate(-25deg)' },
          '30%': { transform: 'rotate(-5deg)' },
          '60%': { transform: 'rotate(15deg)' },
          '80%': { transform: 'rotate(-10deg)' },
          '100%': { transform: 'rotate(5deg)' },
        }
      }
    },
  },
  plugins: [],
}