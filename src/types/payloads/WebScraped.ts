export interface WebScrapedThumbnail {
  type: string
  href: string
  height: number
  width: number
}

export interface WebScrapedIcon {
  type: string
  href: string
  width?: number
  height?: number
}

export interface WebScrapedPlayer {
  type: string
  html: string
  aspect: number
}

export interface WebScrapedIconInput {
  // mimetype of icon
  type?: string
  href?: string
}

export interface WebScrapedPlayerInput {
  type?: string
  html?: string
  href?: string
  // proportion of width and height
  aspect?: number
}

export interface WebScrapedBasic {
  // page canonical url
  canonical?: string
  // site name
  site?: string
  // user typed link
  url?: string
  // page title
  title: string
  thumbnails?: WebScrapedThumbnail[]
}

export interface WebScrapedLarge extends WebScrapedBasic {
  author?: string
  description: string
  icons?: WebScrapedIcon[]
  players?: WebScrapedPlayer[]
}

export interface WebScrapedPostInput extends WebScrapedBasic {
  author?: string
  description: string
  icons?: [WebScrapedIconInput]
  players?: [WebScrapedPlayerInput]
}

export interface IframelyResponse {
  html: string
  links: {
    icon: {
      href: string
      rel: string[]
      type: string
      media?: {
        width: number
        height: number
      }
    }[]
    thumbnail: {
      content_length: number
      href: string
      media: {
        height: number
        width: number
      }
      rel: string[]
      type: string
    }[]
    player: {
      href: string
      rel: string[]
      type: string
      content_length: number
      media: {
        'aspect-ratio': number
        scrolling: boolean
      }
      html: string
    }[]
  }
  meta: {
    author: string
    canonical: string
    description: string
    keywords: string
    site: string
    title: string
  }
  rel: string[]
  url: string
}
