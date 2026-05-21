import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F5',
        surface: '#FFFFFF',
        'text-primary': '#2A2535',
        'text-secondary': '#6B6480',
        'text-muted': '#8A84A0',
        accent: '#7B6FA0',
        'accent-pink': '#B49AC0',
        'accent-blue': '#8AACD4',
        'accent-muted': '#F2EEF8',
        border: '#EDE8F4',
        'border-muted': '#DDD8E8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Noto Serif SC', 'serif'],
        ui: ['DM Sans', 'sans-serif'],
      },
      maxWidth: {
        '2xl': '42rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;