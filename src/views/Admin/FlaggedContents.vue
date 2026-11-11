<template>
  <ProfileCard
    :title="$t('admin.flagged-contents.title')"
    :icon="['fal', 'users']"
  >
    <div
      v-if="!loading && !flaggedContents.length"
      class="flagged-contents__empty text-muted"
    >
      {{ $t('admin.flagged-contents.empty') }}
    </div>

    <flagged-content-item
      v-for="item in flaggedContents"
      :key="item.id"
      :content="item"
      @deleted="onDeleted"
    />
    <InfiniteLoading
      :distance="500"
      @infinite="infiniteHandler"
    >
      <template #spinner>
        <Spinner
          :small="true"
          type="grow"
        />
      </template>
      <template #complete>
        <span></span>
      </template>
    </InfiniteLoading>
  </ProfileCard>
</template>

<script lang="ts">
import 'v3-infinite-loading/lib/style.css'

import InfiniteLoading from 'v3-infinite-loading'
import { defineComponent, ref } from 'vue'

import FlaggedContentItem from '@/components/Admin/FlaggedContents/FlaggedContentItem.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import {
  type IFlaggedContentFragmentFragment,
  useFlaggedContentsLazyQuery,
} from '@/composables/graphql/generated'
import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

export default defineComponent({
  name: 'FlaggedContents',
  components: {
    FlaggedContentItem,
    InfiniteLoading,
    ProfileCard,
  },
  setup() {
    const flaggedContents = ref<IFlaggedContentFragmentFragment[]>([])
    const total = ref<number>(0)
    const infiniteStageChanger = ref<any>(null)
    const { load, loading, onResult } = useFlaggedContentsLazyQuery({
      offset: 0,
      limit: PROFILE_LIST_PAGE_SIZE,
    })

    const onDeleted = (contentId: string) => {
      const idx = flaggedContents.value.findIndex(({ id }) => contentId === id)
      if (idx >= 0) {
        flaggedContents.value.splice(idx, 1)
      }
    }

    const infiniteHandler = (stateChanger: any) => {
      infiniteStageChanger.value = stateChanger
      load(undefined, {
        offset: flaggedContents.value.length,
        limit: PROFILE_LIST_PAGE_SIZE,
      })
    }

    const updateScroller = () => {
      if (!infiniteStageChanger.value) {
        return
      }

      // if no more items, let's complete
      if (flaggedContents.value.length === total.value) {
        infiniteStageChanger.value.complete()
      } else {
        infiniteStageChanger.value.loaded()
      }
    }

    onResult((result) => {
      if (result.loading) {
        return
      }
      const newFlaggedContents: IFlaggedContentFragmentFragment[] = [...flaggedContents.value]
      const existingIds = newFlaggedContents.map((flaggedContent) => flaggedContent.id)
      const loadedData = result.data?.flaggedContents?.contents || []
      loadedData.forEach((flaggedContent) => {
        const idx = existingIds.indexOf(flaggedContent.id)
        if (idx >= 0) {
          newFlaggedContents.splice(idx, 1, flaggedContent)
        } else {
          newFlaggedContents.push(flaggedContent)
        }
      })
      flaggedContents.value = newFlaggedContents
      total.value = result.data?.flaggedContents?.total || 0

      updateScroller()
    })

    return {
      flaggedContents,
      infiniteHandler,
      loading,
      onDeleted,
    }
  }
})
</script>
