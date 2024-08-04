import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import solid from 'vite-plugin-solid'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    solid(),
    adonisjs({
      entrypoints: ['inertia/app/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  server: {
    port: 3000,
    // https: true,
    hmr: {
      host: 'localhost',
      port: 3001,
      protocol: 'ws',
    },
  },
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./variables.scss";`,
      },
    },
  },
})
