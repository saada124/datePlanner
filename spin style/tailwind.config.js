/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carnival: {
          bg: '#2E1A47',          // Deep carnival purple
          bgDark: '#1E0E32',      // Darker base
          card: '#3D225E',        // Rich card purple
          cardLight: '#4D2B77',   // Lighter card purple
          border: '#6B3FA6',      // Glowing border
          pink: '#FF4D8D',        // Segment hot pink
          pinkDark: '#D42666',    // Pink bevel
          yellow: '#FFC53D',      // Segment golden yellow
          yellowDark: '#D99B16',  // Yellow bevel
          teal: '#2EE6D6',        // Segment electric teal
          tealDark: '#12B5A7',    // Teal bevel
          orange: '#FF7A3D',      // Segment tangerine
          orangeDark: '#D95616',  // Orange bevel
          cream: '#FFF8EC',       // Text cream white
          creamMuted: '#D8CEE3',  // Subtext lilac cream
          lime: '#B4FF3D',        // Winner highlight & primary confirm
          limeDark: '#86CC18',    // Lime bevel
          gold: '#FFD15C',        // Carnival marquee gold
        }
      },
      fontFamily: {
        display: ['"Fredoka"', '"Baloo 2"', 'cursive', 'sans-serif'],
        sans: ['"Nunito"', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'Courier', 'monospace'],
      },
      boxShadow: {
        'arcade-pink': '0 6px 0 #D42666, 0 10px 20px rgba(255, 77, 141, 0.4)',
        'arcade-yellow': '0 6px 0 #D99B16, 0 10px 20px rgba(255, 197, 61, 0.4)',
        'arcade-teal': '0 6px 0 #12B5A7, 0 10px 20px rgba(46, 230, 214, 0.4)',
        'arcade-orange': '0 6px 0 #D95616, 0 10px 20px rgba(255, 122, 61, 0.4)',
        'arcade-lime': '0 6px 0 #86CC18, 0 12px 25px rgba(180, 255, 61, 0.45)',
        'arcade-purple': '0 6px 0 #200E35, 0 10px 20px rgba(0, 0, 0, 0.4)',
        'marquee-glow': '0 0 25px rgba(255, 197, 61, 0.5), inset 0 0 15px rgba(255, 209, 92, 0.3)',
        'wheel-glow': '0 0 40px rgba(46, 230, 214, 0.35), 0 20px 50px rgba(0,0,0,0.6)',
        'ticket': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 209, 92, 0.3)',
      },
      keyframes: {
        'bounce-short': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'ticket-drop': {
          '0%': { transform: 'translateY(-120%) rotate(-3deg)', opacity: '0' },
          '60%': { transform: 'translateY(15px) rotate(1deg)', opacity: '1' },
          '80%': { transform: 'translateY(-6px) rotate(-0.5deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
        },
        'stamp-slam': {
          '0%': { transform: 'scale(3) rotate(-25deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(-8deg)', opacity: '1' },
          '80%': { transform: 'scale(1.05) rotate(-6deg)' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '0.92' },
        },
        'marquee-light': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 6px #FFD15C)' },
          '50%': { opacity: '0.4', filter: 'none' },
        }
      },
      animation: {
        'bounce-short': 'bounce-short 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'ticket-drop': 'ticket-drop 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards',
        'stamp-slam': 'stamp-slam 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'marquee-light': 'marquee-light 1.2s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}
