import { type MediaStatus, type MediaSubType, type MediaType } from './enums'
import { type MediaMeta } from './MediaMeta'
import { type MediaThumbnail } from './MediaThumbnail'
import { type Profile } from './Profile'

export type Media = {
  id: string
  mediaType: MediaType
  mediaSubType: MediaSubType
  originalMediaId?: string
  originalFilename: string
  owner?: Profile
  mimetype: string
  originalUrl: string
  performanceUrl?: string
  status: MediaStatus
  thumbnails: MediaThumbnail[]
  meta: MediaMeta

  // The attributes below is not from the backend
  file?: File
}
