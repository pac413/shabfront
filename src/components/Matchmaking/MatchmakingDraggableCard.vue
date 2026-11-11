<template>
  <drag :data="profile">
    <ProspectCard
      :source="profile"
      :draggable="false"
    />

    <template #drag-image>
      <profile-avatar
        size="140px"
        rounded="lg"
        thumbnail="large"
        :profile="profile"
      />
    </template>
  </drag>
</template>

<script lang="ts">
import 'vue-easy-dnd/dist/dnd.css'

import { computed,defineComponent } from 'vue'
import { Drag } from 'vue-easy-dnd'
import { useI18n } from 'vue-i18n'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProspectCard from '@/components/Common/ProspectCard.vue'
import { Gender, type Profile } from   '@/types'

export default defineComponent({
  name: 'MatchmakingDraggableCard',
  components: {
    Drag,
    ProspectCard,
    ProfileAvatar,
  },
  props: {
    profile: {
      required: true,
      type: Object as () => Profile,
    }
  },
  emits: ['select', 'drop'],
  setup(props) {
    const { t } = useI18n()

    const dropMenuItemLabel = computed(() => props.profile.gender === Gender.MALE
      ? t('profile-view.dating.drop-guy').toString()
      : t('profile-view.dating.drop-girl').toString()
    )

    return {
      dropMenuItemLabel
    }
  }
})
</script>
