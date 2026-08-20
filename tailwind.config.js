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
        grey50: "#f9fafb",
        greyBg: "#f9fafb",
        grey100: "#f3f4f6",
        grey200: "#e5e7eb",
        grey500: "#6b7280",
        grey600: "#4b5563",
        blue50: "#eff6ff",
        blue100: "#dbeafe"
      },
    },
  },
  plugins: [],
};
