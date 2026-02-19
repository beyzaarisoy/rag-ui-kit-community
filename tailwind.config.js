/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--bg-primary) / <alpha-value>)",
        surface: "rgb(var(--bg-secondary) / <alpha-value>)",
        primary: "rgb(var(--text-primary) / <alpha-value>)",
        secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      boxShadow: {
        'glow': 'var(--accent-glow)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      }
    },
  },
  plugins: [],
}