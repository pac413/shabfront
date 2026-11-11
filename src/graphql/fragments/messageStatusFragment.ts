import gql from 'graphql-tag'

export const MessageStatusFragment = gql`
  fragment MessageStatusFragment on MessageStatusDetails {
    status
    dateSent
    dateRead
  }
`
