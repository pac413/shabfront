import gql from 'graphql-tag'

export const WallpaperFragment = gql`
  fragment WallpaperFragment on Wallpaper {
    id
    originalMediaId
    original
    isPlaceholder
  }
`
