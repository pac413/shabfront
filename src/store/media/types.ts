import { type MediaSubType, type MediaType } from '@/types'

export enum LocalMediaStatus {
  UPLOADING = 'uploading',
  ERROR_UPLOADING = 'error-uploading',
  CONFIRMING = 'confirming',
  ERROR_CONFIRMING = 'error-confirming',
  COMPLETED = 'completed',
}

export type MediaData = {
  fileUrl: string | null
  fileContent: string | ArrayBuffer | null
  status: LocalMediaStatus
  sentBytes: number
  totalBytes: number
}

export type MediaUrlInfo = {
  id: string
  url: string
}

export type MediaReference = {
  originalMediaId?: string
  conversationId?: string
  feedItemId?: string
}

export type UploadMediaParams = {
  file: File
  mediaType: string
  mediaSubType: string
  reference?: MediaReference
  profileId?: string
  onUrlGenerated?: (params: MediaUrlInfo) => void
}

export type ConfirmMediaUploadParams = UploadMediaParams & { id: string; mimetype: string }

export type UpdateMediaParams = {
  id: string
  mediaType: MediaType
  MediaSubType: MediaSubType
}

export interface MediaState {
  mediaDataById: { [key: string]: MediaData }
}
