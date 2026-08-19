/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        vgrBlue: "#005b89",
        greyBg: "#f9fafb",
        grey100: "#f3f4f6",
        grey200: "#e5e7eb",
        grey600: "#4b5563",
      },
    },
  },
  plugins: [],
};
