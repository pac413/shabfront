import './assets/styles/index.scss'

import * as Sentry from '@sentry/vue'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createHead } from '@vueuse/head'
import axios from 'axios'
import { createPinia } from 'pinia'
import { createApp, provide } from 'vue'
import VueAxios from 'vue-axios'
import VueGtag from 'vue-gtag'
import VueObserveVisibility from 'vue-observe-visibility'
import { VueRecaptchaPlugin } from 'vue-recaptcha'
import { Vue3Mq } from 'vue3-mq'
import VueResize from 'vue3-resize'
import Vue3Toasity, { toast, type ToastContainerOptions } from 'vue3-toastify'

import { installCommonComponents } from '@/plugins/components'
import i18n from '@/plugins/i18n'
import { setupSentry } from '@/plugins/sentry'
import { apolloClient } from '@/plugins/vue-apollo'
import { setupVueLinkify } from '@/plugins/vue-linkify'

import App from './App.vue'
import clickOutsideDirective from './directives/click-outside'
import escDirective from './directives/esc'
import router from './router'
import { store, storeKey } from './store'
import { getLocale, getStyleNumberVariable, isLocal } from './utils'

const pinia = createPinia()
const app = createApp({
  config: {
    devtools: isLocal,
    errorHandler: (err: Error, vm: any, info: string) => {
    // const token = getToken()
    // const networkError = (err as any).networkError as NetworkError
    // // Ignore 401 error when user is not logged in
    // if (!token && networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
    //   return
    // }
    // // const message = err.message
    // //   ? err.message.replace('GraphQL error:', '')
    // //   : 'An error has occurred'
    // const message = this.$t('errors.shabbat-error').toString()
    // this.$bvModal.msgBoxOk(message, {
    //   okVariant: 'danger'
    // })
      Sentry.captureException(err)
      console.error(err, info)
    }
  },
  beforeCreate() {
    provide(DefaultApolloClient, apolloClient)
    // get saved locale setting
    i18n.global.locale.value = getLocale()
  },
  ...App,
})

const head = createHead({})
app.use(head)
app.use(i18n)
app.use(VueAxios, axios)
app.use(Vue3Toasity, {
  autoClose: 3000,
  closeOnClick: true,
  hideProgressBar: true,
  icon: false,
  limit: 5,
  position: toast.POSITION.TOP_RIGHT,
  transition: toast.TRANSITIONS.BOUNCE,
} as ToastContainerOptions)

app.use(pinia)
app.use(VueClipboard)
app.use(Vue3Mq, {
  breakpoints: {
    xs: 0,
    mobile: getStyleNumberVariable('mobileMaxWidth'),
    tablet: getStyleNumberVariable('tabletMaxWidth'),
    laptop: Infinity,
  },
})
// app.use(VueDragDrop)
app.use(VueObserveVisibility)
app.use(VueResize)
// app.use(VueRx)
// app.use(VuejsClipper)
app.use(
  VueGtag,
  {
    config: { id: import.meta.env.VITE_APP_GTAG },
  },
  router,
)
app.use(VueRecaptchaPlugin, {
  v2SiteKey: '6LddFbcUAAAAANpqNMchaGVx8r8cn8kEBMAwPUnP',
})

app.directive('esc', escDirective)
app.directive('click-outside', clickOutsideDirective)
setupVueLinkify(app)

installCommonComponents(app)

app.use(router)
app.use(store, storeKey)
setupSentry(app, router)
app.mount('#app')

declare global {
  interface Window {
    a2a?: any
  }
}
