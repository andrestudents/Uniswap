// tailwind.config.js
const { heroui } = require("@heroui/react");



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/tabs.js"
  ],

  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};