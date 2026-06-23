/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        herb: {
          50: '#fafff5',
          100: '#f0fde8',
          200: '#ddfacc',
          300: '#bff49f',
          400: '#96e963',
          500: '#6ed62e',
          600: '#53bb1c',
          700: '#3f9117',
          800: '#337318',
          900: '#295f18',
        },
        earth: {
          50: '#fdf8f3',
          100: '#f9ede3',
          200: '#f2d9c5',
          300: '#e8bf9c',
          400: '#dc9b70',
          500: '#d17d4a',
          600: '#c3653b',
          700: '#a25232',
          800: '#82432e',
          900: '#6a3928',
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 4px 16px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 24px 0 rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
