import { v4 as uuid } from 'uuid'

import { CreateMessageDocument, type ICreateMessageMutation } from '@/composables/graphql/generated'
import { mutateApollo } from '@/plugins/vue-apollo'
import { type UploadMediaParams } from '@/store/media/types'
import { type MessageErrorAction } from '@/store/message/types'
import { type Conversation, type Media, MediaStatus, MediaSubType, type Message, type MessageType, type Profile } from '@/types'
import { getMediaType } from '@/utils'

type Params = {
  conversationId: string
  file: File
  isBroadcastMessage: boolean
  messageType: MessageType
}

type Action = MessageErrorAction<Params, Message>

const generateUploadingMessageFromFile = (params: {
  id: string
  file: File
  text?: string
  isBroadcastMessage: boolean
  type: MessageType
  sender: Profile
  conversation: Conversation
}): Message => {
  const { id, file, sender, conversation, text } = params
  return {
    id: '',
    internalId: uuid(), // This is just a temporary id
    text: text || '',
    type: params.type,
    isBroadcastMessage: params.isBroadcastMessage,
    date: new Date().toUTCString(),
    sender,
    conversation,
    status: {
      status: 'uploading',
      dateSent: new Date().toISOString(),
      dateRead: new Date().toISOString(),
    },
    attachments: [
      {
        id,
        mediaType: getMediaType(file),
        mediaSubType: MediaSubType.MESSAGE,
        originalFilename: file.name,
        mimetype: file.type,
        status: MediaStatus.UPLOADING,
        originalUrl: '',
        thumbnails: [],
        file,
        meta: {},
      },
    ],
  }
}

export const uploadMedia: Action = async ({ commit, dispatch, state, rootState }, params) => {
  const { conversationId, isBroadcastMessage, file, messageType } = params
  const uploadMediaParams: UploadMediaParams = {
    file,
    mediaType: getMediaType(file),
    mediaSubType: MediaSubType.MESSAGE,
    reference: { conversationId },
    onUrlGenerated: (params) => {
      const { id } = params
      const { activeProfile } = rootState.profile
      if (!activeProfile) {
        return
      }
      if (!state.currentConversation) {
        return
      }
      const temporaryMessage: Message = generateUploadingMessageFromFile({
        id,
        file,
        type: messageType,
        sender: activeProfile,
        isBroadcastMessage,
        conversation: state.currentConversation,
      })
      commit('PUSH_MESSAGE', temporaryMessage)
      commit('SET_MESSAGE_LIST_SCROLL_TO_BOTTOM', true)
    },
  }
  const { data, error } = await dispatch('media/uploadMedia', uploadMediaParams, { root: true })
  if (error) {
    return { error }
  }

  const media = data as Media
  const response = await mutateApollo<ICreateMessageMutation>({
    mutation: CreateMessageDocument,
    variables: {
      conversationId,
      attachmentsIds: [media.id],
      type: messageType,
    },
  })
  const newMessage = response.data?.createMessage.message
  commit('PUSH_MESSAGE', newMessage)
  return { data: newMessage as unknown as Message }
}
