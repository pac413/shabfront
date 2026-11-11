import gql from 'graphql-tag'

export default gql`
  query unviewedMessageNotificationTotal {
    unviewedMessageNotificationTotal {
      unviewedTotal
    }
  }
`
