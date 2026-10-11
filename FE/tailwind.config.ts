import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#f8f5f1',
          100: '#efe4d4',
          200: '#ddc7a6',
          300: '#c59f73',
          400: '#a97a4e',
          500: '#7a5637',
          600: '#4a3629',
          700: '#2f241d',
          800: '#201914',
          900: '#17130f',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Segoe UI', 'Noto Sans', 'Arial', 'sans-serif'],
        serif: ['"Times New Roman"', '"Noto Serif"', 'Times', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(47, 30, 12, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
