const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: defaultTheme.colors,
      screens: {
        xs: '480px',
      },
      minHeight: theme => ({
        ...theme('spacing'),
      }),
    },
  },
  variants: {},
  plugins: [],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};
