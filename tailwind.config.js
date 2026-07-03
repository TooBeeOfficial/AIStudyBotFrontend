module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      screens: {
        'xs': '750px',
      },
    },
  },
  plugins: [require('daisyui')],
};
