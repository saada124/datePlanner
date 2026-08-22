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
          bg: '#fcf8f2',
          paper: '#fdfbf7',
          parchment: '#f5eee3',
          rose: '#e2959f',
          roseDark: '#c76e7b',
          blush: '#f9e6e8',
          sage: '#9fb8a0',
          sageLight: '#e4ece5',
          gold: '#dfb15b',
          honey: '#f8e4b7',
          terracotta: '#c67d63',
          ink: '#2c2f38',
          inkLight: '#595f6e',
          border: '#e8dcce'
        }
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(92, 70, 54, 0.08), 0 2px 6px -1px rgba(92, 70, 54, 0.04)',
        'paper-lg': '0 10px 30px -4px rgba(92, 70, 54, 0.12), 0 4px 12px -2px rgba(92, 70, 54, 0.06)',
        'polaroid': '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'seal': '0 4px 14px rgba(199, 110, 123, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
