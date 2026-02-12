/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Day Mode - Creamy Latte Palette
        'latte': {
          50: '#FDFCFB',
          100: '#F5F0E9',
          200: '#E5D9C8',
          300: '#D4C2A7',
          400: '#C3AB86',
          500: '#B29465',
        },
        // Night Mode - Deep Twilight Palette
        'twilight': {
          50: '#3D4551',
          100: '#2D353F',
          200: '#1A1E23',
          300: '#141619',
          400: '#0F1113',
          500: '#0A0B0C',
        },
        // Accent - Electric Ice
        'ice': {
          100: '#E8F2FA',
          200: '#D1E5F5',
          300: '#A3C1E0',
          400: '#7AA8D1',
          500: '#5190C2',
        },
        // Charcoal
        'charcoal': {
          100: '#6B6B6B',
          200: '#4A4A4A',
          300: '#2C2C2C',
          400: '#1A1A1A',
          500: '#0D0D0D',
        },
        // SayIt Palette
        "cream": "#F9F3E5",
        "amber-gold": "#C69B3D",
        "dark-brown": "#3E2723",
        "soft-paper": "#FFFDF9",
        "border-sepia": "#D7C4A5",
        "soft-sepia": "#F2E8D5",
        "ink-brown": "#2D241E",
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        // SayIt Fonts
        "display": ["Noto Serif SC", "serif"],
        "handwriting": ["Zhi Mang Xing", "cursive"]
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'title': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'editorial': '0 2px 20px rgba(0, 0, 0, 0.08)',
        'editorial-dark': '0 2px 20px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 30px rgba(163, 193, 224, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'breath': 'breath 10s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
