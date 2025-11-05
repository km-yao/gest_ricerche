// https://nuxt.com/docs/api/configuration/nuxt-config

// import { CustomPreset } from './app/assets/js/theme'
import Nora from '@primeuix/themes/nora'
import { definePreset } from '@primeuix/themes'

const CustomPreset = definePreset(Nora, {
  semantic: {
    primary: {
      0: '{indigo.50}',
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '{slate.100}',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
        },
        formField: {
          focusBorderColor: '{indigo.100}'
        }
      },
      dark: {
        surface: {
          0: '{slate.100}',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
        },
        formField: {
          focusBorderColor: '{indigo.100}'
        }
      }
    }
  }
})

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@primevue/nuxt-module'
  // ,'@nuxt/ui'
  ],
  ssr: false,

  devtools: {
    enabled: true
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Gestione Ricerche',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      htmlAttrs: {
        lang: 'it'
      }
    }
  },

  css: ['~/assets/css/main.css'],

  build: {
    transpile: [/vue3-library-reproduction/]
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      theme: {
        preset: CustomPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark'
        }
      }
    }
  }

})
