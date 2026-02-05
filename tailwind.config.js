module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
      },
      animation: {
        slide: "slide 0.25s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
