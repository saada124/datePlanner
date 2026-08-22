/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        midnight: {
          bg: '#0a0814',
          card: 'rgba(23, 19, 43, 0.75)',
          cardLight: 'rgba(34, 28, 64, 0.85)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderHover: 'rgba(192, 132, 252, 0.5)',
          purple: '#a855f7',
          neonPink: '#ff7597',
          neonCyan: '#38bdf8',
          starlight: '#ffd166',
          lavender: '#c084fc',
          text: '#f3f4f6',
          textMuted: '#9ca3af'
        }
      },
      boxShadow: {
        'neon-pink': '0 0 25px -3px rgba(255, 117, 151, 0.4), 0 0 10px -2px rgba(255, 117, 151, 0.2)',
        'neon-purple': '0 0 25px -3px rgba(168, 85, 247, 0.4), 0 0 10px -2px rgba(168, 85, 247, 0.2)',
        'neon-cyan': '0 0 25px -3px rgba(56, 189, 248, 0.4), 0 0 10px -2px rgba(56, 189, 248, 0.2)',
        'cosmic-card': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
