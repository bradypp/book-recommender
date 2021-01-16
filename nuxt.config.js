import path from 'path';

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'book-recommender',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/styles/index.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Server middleware (https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-servermiddleware)
  serverMiddleware: {
    '/api': '@/api',
  },

  // Define env variables here
  publicRuntimeConfig: {},

  privateRuntimeConfig: {},

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        'postcss-nested': {},
        'postcss-custom-properties': {},
        'postcss-hexrgba': {},
        'postcss-flexbugs-fixes': {},
      },
      preset: {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 1,
        features: {
          'custom-properties': true,
          'nesting-rules': true,
        },
      },
    },
  },
};
