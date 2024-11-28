/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        teleportIn: {
          '0%': { transform: 'scaleX(0.97)', opacity: 0, top: '1.25rem' },
          '100%': { transform: 'scaleX(1)', opacity: 1, top: '0px' }
        }
      },
      animation: {
        teleportIn: 'teleportIn 0.2s ease-out 0.2s both'
      }
    }
  },
  plugins: []
}
