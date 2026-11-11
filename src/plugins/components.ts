import '@/plugins/fontawesome'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { App } from 'vue'

import IconItem from '@/components/Common/IconItem.vue'
import Spinner from '@/components/Common/Spinner.vue'
import ErrorToast from '@/components/Toasts/ErrorToast.vue'
import SuccessToast from '@/components/Toasts/SuccessToast.vue'

export const installCommonComponents = (app: App) => {
  app.component('FaIcon', FontAwesomeIcon)
  app.component('Spinner', Spinner)
  app.component('IconItem', IconItem)
  app.component('ErrorToast', ErrorToast)
  app.component('SuccessToast', SuccessToast)
}
