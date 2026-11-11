export type ErrorWithMessage = {
  errorCode?: string
  message: string
  status: number | null
}

export type ParsedError = {
  error: ErrorWithMessage
}
