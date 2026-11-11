<template>
  <ProfileCard
    :icon="['fal', 'images']"
    :title="title"
  >
    <div
      v-if="!showLoadingSpinner && endorsementsTotal === 0"
      class="text-secondary text-center"
    >
      {{ $t('profile-view.general.no-endorsements') }}
    </div>
    <div
      v-else
      class="endorsements-list"
      @scroll="onScroll"
    >
      <EditableEndorsementItem
        v-for="(endorsement, index) in endorsements"
        :key="index"
        :endorsement="endorsement"
        :site-role="siteRole"
        @remove="remove"
        @flag="flag"
        @edit="edit"
      />
      <Spinner v-if="showLoadingSpinner" />
    </div>
    <ConfirmationDialog
      :id="`remove-endorsement-${siteRole}`"
      v-model="removeDlgVisible"
      :body="$t('profile-view.modal.remove-endorsement-prompt')"
      :title="$t('profile-view.modal.remove-endorsement')"
      :success-args="{ endorsementId: selectedItemId }"
      @success="removeEndorsement"
    />
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import EditableEndorsementItem from '@/components/Profile/Endorsement/EditableEndorsementItem.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useToast } from '@/composables'
import {
  type IEndorsementFragmentFragment,
  type IEndorsementSiteRole,
  IFlaggedContentType,
  type ISimpleProfile,
  useEndorsementsLazyQuery,
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { LoadingStatus } from '@/store/types'
import { type EndorsementModalProps, Modal, useModalStore } from '@/stores/modal'
import { SCROLL_PERCENT_FOR_RELOAD } from '@/utils'

export default defineComponent({
  name: 'AllEndorsementsCard',
  components: {
    EditableEndorsementItem,
    ConfirmationDialog,
    ProfileCard
  },
  props: {
    siteRole: {
      type: String as () => IEndorsementSiteRole,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const { showSuccessToast, showErrorToast } = useToast()
    const profile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const { load, onResult, onError } = useEndorsementsLazyQuery({
      profileId: currentProfile.value!.id,
      onSiteRole: props.siteRole,
      offset: 0,
      limit: 10
    })
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const endorsements = ref<IEndorsementFragmentFragment[]>([])
    const endorsementsLoading = ref<LoadingStatus>(LoadingStatus.Unloaded)
    const endorsementsTotal = ref<number>(0)
    const selectedItemId = ref<string | null>(null)
    const removeDlgVisible = ref<boolean>(false)
    const showLoadingSpinner = computed(() => {
      return endorsementsLoading.value === LoadingStatus.Loading
    })

    const isAllLoaded = computed(() => {
      return endorsements.value.length === endorsementsLoading.value && endorsementsLoading.value
    })

    const type = computed(() => {
      return props.siteRole.toLowerCase()
    })
    const title = computed(() => t(`profile-view.${type.value}.endorsements`))

    const loadMore = (reset = false) => {
      if (!reset && endorsementsTotal.value <= endorsements.value.length) {
        return
      }
      endorsementsLoading.value = LoadingStatus.Loading
      load(undefined, {
        profileId: currentProfile.value!.id,
        onSiteRole: props.siteRole,
        offset: endorsements.value.length,
        limit: 10
      }, {
        fetchPolicy: reset ? 'network-only' : 'cache-and-network'
      })
    }

    onResult((result) => {
      if (result.loading) {
        return
      }
      endorsementsLoading.value = LoadingStatus.Loaded
      const edges = result.data?.endorsements.edges.nodes || []
      const total = result.data?.endorsements.total || 0

      const newIds = edges.map((endorsement) => endorsement.id)
      endorsements.value = endorsements.value
        .filter((endorsement) => !newIds.includes(endorsement.id))
        .concat(edges)
      endorsementsTotal.value = total
    })

    onError(error => showErrorToast(error))

    const edit = (item: IEndorsementFragmentFragment) => {
      selectedItemId.value = item.id
      const modalProps: EndorsementModalProps = {
        id: item.id,
        endorser: item.endorser!,
        endorsee: currentProfile.value! as any as ISimpleProfile,
        type: props.siteRole,
        content: item.body!,
        onSubmitted: (endorsement) => {
          const idx = endorsements.value.findIndex(item => item.id === endorsement.id)
          if (idx >= 0) {
            endorsements.value.splice(idx, 1, endorsement)
          }
        }
      }
      showModal({
        modal: Modal.ENDORSEMENT,
        props: modalProps,
      })
    }

    const remove = (item: IEndorsementFragmentFragment) => {
      selectedItemId.value = item.id
      removeDlgVisible.value = true
    }

    const removeEndorsement = async (params: { endorsementId: string }) => {
      if (!selectedItemId.value) {
        return
      }
      try {
        const id = await store.dispatch('profile/deleteEndorsement', {
          siteRole: props.siteRole,
          id: params.endorsementId,
          profileId: currentProfile.value?.id
        })

        showSuccessToast(
          t('profile-view.modal.remove-endorsement-success').toString(),
          t('profile-view.general.success').toString()
        )
        const idx = endorsements.value.findIndex(endorsement => endorsement.id === id)
        if (idx >= 0) {
          endorsements.value.splice(idx, 1)
          endorsementsTotal.value--
        }
      } catch (error) {
        console.error(error)
        showErrorToast(
          t('profile-view.modal.error').toString(), 
          t('profile-view.general.error').toString()
        )
      }
    }

    const flag = (item: IEndorsementFragmentFragment) => {
      showModal({
        modal: Modal.FLAG_CONTENT,
        props: {
          resourceId: item.id,
          type: IFlaggedContentType.Endorsement,
        }
      })
    }

    const onScroll = async (e: Event) => {
      const elem = e.target as HTMLDivElement
      const scrollTrigger = SCROLL_PERCENT_FOR_RELOAD * elem.scrollHeight
      if (elem.scrollTop + elem.clientHeight <= scrollTrigger) {
        // load more endorsements
        await loadMore(false)
      }
    }

    onMounted(() => {
      endorsements.value = []
      loadMore(true)
    })

    return {
      currentProfile,
      edit,
      endorsements,
      endorsementsLoading,
      endorsementsTotal,
      flag,
      isAdmin,
      isAllLoaded,
      loadMore,
      onScroll,
      profile,
      selectedItemId,
      remove,
      removeDlgVisible,
      removeEndorsement,
      showLoadingSpinner,
      title,
    }
  }
})
</script>
<style lang="scss" scoped>
h4 {
  font-size: 1.2rem;
  font-weight: bold;
}

.endorsements-list {
  max-height: 500px;
  overflow-y: auto;
}

.modal-footer {
  box-shadow: 0px -1px 8px #ccc;
}
</style>
