import gql from 'graphql-tag'

export const WebScrapedPostFragment = gql`
  fragment WebScrapedPostFragment on WebScrapedPost {
    canonical
    url
    site
    author
    title
    description
    thumbnails {
      href
      height
      width
    }
    icons {
      href
    }
    players {
      html
    }
  }
`
