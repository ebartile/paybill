/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./docs/index.mdx",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // This prevents Tailwind from resetting global styles
  },
}