/** @type {import('tailwindcss').Config} */
import { wedgesTW } from "@lemonsqueezy/wedges";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@lemonsqueezy/wedges/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [wedgesTW()],
};
