<template>
  <div>
    <div
      v-if="!flaggedContents.length"
      class="flagged-contents__empty text-muted"
    >
      {{ $t('admin.flagged-contents.empty') }}
    </div>

    <FlaggedContentItem
      v-for="item in flaggedContents"
      v-else
      :key="item.id"
      :content="item"
      @deleted="onDeleted"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'

import FlaggedContentItem from '@/components/Admin/FlaggedContents/FlaggedContentItem.vue'
import {
  type IAdminRecentMemberFragmentFragment,
  useFlaggedContentsByProfileLazyQuery
} from '@/composables/graphql/generated'

export default defineComponent({
  name: 'FlaggedContents',
  components: { FlaggedContentItem },
  props: {
    expanded: {
      required: true,
      type: Boolean
    },
    profile: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    }
  },
  setup(props) {
    const { load, result } = useFlaggedContentsByProfileLazyQuery({
      profileId: props.profile.id,
    })
    const flaggedContents = computed(() => {
      return result.value?.flaggedContentsByProfile?.contents || []
    })

    const onDeleted = () => {
      load(undefined, undefined, { fetchPolicy: 'network-only' })
    }

    watch(() => props.expanded, () => {
      if (props.expanded) {
        load()
      }
    }, { immediate: true })

    return {
      flaggedContents,
      onDeleted,
    }
  }
})
</script>
