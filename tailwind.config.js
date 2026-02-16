/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cobalt': '#004aad',
        'cobalt-dark': '#00326b',
        'yellow-bolt': '#ffe75b',
        'yellow-shadow': '#e6d35e',
        'light-blue': '#e6f0ff',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
