import { ApolloError } from '@apollo/client/errors'
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue3-toastify'

import ErrorToastVue from '@/components/Toasts/ErrorToast.vue'
import InfoToastVue from '@/components/Toasts/InfoToast.vue'
import SuccessToastVue from '@/components/Toasts/SuccessToast.vue'
import type { ParsedError } from '@/utils/errors'

export const useToast = () => {
  const { t } = useI18n()

  return {
    showSuccessToast: (message: string, title?: string, toastId?: string) => {
      const toastTitle = title || t('profile-view.general.success').toString()
      const id = toast.success(
        h(SuccessToastVue, { message,title: toastTitle }), 
        {
          ...(toastId ? { toastId } : {}),
        }
      )
      return id
    },
    showInfoToast: (message: string, title?: string, toastId?: string) => {
      const toastTitle = title || t('profile-view.general.progress').toString()
      const id = toast.info(
        h(InfoToastVue, { message, title: toastTitle }), 
        {
          ...(toastId ? { toastId } : {}) 
        }
      )
      return id
    },
    showErrorToast: (error?: ApolloError | ParsedError | string, title?: string,  toastId?: string) => {
      const toastTitle = title || t('errors.toast-title').toString()
      let message = t('errors.shabbat-error').toString()

      if (error) {
        if (typeof error === 'string') {
          message = error
        } else if (error instanceof ApolloError) {
          if (error.graphQLErrors.length > 0) {
            message = error.graphQLErrors[0].message
          }
        } else {
          message = error.error.message
        }
      }
      const id = toast.error(
        h(ErrorToastVue, { message, title : toastTitle }),
        {
          ...(toastId ? { toastId } : {}),
        }
      )
      return id
    },
    hideToast: (toastId: string) => {
      toast.remove(toastId)
    }
  }
}
