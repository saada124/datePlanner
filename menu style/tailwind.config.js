/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        menu: {
          bg: '#FFF8EC',          // Warm cream canvas
          paper: '#FFFCF5',       // Soft linen paper card surface
          cardBorder: '#D8B29A',  // Faded rust hairline divider
          espresso: '#2B1B17',    // Espresso brown primary text
          coral: '#E8635A',       // Poppy coral primary accent
          coralHover: '#D45048',  // Darker coral hover
          coralLight: '#FDEAE8',  // Soft coral highlight tint
          peach: '#F4A45C',       // Soft peach secondary accent
          peachLight: '#FDF2E7',  // Soft peach background
          sage: '#4A7A6D',        // Muted sage stamp confirm
          sageLight: '#EBF3F1',   // Soft sage background
          rust: '#C47A53',        // Warm terracotta rust
          taupe: '#70584E',       // Warm taupe muted caption
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Nunito"', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'Courier', 'monospace'],
      },
      boxShadow: {
        'paper': '0 20px 45px -15px rgba(43, 27, 23, 0.12), 0 0 0 1px rgba(216, 178, 154, 0.35)',
        'paper-lg': '0 25px 60px -20px rgba(43, 27, 23, 0.18), 0 0 0 1px rgba(216, 178, 154, 0.45)',
        'ticket': '0 30px 70px -15px rgba(43, 27, 23, 0.25), 0 0 0 1px rgba(74, 122, 109, 0.3)',
        'coral-glow': '0 8px 24px -4px rgba(232, 99, 90, 0.35)',
        'stamp': 'inset 0 0 12px rgba(74, 122, 109, 0.25)'
      },
      keyframes: {
        'stamp-in': {
          '0%': { transform: 'scale(2.4) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(0.92) rotate(-4deg)', opacity: '1' },
          '80%': { transform: 'scale(1.05) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(-3deg)', opacity: '0.96' }
        },
        'ink-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' }
        }
      },
      animation: {
        'stamp-in': 'stamp-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'ink-pulse': 'ink-pulse 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
