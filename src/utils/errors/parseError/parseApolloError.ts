import { type ApolloError } from '@apollo/client/errors'

import i18n from '@/plugins/i18n'
import { ERROR_MESSAGES } from '@/utils/errors/errorCodes'
import type { ParsedError } from '@/utils/errors/types'

const getMessage = (error: ApolloError, message: string): string => {
  if (error.networkError) {
    return i18n.global.t(ERROR_MESSAGES.NETWORK_ERROR).toString()
  }
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphqlError = error.graphQLErrors[0]
    return graphqlError.message
  }
  if (error.message) {
    return error.message
  }

  return i18n.global.t(message).toString()
}

const getResponseStatus = (error: ApolloError): number | null => {
  if (error.networkError) {
    return null
  }
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphqlError = error.graphQLErrors[0]
    if (graphqlError.extensions && 'code' in graphqlError.extensions) {
      switch (graphqlError.extensions.code) {
      case 'BAD_USER_INPUT':
        return 400
      case 'UNAUTHENTICATED':
        return 401
      case 'FORBIDDEN':
        return 403
      }
    }
  }

  return 500
}

export const parseApolloError = (error: ApolloError, message: string): ParsedError => {
  const errorMessage = getMessage(error, message)
  const status = getResponseStatus(error)

  return {
    error: {
      message: errorMessage,
      status,
    },
  }
}
