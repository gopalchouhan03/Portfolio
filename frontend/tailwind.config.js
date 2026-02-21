/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(10 10 10 / <alpha-value>)',
        foreground: 'rgb(237 237 237 / <alpha-value>)',
        accent: 'rgb(59 130 246 / <alpha-value>)',
        muted: 'rgb(107 114 128 / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;
