/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#07050d',
          900: '#0d0b18',
          850: '#131024',
          800: '#1b1734',
          700: '#2a2450',
        },
        neon: {
          purple: '#b026ff',
          pink: '#ff1389',
          blue: '#00d2ff',
          cyan: '#00f7ff',
          yellow: '#ffe600',
          green: '#00ff88',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulseGlow 0.8s ease-in-out infinite',
        'strobe': 'strobe 0.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'disco': 'discoRotate 15s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(176, 38, 255, 0.75))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 35px rgba(255, 19, 137, 0.95))' },
        },
        strobe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        discoRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(176, 38, 255, 0.5), 0 0 10px -2px rgba(176, 38, 255, 0.3)',
        'neon-pink': '0 0 25px -5px rgba(255, 19, 137, 0.5), 0 0 10px -2px rgba(255, 19, 137, 0.3)',
        'neon-cyan': '0 0 25px -5px rgba(0, 247, 255, 0.5), 0 0 10px -2px rgba(0, 247, 255, 0.3)',
        'neon-glow': '0 0 40px -10px rgba(176, 38, 255, 0.6), 0 0 20px -5px rgba(0, 247, 255, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
