/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0551b5",
        secondary: "#14171A",
        background: "#F7F9F9",
        custom1: "#179BD7",
        custom2: "#3B82F6",
        customBlue: "blue-500",
        customGreyHover: "#EDF2F4",
      },

      fontFamily: {
        // sans: ["Inter", "Arial", "sans-serif"],
        // sans: ["pp-sans-small-regular,Helvetica Neue,Arial,sans-serif"],
        sans: ["PayPalSansSmall-Regular,Helvetica Neue,Arial,sans-serif"],
      },
      // spacing: {
      //   72: "18rem",
      // },
    },
  },
  plugins: [],
};
