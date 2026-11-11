import gql from 'graphql-tag'

export default gql`
  query unviewedNonMessageNotificationTotal {
    unviewedNonMessageNotificationTotal {
      unviewedTotal
    }
  }
`
