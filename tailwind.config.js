/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0c0c0f",
        "surface-elevated": "#16161d",
        foreground: "#f4f4f5",
        muted: "#a1a1aa",
        border: "#27272a",
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
        },
        "accent-secondary": "#06b6d4",
      },
    },
  },
  plugins: [],
};
