/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      height: {
        calc: 'calc(100% - 1rem)',
        'calc-screen': 'calc(100vh - 3rem)',
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
      keyframes: {
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(5px)' },
          '50%': { transform: 'translateX(0)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'bounce-x': 'bounce-x 1s ease-in-out',
      },
      boxShadow: {
        'inner-around': 'inset 0px 0px 30px 0px rgba(0, 0 , 0 , 0.5);',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
