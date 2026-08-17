import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#04070a",
          900: "#080d12",
          850: "#0d141c",
          800: "#121b24",
          700: "#1b2836",
          600: "#273b4e",
          500: "#3d5770",
          400: "#607d94",
          300: "#8ea4b5",
          200: "#c4d1db",
          100: "#e9eff4",
        },
        cyanAccent: {
          DEFAULT: "#00e5ff",
          dim: "#00a3b8",
          glow: "rgba(0, 229, 255, 0.15)",
          border: "#164e63",
        },
        zincBorder: "#1e293b",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
