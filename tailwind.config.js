/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Space Mono', 'monospace'],
        'body': ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        'void': '#0a0a0b',
        'surface': '#111113',
        'surface-light': '#1a1a1d',
        'border': '#2a2a2d',
        'muted': '#6b6b70',
        'accent': '#00ff88',
        'accent-dim': '#00cc6a',
        'warning': '#ffaa00',
        'negative': '#ff4466',
        'positive': '#00ff88',
        'neutral': '#6b8aff',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
