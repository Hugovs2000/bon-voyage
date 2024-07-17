/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      height: {
        calc: 'calc(100% - 1rem)',
      },
      colors: {
        green: {
          1000: '#12cf58',
        },
        slate: {
          1000: '#151515',
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
