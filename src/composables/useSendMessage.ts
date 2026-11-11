import { ref } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import type { UploadMediaParams } from '@/store/media/types'
import { type Media, MediaSubType, MediaType } from '@/types'
import { getBasicScrapedData, getMediaType } from '@/utils'

import { type IConversationFragmentFragment, IMessageType, useCreateMessageMutation } from './graphql/generated'

export const useSendMessage = () => {
  const store = useStore(storeKey)
  const {
    mutate: createMssage,
    onDone: onCreateMessageDone,
    onError: onCreateMessageError,
  } = useCreateMessageMutation(() => ({
    variables: {
      conversationId: '',
    },
  }))
  const onUploadMediaErrorHandler = ref<null | ((error: Error) => void | Promise<void>)>(null)
  const onUploadMediaError = (cb: (error: Error) => void | Promise<void>) => {
    onUploadMediaErrorHandler.value = cb
  }

  const sendMessage = async (params: {
    conversation: IConversationFragmentFragment
    text: string
    attachment: File | null
    originalAttachment: File | null
  }): Promise<void> => {
    const { attachment, conversation, originalAttachment, text } = params
    const webScraped = await getBasicScrapedData(store, text)
    let media: Media | null = null
    let messageType = IMessageType.Text

    if (attachment) {
      const mediaType = getMediaType(attachment)
      const reference: any = { conversationId: conversation.id }
      if (originalAttachment) {
        // this is the case when uploading picture as we upload the original picture first
        const uploadOriginalMediaParams: UploadMediaParams = {
          file: originalAttachment,
          mediaType,
          mediaSubType: MediaSubType.ORIGINAL,
          reference,
        }
        const { data, error } = await store.dispatch('media/uploadMedia', uploadOriginalMediaParams)
        if (error) {
          if (onUploadMediaErrorHandler.value) {
            onUploadMediaErrorHandler.value(error)
          }
          return
        }
        const originalMedia = data as Media
        // Set reference to indicate original media
        reference.originalMediaId = originalMedia.id
      }
      const { data, error } = await store.dispatch('media/uploadMedia', {
        file: attachment,
        mediaType,
        mediaSubType: MediaSubType.MESSAGE,
        reference,
      })
      if (error) {
        if (onUploadMediaErrorHandler.value) {
          onUploadMediaErrorHandler.value(error)
        }
        return
      }
      if (mediaType === MediaType.PICTURE) {
        messageType = IMessageType.Image
      } else if (mediaType === MediaType.VIDEO) {
        messageType = IMessageType.Video
      } else if (mediaType === MediaType.AUDIO) {
        messageType = IMessageType.Audio
      }
      media = data
    }
    createMssage({
      conversationId: conversation.id,
      text,
      type: messageType,
      webScraped,
      ...(media ? { attachmentsIds: [media.id] } : {}),
    })
  }

  return {
    onCreateMessageDone,
    onCreateMessageError,
    onUploadMediaError,
    sendMessage,
  }
}
