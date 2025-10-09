/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
        },
        secondary: '#64748b',
      },
      spacing: {
        'section': '2rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '12px',
      }
    },
  },
  plugins: [],
}
