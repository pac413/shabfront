import { type AxiosError } from 'axios'

import i18n from '@/plugins/i18n'
import { ERROR_MESSAGES } from '@/utils/errors/errorCodes'
import { type ParsedError } from '@/utils/errors/types'

const getMessage = (error: AxiosError, message: string): string => {
  if (error.message && error.message === 'Network Error') {
    return i18n.global.t(ERROR_MESSAGES.NETWORK_ERROR).toString()
  }

  if ((error.response?.data as any)?.message) {
    return (error.response as any).data.message
  }

  return i18n.global.t(message).toString()
}

const getErrorCode = (error: AxiosError): string => {
  return (error.response?.data as any)?.errorCode
}

const getResponseStatus = (error: AxiosError) => (error.response && error.response.status) || null

export const parseAxiosError = (error: AxiosError, message: string): ParsedError => {
  const errorMessage = getMessage(error, message)
  const errorCode = getErrorCode(error)
  const status = getResponseStatus(error)
  return {
    error: {
      message: errorMessage,
      status,
      errorCode,
    },
  }
}
