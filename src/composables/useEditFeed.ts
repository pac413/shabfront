import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { type createFeedItem } from '@/store/feed/actions/createFeedItem'
import { type updateFeedItem } from '@/store/feed/actions/updateFeedItem'
import type { MediaUrlInfo } from '@/store/media/types'
import type { StoreActionPayload } from '@/store/types'
import { type FeedItem, type Media, MediaSubType, MediaType, type Picture, type WebScrapedLarge } from '@/types'

import { useModal } from './useModal'
import { useToast } from './useToast'

export const useEditFeed = () => {
  const { t } = useI18n()
  const store = useStore(storeKey)
  const modal = useModal()
  const { showSuccessToast, showErrorToast } = useToast()
  const editableFeed = computed(() => store.state.feed.editableFeed)
  const feedItemAttachment = ref<File | null>(null)
  const feedItemEditPictureItem = ref<Picture | null>(null)
  const feedItemSubmitLoading = ref<boolean>(false)
  const isGeneralFeedList = ref<boolean>(false)
  const originalAttachment = ref<File | null>(null)

  const FEED_ITEM_PREVIEW_MODAL_ID = 'feed-item-preview-modal'
  const FEED_ITEM_PREVIEW_UPM_ID = 'feed-item-preview-upload-picture-modal'
  const FEED_ITEM_PREVIEW_UVM_ID = 'feed-item-preview-upload-video-modal'

  // functions for FeedItemPreviewModal
  const toggleFeedItemPreviewModal = (visibility: boolean) => {
    if (visibility) {
      modal.show(FEED_ITEM_PREVIEW_MODAL_ID)
    } else {
      modal.hide(FEED_ITEM_PREVIEW_MODAL_ID)
    }
  }

  const openUploadPictureModal = () => {
    toggleFeedItemPreviewModal(true)
    modal.show(FEED_ITEM_PREVIEW_UPM_ID)
  }

  const openUploadVideoModal = () => {
    toggleFeedItemPreviewModal(true)
    modal.show(FEED_ITEM_PREVIEW_UVM_ID)
  }

  const openJobModal = () => {
    toggleFeedItemPreviewModal(true)
    // TODO: Open job modal
  }

  const addPicture = (file: File, originalFile: File) => {
    feedItemAttachment.value = file
    originalAttachment.value = originalFile
  }

  const addVideo = (input: { url: string; file: File }) => {
    const { file } = input
    feedItemAttachment.value = file
  }

  const clearFeedItemAttachment = () => {
    feedItemAttachment.value = null
    feedItemEditPictureItem.value = null
  }

  const editFeedItemAttachment = (editableItem: Picture | null) => {
    feedItemEditPictureItem.value = editableItem
    openUploadPictureModal()
  }

  const uploadAttachment = async (feedItem: FeedItem, attachment: File) => {
    let media: Media
    const editing = !!editableFeed.value
    if (editableFeed.value && editableFeed.value.id) {
      const editableFeedId = editableFeed.value.id
      media = await store.dispatch('feed/uploadMedia', {
        file: attachment,
        mediaSubType: MediaSubType.POST,
        reference: { feedItemId: feedItem.id, originalMediaId: editableFeed.value.medias[0].originalMediaId },
        onUrlGenerated: (params: MediaUrlInfo) => {
          const newFeedItem: FeedItem = {
            ...feedItem,
            attachmentMediaId: params.id,
            id: editableFeedId,
            editableFeedId: feedItem.id,
          }
          store.commit('feed/PUSH_FEED_ITEM', newFeedItem)
        },
      })
    } else {
      const reference: any = { feedItemId: feedItem.id }
      if (originalAttachment.value) {
        // this is the case when uploading picture as we upload the original picture first
        const originalMedia = await store.dispatch('feed/uploadMedia', {
          file: originalAttachment.value,
          mediaSubType: MediaSubType.ORIGINAL,
          onUrlGenerated: (params: MediaUrlInfo) => {
            const newFeedItem: FeedItem = {
              ...feedItem,
              processingMediaId: params.id,
            }
            store.commit('feed/PUSH_FEED_ITEM', newFeedItem)
          },
        })
        store.commit('feed/PUSH_FEED_ITEM', feedItem)

        // Set reference to indicate original media
        reference.originalMediaId = originalMedia.id
      }
      media = await store.dispatch('feed/uploadMedia', {
        file: attachment,
        mediaSubType: MediaSubType.POST,
        reference: reference,
        onUrlGenerated: (params: MediaUrlInfo) => {
          const newFeedItem: FeedItem = {
            ...feedItem,
            attachmentMediaId: params.id,
          }
          store.commit('feed/PUSH_FEED_ITEM', newFeedItem)
        },
      })
    }

    // Trigger a toast that media upload is done
    const toastMessage =
      media.mediaType === MediaType.PICTURE
        ? t('post.upload-photo-success').toString()
        : t('post.upload-video-success').toString()
    showSuccessToast(toastMessage, t('profile-view.general.success').toString())

    // Push a feed item with uploaded media
    if (!editing) {
      const updatedFeedItem: FeedItem = {
        ...feedItem,
        medias: [media],
      }
      store.commit('feed/PUSH_FEED_ITEM', updatedFeedItem)
    }
  }

  const createOrUpdateFeedItem = async (params: {
    content: string
    webScraped: WebScrapedLarge | null
    attachment: File | null
    currentAttachments: Media[]
  }) => {
    toggleFeedItemPreviewModal(false)
    const { content, webScraped, attachment, currentAttachments } = params
    feedItemSubmitLoading.value = true
    // create a feed payload

    try {
      // dispatch post action to create or update
      if (editableFeed.value && editableFeed.value.id) {
        const payload: StoreActionPayload<typeof updateFeedItem> = {
          id: editableFeed.value.id,
          content,
          webScraped: webScraped as any,
          /**
           * - When you are editing from profile feed, add updated feed item
           * - When you are editing from general feed, add updated feed item when it's not text-only post
           */
          shouldAddToFeedItemStore: Boolean(isGeneralFeedList.value && !currentAttachments.length && !attachment),
        }

        const response = await store.dispatch('feed/updateFeedItem', payload)
        if ('error' in response) {
          feedItemSubmitLoading.value = false
          return showErrorToast(response)
        }
        const feedItem: FeedItem = response.data

        // Upload a new attachment
        if (attachment) {
          await uploadAttachment(feedItem, attachment)
        }
      } else {
        const payload: StoreActionPayload<typeof createFeedItem> = {
          content,
          webScraped: webScraped as any,
          /**
           * - When you are adding from profile feed, add new feed item
           * - When you are adding from general feed, add new feed item when it's not text-only post
           */
          shouldAddToFeedItemStore: Boolean(
            !isGeneralFeedList.value || (isGeneralFeedList.value && (attachment || webScraped)),
          ),
        }
        const response = await store.dispatch('feed/createFeedItem', payload)
        if ('error' in response) {
          feedItemSubmitLoading.value = false
          return showErrorToast(response)
        }
        const feedItem: FeedItem = response.data
        if (attachment) {
          await uploadAttachment(feedItem, attachment)
        }
      }
    } finally {
      feedItemSubmitLoading.value = false
    }
  }

  const resetFeedItem = () => {
    feedItemAttachment.value = null
    feedItemEditPictureItem.value = null
    store.commit('feed/PUT_INTO_POST_EDITOR', null)
  }

  return {
    addPicture,
    addVideo,
    clearFeedItemAttachment,
    createOrUpdateFeedItem,
    editableFeed,
    editFeedItemAttachment,
    FEED_ITEM_PREVIEW_MODAL_ID,
    FEED_ITEM_PREVIEW_UPM_ID,
    FEED_ITEM_PREVIEW_UVM_ID,
    feedItemAttachment,
    feedItemEditPictureItem,
    feedItemSubmitLoading,
    isGeneralFeedList,
    openJobModal,
    openUploadPictureModal,
    openUploadVideoModal,
    originalAttachment,
    resetFeedItem,
    toggleFeedItemPreviewModal,
    uploadAttachment,
  }
}
