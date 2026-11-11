<template>
  <BCard class="flagged-content-item__container">
    <div
      class="flagged-content-item__content"
      @click="openDetails"
    >
      <div class="flagged-content-item__section">
        <span class="flagged-content-item__label">Flagged by:</span>
        <RouterLink
          target="_blank"
          :to="reportedByRoute"
          class="flagged-content-item__profile-name"
        >
          <ProfileAvatar
            thumbnail="small"
            :profile="content.reportedBy"
          />
          <b>{{ content.reportedBy.firstName }} {{ content.reportedBy.lastName }}</b>
          <span v-if="content.reportedBy.isZealot"> (<i>Zealot Member</i>)</span>
        </RouterLink>
      </div>

      <div
        v-if="content.ownedBy"
        class="flagged-content-item__section"
      >
        <span class="flagged-content-item__label">Owned by:</span>
        <RouterLink
          target="_blank"
          :to="ownedByRoute"
          class="flagged-content-item__profile-name"
        >
          <ProfileAvatar
            thumbnail="small"
            :profile="content.ownedBy"
          />
          <b>{{ content.ownedBy.firstName }} {{ content.ownedBy.lastName }}</b>
        </RouterLink>
      </div>

      <div class="flagged-content-item__section">
        <span class="flagged-content-item__label">Type:</span>
        <b> {{ contentType }} </b>
      </div>

      <div class="flagged-content-item__section">
        <span class="flagged-content-item__label">Date:</span>
        <b> {{ date }} </b>
      </div>

      <div class="flagged-content-item__item__arrow">
        <button class="btn btn-icon">
          <FaIcon
            :icon="['fas', 'angle-up']"
            :class="{ 'fa-rotate-180': !showMoreDetails }"
          />
        </button>
      </div>
    </div>

    <BCollapse
      :id="'collapse' + content.id"
      v-model="showMoreDetails"
    >
      <div class="flagged-content-item-details">
        <BTabs content-class="mt-3">
          <BTab
            title="Content"
            active
          >
            <Spinner v-if="detailsLoading" />
            <template v-else-if="!details">
              <p v-if="content.type === IFlaggedContentType.Post">
                Post not found
              </p>
              <p
                v-if="content.type === IFlaggedContentType.Comment ||
                  content.type === IFlaggedContentType.CommentReply">
                Comment not found
              </p>
              <p
                v-if="content.type === IFlaggedContentType.MediaAvatar ||
                  content.type === IFlaggedContentType.MediaProfilePicture
                "
              >
                Media not found
              </p>
              <p v-if="content.type === IFlaggedContentType.Endorsement">
                Endorsment not found
              </p>
            </template>
            <template v-else>
              <FlaggedFeedItem
                v-if="content.type === IFlaggedContentType.Post"
                :feed-item="details"
              />
              <FlaggedCommentItem
                v-if="content.type === IFlaggedContentType.Comment ||
                  content.type === IFlaggedContentType.CommentReply
                "
                :comment-item="details"
              />
              <FlaggedMediaItem
                v-if="content.type === IFlaggedContentType.MediaAvatar ||
                  content.type === IFlaggedContentType.MediaProfilePicture
                "
                :media-item="details"
              />
              <FlaggedEndorsementItem
                v-if="content.type === IFlaggedContentType.Endorsement"
                :endorsement-item="details"
              />
            </template>
          </BTab>
          <BTab title="Reason">
            {{ content.reason }}
          </BTab>
        </BTabs>

        <BDropdown
          variant="light"
          right
          no-caret
          pill
          class="flagged-content-item-details__actions-dropdown"
        >
          <template #button-content>
            <FaIcon :icon="['fas', 'ellipsis-h']" />
          </template>
          <BDropdownItem @click.prevent="suspendMember">
            Suspend Member
          </BDropdownItem>
          <BDropdownItem @click.prevent="dismissContent">
            Dismiss
          </BDropdownItem>
          <BDropdownItem @click.prevent="deleteContent">
            Delete Content
          </BDropdownItem>
        </BDropdown>
      </div>
    </BCollapse>

    <ConfirmationDialog
      :id="`unflag-content-confirmation-${content.id}`"
      v-model="showsDismissConfirmationDlg"
      body="Are you sure to unflag this content?"
      title="Dismiss Confirmation"
      @success="onDismissConfirmed"
    />
  </BCard>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import Spinner from '@/components/Common/Spinner.vue'
