import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0E7C7B",
          dark: "#0A5F5E",
          light: "#3FA6A5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
