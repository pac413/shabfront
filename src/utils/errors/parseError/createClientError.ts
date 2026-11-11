import i18n from '@/plugins/i18n'
import { type ParsedError } from '@/utils/errors/types'

export const createClientError = (message: string): ParsedError => {
  const errorMessage = i18n.global.t(message).toString()
  return {
    error: {
      message: errorMessage,
      status: 500,
    },
  }
}
