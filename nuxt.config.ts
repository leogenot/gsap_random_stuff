import postcss from './postcss-config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/device',
  ],

  device: {
    refreshOnResize: true
  },

  css: ['~/assets/css/main.css'],
  postcss: postcss,
})
