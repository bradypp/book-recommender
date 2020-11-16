const { colors } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const media = require('./utils/media');

module.exports = {
  future: {
    purgeLayersByDefault: true,
    defaultLineHeights: true,
  },
  purge: {
    enabled: process.env.NODE_ENV !== 'development',
    content: [
      `./components/**/*.{vue,js}`,
      `./layouts/**/*.vue`,
      `./pages/**/*.vue`,
      `./plugins/**/*.{js,ts}`,
      `./nuxt.config.{js,ts}`,
    ],
  },
  theme: {
    corePlugins: {
      container: false,
    },
    screens: {
      '2xl': { max: `${media['2xl']}px` },
      xl: { max: `${media.xl}px` },
      lg: { max: `${media.lg}px` },
      md: { max: `${media.md}px` },
      sm: { max: `${media.sm}px` },
      xs: { max: `${media.xs}px` },
      '2xs': { max: `${media['2xs']}px` },
    },
    // TODO
    fontFamily: {
      primary:
        'Oswald, -apple-system, "Helvetica Neue", "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      secondary: ' Georgia, Cambria, "Times New Roman", Times, serif',
    },
    opacity: {
      0: '0',
      10: '.1',
      20: '.2',
      25: '.25',
      30: '.3',
      40: '.4',
      50: '.5',
      60: '.6',
      70: '.7',
      75: '.75',
      80: '.8',
      90: '.9',
      95: '.95',
      100: '1',
    },
    borderRadius: {
      0: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.25rem',
      '4xl': '1.5rem',
      full: '9999px',
      '50%': '50%',
    },
    colors: {
      black: colors.black,
      white: colors.white,
      grey: {
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
      'grey-cool': colors.gray,
      teal: colors.teal,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
      yellow: colors.yellow,
      orange: colors.orange,
      red: colors.red,
      pink: colors.pink,
      link: '#3182ce',
      'link-dark': '#2c5282',
    },
    fontSize: {
      '2xs': ['0.65rem', { lineHeight: '1rem' }],
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      md: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['4rem', { lineHeight: '1' }],
    },
    extend: {
      outline: {
        blue: ['1px dotted #0000ff', '1px'],
      },
      spacing: {
        28: '7rem',
        36: '9rem',
        44: '11rem',
        52: '13rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '7px': '7px',
        '8px': '8px',
        '9px': '9px',
        '10px': '10px',
        '11px': '11px',
        '12px': '12px',
        '13px': '13px',
        '14px': '14px',
        '15px': '15px',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        'min-content': 'min-content',
        'max-content': 'max-content',
      },
      maxWidth: {
        '1200px': '1200px',
      },
    },
  },
  variants: {},
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls(decl => {
            decl.important = true;
          });
        });
      });
    }),
  ],
};
