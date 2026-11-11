<template>
  <drop 
    class="matchmaking-dropzone-container d-flex align-items-center justify-content-center"
    @drop="handleDrop"
  >
    <ProfileAvatar
      v-if="profile"
      class="dropzone-avatar"
      size="150px"
      rounded="lg"
      thumbnail="large"
      :profile="profile"
    />
    <p
      v-else
      class="dropzone-placeholder"
    >
      {{ placeholder }}
    </p>
    <div
      v-if="profile"
      class="overlay"
    >
      <FaIcon
        class="close-icon"
        :icon="['fa', 'times']"
        @click="handleClear"
      />
    </div>
  </drop>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Drop } from 'vue-easy-dnd'
import { useI18n } from 'vue-i18n'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { useToast } from '@/composables'
import { Gender, MatchmakingType, type Profile } from '@/types'

export default defineComponent({
  name: 'Dropzone',
  components: { ProfileAvatar, Drop },
  props: {
    type: {
      required: true,
      type: String as () => MatchmakingType
    },
    placeholder: {
      required: true,
      type: String
    },
    profile: {
      type: Object as () => Profile | null,
      default: null
    }
  },
  emits: ['drop'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { showErrorToast } = useToast()
    
    const checkIfTypeMatch = (gender: Gender) => {
      if (
        (gender === Gender.MALE && props.type === MatchmakingType.Guys) ||
        (gender === Gender.FEMALE && props.type === MatchmakingType.Girls)
      ) {
        return true
      }
      return false
    }

    const handleDrop = ({ data }: { data: Profile }) => {
      if (!data.gender || !checkIfTypeMatch(data.gender)) {
        return showErrorToast(
          t('matchmaking-view.gender-mismatch-error').toString(),
        )
      }
      emit('drop', props.type, data)
    }

    const handleClear = () => {
      emit('drop', props.type, null)
    }

    return {
      handleDrop,
      handleClear
    }
  }
})
</script>

<style scoped lang="scss">
.matchmaking-dropzone-container {
  position: relative;
  width: 160px;
  height: 160px;
  border: 2px dashed #555;

  .dropzone-placeholder {
    color: #77838f;
    margin-top: 1rem;
  }

  .overlay {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
    }

    .close-icon {
      font-size: 18px;
      color: #ffffff;
    }
  }
}
</style>
