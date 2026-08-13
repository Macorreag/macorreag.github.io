module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00FF41',
        teal: '#00CC66',
        'terminal-bg': '#101710',
      },
      screens: {
        xs: '480px',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
