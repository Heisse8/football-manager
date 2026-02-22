/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",   // Sportliches Grün
        lightbg: "#f1f5f9",   // Heller Hintergrund
        card: "#ffffff"
      }
    },
  },
  plugins: [],
} 