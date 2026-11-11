import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import UnheadVite from '@unhead/addons/vite'
import createVuePlugin from '@vitejs/plugin-vue'
import Unfonts from 'unplugin-fonts/vite'
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    Unfonts({
      google: {
        families: [
          // header font
          { name: 'Noto Sans', styles: 'wght@400;700' },
          // body font
          { name: 'Roboto', styles: 'wght@400;700' },
          // font for Hebrew
          { name: 'Heebo', styles: 'wght@400;700' },
          // font for Russian
          { name: 'Source Sans Pro', styles: 'wght@400;700' },
          // special font for dating profile modal
          { name: 'Poppins', styles: 'wght@400;700' },
          // special font for Parsha with Rabbi Juravel
          { name: 'Shrikhand' },
        ]
      }
    }),
    Components({
      resolvers: [BootstrapVueNextResolver()]
    }),
    VueI18nPlugin({
      include: resolve(__dirname, './src/locales/*.json'),
      compositionOnly: true,
      strictMessage: false,
      globalSFCScope: true,
    }),
    svgLoader(),
    UnheadVite(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      '~bootstrap-vue-next': resolve(__dirname, 'node_modules/bootstrap-vue-next'),
      '~@vime/core': resolve(__dirname, 'node_modules/@vime/core'),
    },
    extensions: ['.mjs', 'scss', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/global_prepend.scss";'
      }
    }
  }
})
