import gql from 'graphql-tag'

import { mutateApollo } from '@/plugins/vue-apollo'

const RESEND_CONFIRMATION_EMAIL = gql`
  mutation resendConfirmationEmail {
    resendConfirmationEmail {
      status
      error
    }
  }
`

type ResponseData = {
  resendConfirmationEmail: {
    status?: boolean
    error?: string
  }
}

export const resendConfirmationEmail = () =>
  mutateApollo<ResponseData>({
    mutation: RESEND_CONFIRMATION_EMAIL,
  })
