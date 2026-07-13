/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        energy: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        }
      }
    },
  },
  plugins: [],
}
