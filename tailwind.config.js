/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        teleportIn: {
          '0%': { transform: 'scaleX(0.97) translateY(1.25rem)', opacity: 0 },
          '100%': { transform: 'scaleX(1) translateY(0)', opacity: 1 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      animation: {
        teleportIn: 'teleportIn 0.2s ease-out 0.2s both',
        fadeIn: 'fadeIn 0.5s ease-in-out forwards'
      },
      height: {
        toolbar: '3rem',
        modal: '600px'
      },
      fontFamily: {
        mono: ['Oxygen Mono', 'monospace']
      },
      width: {
        page: '960px',
        modal: '500px'
      },
      maxWidth: {
        modal: '90vw'
      }
    },
    fontFamily: {
      sans: ['Abel', 'sans-serif']
    }
  },
  plugins: []
}
