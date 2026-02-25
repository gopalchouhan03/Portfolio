/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-sora)', 'Sora', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
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
