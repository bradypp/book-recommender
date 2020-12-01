const plugin = require('tailwindcss/plugin');
const media = require('./utils/media');

module.exports = {
  corePlugins: {
    container: false,
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
    screens: {
      '2xl': { max: `${media['2xl']}px` },
      xl: { max: `${media.xl}px` },
      lg: { max: `${media.lg}px` },
      md: { max: `${media.md}px` },
      sm: { max: `${media.sm}px` },
      xs: { max: `${media.xs}px` },
      '2xs': { max: `${media['2xs']}px` },
    },
    fontFamily: {
      primary: '"Roboto Slab", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      secondary:
        'Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000',
        white: '#fff',
      },
      maxWidth: {
        screen: '100vw',
        'screen-sm': `${media.sm}px`,
        'screen-md': `${media.md}px`,
        'screen-lg': `${media.lg}px`,
        'screen-xl': `${media.xl}px`,
      },
    },
  },
  variants: {
    extend: {},
  },
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
