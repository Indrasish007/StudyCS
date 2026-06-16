/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#fefdfa",
        marginLine: "#f87171",
        ruleLine: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "sans-serif"],
        hand: ["Kalam", "cursive"],
        caveat: ["Caveat", "cursive"],
        daughter: ["Architects Daughter", "cursive"],
      },
      boxShadow: {
        notebook: "0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 5px 15px -5px rgba(0, 0, 0, 0.3)",
        ring: "inset -2px 0 6px rgba(0,0,0,0.3), 3px 0 5px rgba(0,0,0,0.15)",
        tab: "4px 0 10px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        ruled: "linear-gradient(var(--rule-line) 1px, transparent 1px)",
      },
      animation: {
        "page-flip": "page-flip 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) forwards",
      },
      keyframes: {
        "page-flip": {
          "0%": { transform: "rotateY(0deg)", transformOrigin: "left center" },
          "100%": { transform: "rotateY(-180deg)", transformOrigin: "left center" },
        },
      },
    },
  },
  plugins: [],
}
