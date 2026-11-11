import { type Media, MediaType } from '@/types'

import { ImageSize } from './consts'
import { getToken } from './token'

export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      resolve(this.result)
    }
    reader.onerror = function (e) {
      reject(e)
    }
  })
}

/**
 * Backend will return the attachment url in the following formats:
 * https://dev.shabbat.com/AAA?accessToken={accessToken}
 */
export const getPublicMediaUrl = (url: string, accessToken?: string): string => {
  if (!url) {
    return ''
  }
  if (!accessToken) {
    accessToken = getToken() || undefined
  }
  return url.replace('accessToken={accessToken}', accessToken ? `accessToken=${accessToken}` : '')
}

/**
 * Returns Public media url
 * If thumbnail exists, use the thumbnail.
 * If not, use the original one.
 */
export const maybeGetPublicThumbnailMediaUrl = (media: Media): string | null => {
  let mediaUrl

  if (media.thumbnails.length > 0) {
    mediaUrl = media.thumbnails[0].url
  } else {
    mediaUrl = media.originalUrl
  }

  return getPublicMediaUrl(mediaUrl)
}

// TODO: need to be more specific to get all possible mimetypes for media types
export const getMediaType = (file: File) => {
  if (file) {
    const mimeType: string = file['type']
    switch (mimeType.split('/')[0]) {
    case 'image':
      return MediaType.PICTURE
    case 'video':
      return MediaType.VIDEO
    case 'audio':
      return MediaType.AUDIO
    default:
      break
    }
    if (mimeType.split('/')[1] === 'pdf') {
      return MediaType.PDF
    }
  }
  // by default
  return MediaType.PICTURE
}

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',')
  const first = arr[0].match(/:(.*?);/)
  if (first) {
    const mime = first[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }
}

export const validateImage = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onload = function () {
      const { width, height } = img
      const minValidated = Math.min(width, height) > ImageSize.minimum
      const maxValidated = Math.max(width, height) < ImageSize.maximum
      resolve({
        minValidated,
        maxValidated,
      })
    }
    img.onerror = function (e) {
      reject(e)
    }
  })
}
