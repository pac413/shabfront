<template>
  <OverlayMenu
    :id="id"
  >
    <template #icon>
      <FaIcon :icon="['fas', 'ellipsis-h']" />
    </template>
    <template #default="{ hide: hideMenu }">
      <OverlayMenuSection v-if="isAuthor || isAdmin">
        <OverlayMenuItem
          v-if="!feedItem.readonly || isAdmin"
          :icon="['fal', 'pencil-alt']"
          icon-size="xs"
          :label="$t('feed.menu.edit')"
          @hide-menu="hideMenu"
          @click="editPost"
        />
        <OverlayMenuItem
          icon-size="xs"
          :icon="['fal', 'trash']"
          :label="$t('feed.menu.delete')"
          @hide-menu="hideMenu"
          @click="deletePost"
        />
      </OverlayMenuSection>
      <OverlayMenuSection v-if="isFlaggable || (!isAuthor && isFeedPage) || !isAuthor">
        <OverlayMenuItem
          v-if="isFlaggable"
          icon-size="xs"
          :icon="['far', 'flag']"
          :label="$t('feed.menu.flag-content')"
          :hint="$t('feed.menu.flag-content-hint')"
          @hide-menu="hideMenu"
          @click="flagContent"
        />
        <OverlayMenuItem
          v-if="!isAuthor && isFeedPage"
          :icon="['fal', 'eye-slash']"
          icon-size="xs"
          :label="$t('feed.menu.hide-all-posts-from', { name: authorName })"
          :hint="$t('feed.menu.hide-all-posts-from-hint', { name: authorName })"
          @hide-menu="hideMenu"
          @click="hideAllPostsFrom"
        />
        <OverlayMenuItem
          v-if="!isAuthor"
          :icon="['fal', 'exclamation-triangle']"
          icon-size="xs"
          :label="$t('menu-items.profile.report-member')"
          :hint="$t('menu-items.profile.report-member-hint')"
          @hide-menu="hideMenu"
          @click="reportMember"
        />
      </OverlayMenuSection>
      <OverlayMenuSection>
        <OverlayMenuItem
          icon-size="xs"
          tag="router-link"
          target="_blank"
          :icon="['fas', 'external-link-alt']"
          :label="$t('feed.menu.open-new-tab')"
          :hint="$t('feed.menu.open-new-tab-hint')"
          :to="feedPageUrl"
          @hide-menu="hideMenu"
        />
        <OverlayMenuItem
          v-if="isPublicPost"
          v-clipboard:copy="linkAddress"
          icon-size="xs"
          :icon="['far', 'copy']"
          :label="$t('feed.menu.copy-link-to-post')"
          :hint="$t('feed.menu.copy-link-to-post-hint')"
          @hide-menu="hideMenu"
        />
      </OverlayMenuSection>
      <OverlayMenuSection
        v-if="isAdmin"
        title="ADMIN ONLY"
      >
        <OverlayMenuItem
          icon-size="xs"
          :icon="['fal', 'align-slash']"
          :label="$t('feed.menu.hide-post-from-feed')"
          :hint="$t('feed.menu.hide-post-from-feed-hint')"
          @hide-menu="hideMenu"
          @click="hidePost"
        />
        <OverlayMenuItem
          icon-size="xs"
          :icon="['fal', 'comment-slash']"
          :label="$t('feed.menu.restrict-from-posting', { name: authorName })"
          :hint="$t('feed.menu.restrict-from-posting-hint', { name: authorName })"
          @hide-menu="hideMenu"
          @click="restrictPosting"
        />
      </OverlayMenuSection>
    </template>
  </OverlayMenu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import OverlayMenu from '@/components/Common/OverlayMenu/OverlayMenu.vue'
import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import OverlayMenuSection from '@/components/Common/OverlayMenu/OverlayMenuSection.vue'
import { useModal } from '@/composables'
import { IFlaggedContentType } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { type FeedItem, PostPrivacySetting, type SimpleProfile } from '@/types'

export default defineComponent({
  name: 'FeedItemMenu',
  components: {
    OverlayMenu,
    OverlayMenuSection,
    OverlayMenuItem
  },
  props: {
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const router = useRouter()
    const modal = useModal()
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )
    const id = computed(() => {
      const random = Math.random().toString(36).replace('0.', '')
      return `feed-item-menu_${props.feedItem.id}_${random}`
    })

    const authorId = computed(() => {
      const { postedBy } = props.feedItem
      if (typeof postedBy === 'string') {
        return postedBy
      } else {
        return postedBy.id
      }
    })

    const isAuthor = computed(() => authorId.value === activeProfileId.value)

    const isPublicPost = computed(() => props.feedItem.privacySetting === PostPrivacySetting.ALL)

    const feedPageUrl = computed(() => {
      return `/posts/status_update/${props.feedItem.id}`
    })

    const isFlaggable = computed(() => !isAuthor.value)

    const isFeedPage = computed(() => {
      if (!route.name) {
        return false
      }
      return ['FeedPage', 'SingleFeedPage', 'PublicFeedPage', 'FeedItemModal'].includes(route.name.toString())
    })

    const linkAddress = computed(() => {
      const resolved = router.resolve({
        name: 'PublicFeedPage',
        params: { feedId: props.feedItem.id }
      })
      return window.location.origin + resolved.href
    })

    const authorName = computed(() => {
      const { postedBy } = props.feedItem
      const user = typeof postedBy === 'string'
        ? simpleProfileById.value(postedBy)
        : postedBy as SimpleProfile

      if (user) {
        return user?.firstName
      }
      return undefined
    })

    const deletePost = () => {
      showModal({
        modal: Modal.CONFIRM_POST_DELETE,
        props: {
          feedItemId: props.feedItem.id
        }
      })
    }

    const editPost = () => {
      store.commit('feed/PUT_INTO_POST_EDITOR', props.feedItem)
      modal.show('feed-item-preview-modal')
    }

    const reportMember = () => {
      showModal({
        modal: Modal.REPORT_MEMBER,
        props: {
          profileId: authorId.value
        }
      })
    }

    const flagContent = () => {
      showModal({
        modal: Modal.FLAG_CONTENT,
        props: {
          resourceId: props.feedItem.id,
          type: IFlaggedContentType.Post
        }
      })
    }

    const hideAllPostsFrom = () => {
      showModal({
        modal: Modal.CONFIRM_HIDE_ALL_POSTS_FROM,
        props: {
          profileId: authorId.value
        }
      })
    }

    const hidePost = () => {
      showModal({
        modal: Modal.CONFIRM_POST_HIDE_FROM_FEED,
        props: {
          feedItemId: props.feedItem.id
        }
      })
    }

    const restrictPosting = () => {
      showModal({
        modal: Modal.CONFIRM_POSTING_RESTRICT,
        props: {
          profileId: authorId.value
        }
      })
    }

    return {
      activeProfileId,
      authorId,
      authorName,
      deletePost,
      editPost,
      feedPageUrl,
      flagContent,
      hideAllPostsFrom,
      hidePost,
      id,
      isAdmin,
      isAuthor,
      isFeedPage,
      isFlaggable,
      isPublicPost,
      linkAddress,
      reportMember,
      restrictPosting,
      simpleProfileById,
    }
  }
})
</script>

<style lang="scss" scoped>
:global(.b-popover.show) {
  z-index: 1100;
}
</style>