import { useToast } from '@/composables'
import {
  type IEndorsementFragmentFragment,
  type IFlaggedContentFragmentFragment,
  IFlaggedContentType,
  useUnflagContentMutation,
} from '@/composables/graphql/generated'
import moment from '@/plugins/moment'
import { storeKey } from '@/store'
import { type deleteCommentOnFeedItem } from '@/store/feed/actions/deleteCommentOnFeedItem'
import { type deleteFeedItem } from '@/store/feed/actions/deleteFeedItem'
import { type deleteReplyOnComment } from '@/store/feed/actions/deleteReplyOnComment'
import { type getCommentById } from '@/store/feed/actions/getCommentById'
import { type getCommentReplyById } from '@/store/feed/actions/getCommentReplyById'
import { type getFeedItemById } from '@/store/feed/actions/getFeedItemById'
import type { StoreActionPayload } from '@/store/types'
import { type ConfirmContentDeleteModalProps, Modal, useModalStore } from '@/stores/modal'
import type { FeedItem, Media, PostComment } from '@/types'

import FlaggedCommentItem from './FlaggedCommentItem.vue'
import FlaggedEndorsementItem from './FlaggedEndorsementItem.vue'
import FlaggedFeedItem from './FlaggedFeedItem.vue'
import FlaggedMediaItem from './FlaggedMediaItem.vue'

