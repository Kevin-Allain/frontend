/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        bgImgTrumpet: "url('/assets/bgTrumpet.jpg')",
      },
      fontFamily: {
        Raleway: ["Raleway", "sans-serif"],
      }, //end of fontFamily
      spacing: {
        global: "2rem",
      },
      colors: {
        primary: "#282a3e",
        accentLight: "#f0b881",

        accent: "#d3a273",
        accentDark: "#967453",
        offWhite: "#f2f2f2",
      },
    },
  },
  plugins: [],
};
