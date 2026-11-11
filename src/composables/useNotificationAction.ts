import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { type ActionResult } from '@/types/ActionResult'

import { useToast } from './useToast'

export const useNotificationAction = () => {
  const { t } = useI18n()
  const router = useRouter()
  const { showSuccessToast, showErrorToast } = useToast()

  const next = async (result: ActionResult): Promise<void> => {
    const { redirect, back, message, success } = result

    if (redirect) {
      await router.replace(redirect)
    }
    if (back) {
      await router.back()
    }

    if (message) {
      if (success) {
        showSuccessToast(message, t('profile-view.general.success').toString())
      } else {
        showErrorToast(message, t('profile-view.general.error').toString())
      }
    }
  }

  return {
    next,
  }
}
