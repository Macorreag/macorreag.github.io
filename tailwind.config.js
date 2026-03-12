
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        primary: '#FF6600',
        teal: '#00F5FF',
        'terminal-bg': '#1E1E1E',
      },
      screens: {
        xs: '480px',
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  variants: {},
  plugins: [
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ]
}
