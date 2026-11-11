<template>
  <div>
    <div
      v-if="keyword && loading"
      class="search-loading"
    >
      <span>{{ $t('outer-search.loading') }}</span>
      <div class="search-loading-icon">
        <FaIcon
          :icon="['fa', 'spinner']"
          pulse
        />
      </div>
    </div>
    <div
      v-else-if="keyword && hasResult"
      class="search-popup__content"
    >
      <ul class="search-items">
        <search-item
          v-for="profile of profiles"
          :key="profile.handle"
          :title="`${profile.firstName} ${profile.lastName}`"
          :keyword="keyword"
          :url="profile.profileUrl"
          :typeahead-mode="true"
          @close-popup="$emit('close-popup')"
          @selected="$emit('selected', profile)"
        >
          <template #avatar>
            <ProfileAvatar
              thumbnail="small"
              :profile="profile"
            />
          </template>
        </search-item>
      </ul>
    </div>
    <div
      v-else
      class="search-no-items"
    >
      <span v-if="!keyword">{{ $t('outer-search.typeSomething') }}</span>
      <span v-else>{{ $t('outer-search.noItemsToShow') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import AutoTypeSearchItem from '@/components/AutoTypeSearch/Common/AutoTypeSearchItem.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'MatchmakingAutoTypeProfileSearchPopup',
  components: {
    ProfileAvatar,
    SearchItem: AutoTypeSearchItem
  },
  props: {
    keyword: {
      required: true,
      type: String
    },
    loading: {
      required: false,
      type: Boolean,
      default: false
    },
    profiles: {
      required: false,
      type: Array as () => Profile[],
      default: () => []
    }
  },
  emits: ['close-popup', 'selected'],
  setup(props) {
    const hasResult = computed(() => props.profiles.length > 0)
    return { hasResult }
  }
})
</script>

<style lang="scss" scoped>
.search-popup__content {
  margin: 0 0 16px;
  padding: 0 12px;
}

.search-loading {
  font-size: 14px;
  padding: 16px;
  line-height: 14px;
  display: flex;
  align-items: center;
}

.search-loading-icon {
  margin-left: 6px;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
  }
}

.search-items {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.search-no-items {
  font-size: 14px;
  padding: 16px;
  line-height: 14px;
}

.rtl-at-root {
  .search-loading-icon {
    margin-left: 0;
    margin-right: 6px;
  }

  .search-items {
    padding-right: 0;
  }
}
</style>
