/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        paper: "#F2F4F1",
        ink: "#16211D",
        muted: "#5E6B66",
        line: "#D9DFDB",
        leaf: {
          DEFAULT: "#0F5C4A",
          dark: "#0A4638",
          soft: "#E3EFEA",
        },
      },
    },
  },
  plugins: [],
};
