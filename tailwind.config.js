/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/js/*.{html,js}', './views/**/*.{html,js,ejs}'],
  theme: {
    extend: {
      colors: {
        teal: '#388087',
        blue: '#badfe7',
        mint: '#c2edce',
        smoke: '#f6f6f2',
        red: '#ff6961',
      },
    },
  },
  plugins: [],
};
