/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      animation: {
        'float-fast': 'float 6s ease-in-out infinite',
        'float-slow': 'float 15s ease-in-out infinite',
        'spin-slow': 'spin 40s linear infinite',
        'stars': 'twinkle 2s infinite ease-in-out',
        'aurora': 'aurora 10s ease-in-out infinite',
        'particle-slow': 'particle 12s linear infinite',
        'particle-fast': 'particle 5s linear infinite',
        'particle-mid': 'particle 8s linear infinite',
        pulse: 'pulse 4s ease-in-out infinite',
        'fade-in-slide': 'fadeInSlide 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
        aurora: {
          '0%': { transform: 'translateX(-50%)' },
          '50%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: 0.4 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(-100px) translateX(20px)', opacity: 0 },
        },
        fadeInSlide: {
          '0%': { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      boxShadow: {
        neon: '0 0 12px #00ffee',
        'neon-lg': '0 0 24px #00ffee',
      },
    },
  },
  plugins: [],
}
