/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D62828',
        secondary: '#111111',
        background: '#FFFFFF',
        text: '#444444',
      },
    },
  },
  plugins: [],
}
