<template>
  <ProfileCard
    :icon="icon"
    :title="title"
  >
    <slot />
    <IconItem
      v-if="!viewingSelf && references.length > 0"
      v-BModal="'references-' + type"
      class="link-style"
      :icon="['fal', 'comment']"
      :item-text="viewReferencesText"
    />
    <div v-if="endorsementsTotal">
      <hr>
      <h6 class="endorsement-title">
        {{ endorsementTitle }}
        <div
          v-if="!viewingSelf"
          class="add-endorsement-wrapper inline-icon-button"
        >
          <span
            v-b-tooltip.hover.bottom="addEndorsementText"
            class="add-span"
            @click="showEndorsementModal"
          >+</span>
        </div>
      </h6>
      <div
        v-for="(item, index) in endorsements"
        :key="index"
      >
        <EndorsementItem
          :endorsement="item"
          :site-role="siteRole"
        />
      </div>
      <div
        class="view-all-link"
        @click="$emit('view-all')"
      >
        {{ $t('profile-view.host.view-all') }} ({{ endorsementsTotal }})...
      </div>
    </div>
    <div
      v-else-if="!viewingSelf"
      @click="showEndorsementModal"
    >
      <IconItem
        class="link-style"
        :icon="['fal', 'square-plus']"
        :item-text="addEndorsementText"
      />
    </div>
    <BModal
      v-if="!viewingSelf"
      :id="referenceModalId"
      v-model="isReferenceModalVisible"
      centered
      size="md"
      :title="referencesModalTitle"
    >
      <div v-html="referencesModalContent" />
      <div class="footnote">
        {{ referencesModalFootnote }}
      </div>
      <template #footer>
        <BButton
          variant="primary"
          @click="requestReference"
        >
          {{ referencesModalButton }}
        </BButton>
      </template>
    </BModal>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import EndorsementItem from '@/components/Profile/Endorsement/EndorsementItem.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useModal, useRegisterModal, useToast } from '@/composables'
import type { IEndorsementFragmentFragment, ISimpleProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type EndorsementModalProps, Modal, useModalStore } from '@/stores/modal'
import { type Reference, type SiteRole } from '@/types'

export default defineComponent({
  name: 'SubProfileCard',
  components: {
    EndorsementItem,
    ProfileCard
  },
  props: {
    icon: {
      type: Array as () => string[],
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
    siteRole: {
      type: String as () => SiteRole,
      required: true,
    },
    endorsements: {
      type: Array as () => IEndorsementFragmentFragment[],
      default: () => [],
    },
    endorsementsTotal: {
      type: Number,
      required: true,
    },
    references: {
      type: Array as () => Reference[],
      default: () => [],
    },
  },
  emits: ['endorsement-submitted', 'view-all'],
  setup(props, context) {
    const { endorsementsTotal, siteRole, references } = toRefs(props)
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const router = useRouter()
    const { showSuccessToast, showErrorToast } = useToast()
    const modal = useModal()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const displayName = computed(() => currentProfile.value?.displayName)
    const type = computed(() => siteRole.value.toLowerCase())
    const referenceModalId = computed(() => 'references-' + type.value)
    const endorsementTitle = computed(() =>
      `${t(`profile-view.${type.value}.endorsements`)} (${endorsementsTotal.value})`
    )
    const addEndorsementText = computed(() => t(`profile-view.${type.value}.add-endorsement`))
    const viewReferencesText = computed(() =>
      `${t(`profile-view.${type.value}.view-references`)} (${references.value.length})`
    )
    const referencesModalTitle = computed(() =>
      (displayName.value + ' ' + t(`profile-view.${type.value}.references`) + ' (' + references.value.length +')')
    )
    const referencesModalContent = computed(() =>
      t(`profile-view.${type.value}.reference-modal-text`, { firstName: currentProfile.value?.firstName })
    )
    const referencesModalFootnote = computed(() =>
      t(`profile-view.${type.value}.reference-modal-note`)
    )
    const referencesModalButton = computed(() =>
      t(`profile-view.${type.value}.reference-modal-button`)
    )
    const { isVisible: isReferenceModalVisible } = useRegisterModal(referenceModalId)

    const showEndorsementModalFromRoute = () => {
      const { endorsementModal: routeType } = route.query || {}
      if (routeType !== siteRole.value.toLowerCase() || viewingSelf.value) {
        return
      }
      showEndorsementModal()
    }

    const showEndorsementModal = () => {
      const { hostingId, endorsingBack } = route.query || {}
      const modalProps: EndorsementModalProps = {
        endorser: activeProfile.value! as any as ISimpleProfile,
        endorsee: currentProfile.value! as any as ISimpleProfile,
        type: siteRole.value as any,
        endorsingBack: endorsingBack === 'true',
        reference: typeof hostingId === 'string' ? { hostingId } : undefined,
        onClosed: () => {
          const { handle } = route.params
          router.push({
            name: 'Profile',
            params: {
              handle,
            },
          })
        },
        onSubmitted: () => {
          context.emit('endorsement-submitted')
        }
      }
      showModal({
        modal: Modal.ENDORSEMENT,
        props: modalProps,
      })
    }

    const requestReference = async () => {
      if (viewingSelf.value) {
        return
      }
      try {
        await store.dispatch('profile/requestReference', currentProfile.value?.id)
        showSuccessToast(
          t(`profile-view.${type.value}.reference-modal-success`, {
            firstName: currentProfile.value?.firstName
          }).toString()
        )
      } catch (error: any) {
        showErrorToast(error, t('profile-view.general.error').toString())
        console.error(error.message)
      }
      modal.hide(`references-${type.value}`)
    }

    watch(activeProfile, () => showEndorsementModalFromRoute(), { immediate: true })
    watch(currentProfile, () => showEndorsementModalFromRoute(), { immediate: true })
    watch(siteRole, () => showEndorsementModalFromRoute(), { immediate: true })
    watch(() => route.query, () => showEndorsementModalFromRoute(), { immediate: true })

    return {
      activeProfile,
      addEndorsementText,
      currentProfile,
      displayName,
      endorsementTitle,
      isReferenceModalVisible,
      referencesModalButton,
      referencesModalContent,
      referencesModalFootnote,
      referenceModalId,
      referencesModalTitle,
      requestReference,
      showEndorsementModal,
      showEndorsementModalFromRoute,
      type,
      viewingSelf,
      viewReferencesText,
    }
  },
})
</script>
<style lang="scss" scoped>
.add-span {
    height: 20px;
    width: 8px;
    font-weight: bold;
}

.endorsement-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
}

.modal-footer {
  align-items: center;
  button {
    border-radius: 18px;
  }
}

.footnote {
  font-size: 0.9em;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}
</style>
