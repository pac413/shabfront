import { resendConfirmationEmail as mutate } from '@/graphql/mutations'
import { type ProfileErrorAction } from '@/store/profile/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type ResendConfirmationEmailAction = ProfileErrorAction<void, { status?: boolean; error?: string }>

export const resendConfirmationEmail: ResendConfirmationEmailAction = async () => {
  let response
  try {
    response = await mutate()
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.REPORT_MEMBER)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.REPORT_MEMBER)
  }

  return { data: data.resendConfirmationEmail }
}
