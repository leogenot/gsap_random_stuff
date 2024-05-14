import postcss from './postcss-config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@vueuse/nuxt', '@nuxtjs/device', 'nuxt-icons', "@nuxt/image", "@nuxt/scripts"],

  device: {
    refreshOnResize: true
  },

  css: ['~/assets/css/main.css'],
  postcss: postcss,

  build: {
    transpile: ["three"],
  },
})