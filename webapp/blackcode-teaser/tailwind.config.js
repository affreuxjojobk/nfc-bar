/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#e00",
        accent: "#0f0",
      },
    },
  },
  plugins: [],
};
