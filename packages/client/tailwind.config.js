module.exports = {
  theme: {
    colors: {
      white: 'hsl(0, 0%, 100%)',
      black: 'hsl(295, 22%, 10%)',
      'accent-light': '#6F91B5', // TODO Potentially remove
      transparent: 'transparent',
      blue: {
        100: 'hsl(203, 95%, 93%)',
        200: 'hsl(206, 86%, 79%)',
        300: 'hsl(210, 77%, 65%)',
        400: 'hsl(213, 69%, 52%)',
        500: 'hsl(216, 60%, 38%)',
        600: 'hsl(219, 65%, 34%)',
        700: 'hsl(221, 70%, 30%)',
        800: 'hsl(224, 75%, 26%)',
        900: 'hsl(227, 80%, 22%)',
      },
      pink: {
        100: 'hsl(330, 90%, 95%)',
        200: 'hsl(334, 79%, 83%)',
        300: 'hsl(338, 68%, 71%)',
        400: 'hsl(342, 57%, 59%)',
        500: 'hsl(346, 46%, 47%)',
        600: 'hsl(348, 63%, 40%)',
        700: 'hsl(350, 71%, 33%)',
        800: 'hsl(351, 83%, 25%)',
        900: 'hsl(353, 95%, 18%)',
      },
      neutral: {
        100: 'hsl(216, 33%, 97%)',
        200: 'hsl(214, 15%, 91%)',
        300: 'hsl(210, 16%, 82%)',
        400: 'hsl(211, 13%, 65%)',
        500: 'hsl(211, 10%, 53%)',
        600: 'hsl(211, 12%, 43%)',
        700: 'hsl(209, 14%, 37%)',
        800: 'hsl(209, 18%, 30%)',
        900: 'hsl(209, 20%, 25%)',
      },
    },
    extend: {},
  },
  variants: {
    margin: ['responsive', 'last'],
  },
  plugins: [],
}
