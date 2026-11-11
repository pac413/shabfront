import { find } from 'linkifyjs'
import { type Store } from 'vuex'

import { type RootState } from '@/store/types'
import { type IframelyResponse, type WebScrapedBasic } from '@/types/payloads/WebScraped'

export const getBasicScrapedData = async (
  store: Store<RootState>,
  content: string,
): Promise<WebScrapedBasic | undefined> => {
  const links = find(content)

  if (links.length) {
    const link = links[links.length - 1]
    const response = await store.dispatch('feed/getPreview', link.href)

    if ('error' in response) {
      return
    }

    const preview: IframelyResponse = response.data
    if (preview && preview.meta) {
      const result: WebScrapedBasic = {
        canonical: preview.meta.canonical,
        site: preview.meta.site,
        url: link.value,
        title: preview.meta.title,
      }

      if (preview.links && preview.links.thumbnail) {
        result.thumbnails = preview.links.thumbnail.map((item) => ({
          height: item.media.height,
          width: item.media.width,
          href: item.href,
          type: item.type,
        }))
      }

      return result
    }
  }
}

export function isValidUrl(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return pattern.test(str)
}
