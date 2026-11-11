import gql from 'graphql-tag'

export default gql`
  query unviewedNotificationsTotal {
    unviewedNotificationsTotal {
      unviewedTotal
    }
  }
`
