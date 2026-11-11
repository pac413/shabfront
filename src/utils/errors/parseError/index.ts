import { ApolloError } from '@apollo/client/errors'
import axios, { type AxiosError } from 'axios'

import type { ParsedError } from '@/utils/errors/types'

import { createClientError } from './createClientError'
import { parseApolloError } from './parseApolloError'
import { parseAxiosError } from './parseAxiosError'

export * from './createClientError'

export const parseError = (error: AxiosError | ApolloError | Error, message: string): ParsedError => {
  if (error instanceof ApolloError) {
    return parseApolloError(error, message)
  }

  if (axios.isAxiosError(error)) {
    return parseAxiosError(error, message)
  }

  return createClientError(message)
}
