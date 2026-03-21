import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090B'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'bebas': ['var(--font-bebas)', 'sans-serif'],
        'epilogue': ['var(--font-epilogue)', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
