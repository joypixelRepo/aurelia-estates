import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0c',
          900: '#101014',
          800: '#16161b',
          700: '#1d1d24',
          600: '#2a2a33',
        },
        sand: {
          50: '#faf7f2',
          100: '#f3ede2',
          200: '#e6dcc8',
          300: '#d4c4a3',
          400: '#bda57c',
          500: '#a78a5c',
        },
        gold: {
          400: '#d4b483',
          500: '#c9a368',
          600: '#a8854f',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
