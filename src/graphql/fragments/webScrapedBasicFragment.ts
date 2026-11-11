import gql from 'graphql-tag'

export const WebScrapedBasicFragment = gql`
  fragment WebScrapedBasicFragment on WebScrapedBasic {
    canonical
    url
    site
    title
    thumbnails {
      href
      height
      width
    }
  }
`
