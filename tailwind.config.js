/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'responsive': 'clamp(12px, 5vw, 2rem)', 
        'responsive2': 'clamp(14px, 2vw, 1rem)', 
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, 
  }, 
  prefix: 'tw-',
  darkMode: 'class'
}

