/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      height: {
        calc: 'calc(100% - 1.5rem)',
      },
      colors: {
        green: {
          1000: '#12cf58',
        },
      },
      scale: {
        '101': '1.01',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
