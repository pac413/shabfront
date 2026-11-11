<template>
  <div class="endorsement-item">
    <ProfileAvatar
      linkable
      class="avatar"
      size="50px"
      thumbnail="medium"
      :profile="endorsement.endorser"
      linkable-target="_blank"
    />
    <div class="endorsement">
      <div
        class="quote"
        :class="{'contenteditable': isEditing}"
        :contenteditable="isEditing"
        @blur="saveItem"
      >
        {{ endorsement.body }}
      </div>
      <div class="details">
        <RouterLink
          class="endorser-name"
          target="_blank"
          :to="`/profile/${endorsement.endorser.handle}/`"
        >
          {{ endorsement.endorser.displayName }}
        </RouterLink>
        <span v-if="endorsement.date">, {{ dateDiff(endorsement.date) }}</span>
      </div>
      <div
        v-if="shouldShowEndorseBack"
        class="details"
      >
        <RouterLink
          class="endorse-back"
          :to="{
            name: 'Profile',
            params: { handle: endorsement.endorser.handle },
            query: { endorsementModal: endorseBackType }
          }"
        >
          {{ $t('profile-view.host.endorse-back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { type IEndorsementFragmentFragment, IEndorsementSiteRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { generateDateDiffString } from '@/utils'

export default defineComponent({
  name: 'EndorsementItem',
  components: { ProfileAvatar },
  props: {
    endorsement: {
      type: Object as () => IEndorsementFragmentFragment,
      default: null,
    },
    siteRole: {
      type: String as () => IEndorsementSiteRole,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const profile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const isEditing = ref<boolean>(false)

    const shouldShowEndorseBack = computed(() => {
      return profile.value?.id && currentProfile.value?.id === profile.value?.id && !!endorseBackType.value
    })

    const endorseBackType = computed(() => {
      if (props.siteRole === IEndorsementSiteRole.Host) {
        return 'host'
      }
      if (props.siteRole === IEndorsementSiteRole.Guest) {
        return 'guest'
      }
      if (props.siteRole === IEndorsementSiteRole.Dating) {
        return 'dating'
      }
      return ''
    })

    const editItem = () => {
      isEditing.value = !isEditing.value
    }

    const saveItem = () => {
      isEditing.value = false
    }
    
    return {
      currentProfile,
      dateDiff: generateDateDiffString,
      editItem,
      endorseBackType,
      isEditing,
      profile,
      saveItem,
      shouldShowEndorseBack,
    }
  }
})
</script>

<style lang="scss" scoped>
.endorsement-item {
  display: flex;
  padding: 10px;
  flex: 1;

  .avatar {
    flex: 0 0 50px;
    height: 50px;
  }
}

.endorsement {
  flex: 1;
  display: flex;
  padding-left: 15px;
  flex-direction: column;
  justify-content: center;

  .details {
    font-size: 0.8em;
    color: #666;
    padding-top: 2px;

    a.endorser-name {
      color: inherit;
      text-transform: uppercase;
    }
  }

  .contenteditable {
    margin: 0;
  }
}

.rtl-at-root {
  .endorsement {
    padding-left: unset;
    padding-right: 15px;
  }
}
</style>
