import gql from 'graphql-tag'

export default gql`
  query getAllConnections($profileId: ID) {
    getAllConnections(input: { targetProfileId: $profileId }) {
      friendIds
      followerIds
      followingIds
    }
  }
`
