import { Integrations } from '@sentry/tracing'
import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import type { Router } from 'vue-router'

import { isLocal } from '@/utils'

export const setupSentry = (app: App, router: Router) => {
  if (!isLocal) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_APP_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENVIRONMENT,
      integrations: [
        new Integrations.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: [
            'localhost',
            'dev.shabbat.com',
            'qa.shabbat.com',
            'uat.shabbat.com',
            'production.shabbat.com',
            /^\//,
          ],
        }),
      ],
      trackComponents: true,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // https://github.com/getsentry/sentry-javascript/issues/2514#issuecomment-603971338
      beforeSend(event, hint) {
        if (hint?.originalException === 'Timeout') {
          return null
        }
        return event
      },
    })
  }
}
