module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, 
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      scrollbar: ['rounded'], 
    },
  },
  plugins: [
    require('tailwind-scrollbar'), 
  ],
};