export default defineComponent({
  name: 'FlaggedContentItem',
  components: {
    ProfileAvatar,
    Spinner,
    ConfirmationDialog,
    FlaggedFeedItem,
    FlaggedCommentItem,
    FlaggedMediaItem,
    FlaggedEndorsementItem,
  },
  props: {
    content: {
      required: true,
      type: Object as () => IFlaggedContentFragmentFragment
    }
  },
  emits: ['deleted'],
  setup(props, context) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const { showErrorToast, showSuccessToast } = useToast()
    const { mutate, onDone, onError } = useUnflagContentMutation({})
    const { t } = useI18n()

    const showMoreDetails: Ref<boolean> = ref(false)
    const detailsLoading = ref(false)
    const details: Ref<FeedItem | PostComment | Media | IEndorsementFragmentFragment | null> = ref(null)
    const showsDismissConfirmationDlg: Ref<boolean> = ref(false)

    const reportedByRoute = computed(() => `/profile/${props.content.reportedBy.handle}`)
    const ownedByRoute = computed(() => `/profile/${props.content.ownedBy.handle}`)
    const contentType = computed(() => {
      const mapping = {
        [IFlaggedContentType.Post]: 'Post',
        [IFlaggedContentType.Comment]: 'Comment',
        [IFlaggedContentType.CommentReply]: 'Comment Reply',
        [IFlaggedContentType.MediaProfilePicture]: 'Picture',
        [IFlaggedContentType.MediaAvatar]: 'Avatar',
        [IFlaggedContentType.Endorsement]: 'Endorsement'
      }
      return mapping[props.content.type]
    })
    const date = computed(() => {
      if (props.content.createdAt) {
        return moment(props.content.createdAt).format('MMM DD, YYYY hh:mm A')
      }
      return null
    })

    const openDetails = async () => {
      if (!showMoreDetails.value && !details.value) {
        // Load the details of the current flagged content
        detailsLoading.value = true
        switch (props.content.type) {
        case IFlaggedContentType.Post: {
          const payload: StoreActionPayload<typeof getFeedItemById> = props.content.resourceId
          const { data } = await store.dispatch('feed/getFeedItemById', payload)
          details.value = data
          break
        }
        case IFlaggedContentType.Comment: {
          const [ postId, commentId ] = props.content.resourceId.split('__')
          const payload: StoreActionPayload<typeof getCommentById> = { postId, commentId }
          const { data } = await store.dispatch('feed/getCommentById', payload)
          details.value = data
          break
        }
        case IFlaggedContentType.CommentReply: {
          const [ postId, commentId, commentReplyId ] = props.content.resourceId.split('__')
          const payload: StoreActionPayload<typeof getCommentReplyById> = { postId, commentId, commentReplyId }
          const { data } = await store.dispatch('feed/getCommentReplyById', payload)
          details.value = data
          break
        }
        case IFlaggedContentType.MediaAvatar:
        case IFlaggedContentType.MediaProfilePicture: {
          const { data } = await store.dispatch('media/getMediaById', props.content.resourceId)
          details.value = data.media
          break
        }
        case IFlaggedContentType.Endorsement:
        default: {
          const { endorsement } = await store.dispatch('profile/getEndorsementById', props.content.resourceId)
          details.value = endorsement
          break
        }
        }
        detailsLoading.value = false
      }

      showMoreDetails.value = !showMoreDetails.value
    }

    // suspend the owner of this content
    const suspendMember = () => {
      showModal({
        modal: Modal.CONFIRM_MEMBER_DELETE,
        props: {
          profileId: props.content.ownedBy.id,
          suspend: true
        }
      })
    }
    
    const dismissContent = () => {
      // show the confirmation modal
      showsDismissConfirmationDlg.value = true
    }


    // unflag the content
    const onDismissConfirmed = () => {
      mutate({ id: props.content.id })
    }

    onDone((result) => {
      if (result.data?.unflagContent) {
        context.emit('deleted', props.content.id)
      } else {
        showErrorToast('Failed to unflag content', 'Failed to unflag content')
      }
      showsDismissConfirmationDlg.value = false
    })

    onError((error) => showErrorToast(error))

    const onDeleteConfirmed = () => {
      context.emit('deleted', props.content.id)

      switch (props.content.type) {
      case IFlaggedContentType.Post: {
        const payload: StoreActionPayload<typeof deleteFeedItem> = { id: props.content.resourceId }
        store.dispatch('feed/deleteFeedItem', payload, { root: true })
        break
      }
      case IFlaggedContentType.Comment: {
        const [ postId, commentId ] = props.content.resourceId.split('__')
        const payload: StoreActionPayload<typeof deleteCommentOnFeedItem> = { postId, commentId }
        store.dispatch('feed/deleteCommentOnFeedItem', payload, { root: true })
        break
      }
      case IFlaggedContentType.CommentReply: {
        const [ postId, commentId, commentReplyId ] = props.content.resourceId.split('__')
        const payload: StoreActionPayload<typeof deleteReplyOnComment> = {
          postId,
          commentId,
          commentReplyId
        }
        store.dispatch('feed/deleteReplyOnComment', payload, { root: true })
        break
      }
      case IFlaggedContentType.MediaAvatar:
      case IFlaggedContentType.MediaProfilePicture: {
        store.dispatch('media/deleteMedia', { id: props.content.resourceId }, { root: true })
        break
      }
      case IFlaggedContentType.Endorsement: {
        store.dispatch('profile/deleteEndorsement', { id: props.content.resourceId }, { root: true })
        break
      }
      }

      showSuccessToast(t('admin.flagged-contents.delete-success'))
    }

    const deleteContent = () => {
      const modalProps: ConfirmContentDeleteModalProps = {
        content: props.content,
        onDeleteConfirmed,
      }

      showModal({
        modal: Modal.CONFIRM_CONTENT_DELETE,
        props: modalProps,
      })
    }

    return {
      IFlaggedContentType,
      showMoreDetails,
      details,
      detailsLoading,
      showsDismissConfirmationDlg,
      reportedByRoute,
      ownedByRoute,
      contentType,
      date,
      openDetails,
      suspendMember,
      dismissContent,
      onDismissConfirmed,
      deleteContent
    }
  }
})
</script>

<style lang="scss" scoped>
.card-body {
  padding: 0;
}

.flagged-content-item__container {
  padding: 1rem;
  margin-bottom: 10px;
}

.flagged-content-item__content {
  position: relative;
}

.flagged-content-item__section {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0px;
  }
}

.flagged-content-item__label {
  display: inline-block;
  width: 100px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.flagged-content-item__profile-name {
  a {
    align-items: center;
    display: flex;
  }

  .b-avatar {
    margin-right: 12px;
  }
}

.flagged-content-item__item__arrow {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  max-width: 40px;
  padding: 0;
}

.flagged-content-item-details {
  position: relative;
  margin-top: 1rem;
}

:global(.flagged-content-item-details__actions-dropdown) {
  position: absolute;
  top: 0px;
  right: 0px;
}

.rtl-at-root {
  .flagged-content-item__label {
    margin-left: 0.5rem;
    margin-right: 0;
  }

  .flagged-content-item__profile-name {
    .b-avatar {
      margin-left: 12px;
      margin-right: 0;
    }
  }
  .flagged-content-item__item__arrow {
    right: auto;
    left: 0px;
  }
}

:global(.rtl-at-root) {
  .flagged-content-item-details__actions-dropdown {
    right: auto;
    left: 0;
  }
}
</style>
