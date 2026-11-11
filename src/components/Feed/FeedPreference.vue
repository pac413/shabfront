<template>
  <div class="feed-preference">
    <BDropdown
      variant="none"
      no-caret
      pill
      class="feed-preference-dropdown"
    >
      <template #button-content>
        <span v-if="selected">
          <FaIcon
            v-if="selected.icon"
            :icon="['fal', selected.icon]"
            class="selected-item-icon"
            :class="selected.icon"
          />
          {{ selected.title }}
        </span>
        <FaIcon
          :icon="['fas', 'chevron-down']"
          class="down-icon ms-2"
          @click.prevent
        />
      </template>
      <!-- eslint-disable vue/no-v-for-template-key -->
      <template
        v-for="option in options"
        :key="option.value"
      >
        <BDropdownDivider
          v-if="option.divider"
        />
        <BDropdownItem
          :variant="option.variant"
          @click.prevent="onSelected(option)"
        >
          <FaIcon
            v-if="option.icon"
            :icon="['fal', option.icon]"
            class="feed-preference-icon"
            :class="option.icon"
          />
          <span class="feed-preference-item__label">{{ option.title }}</span>
        </BDropdownItem>
      </template>
      <!-- eslint-enable vue/no-v-for-template-key -->
    </BDropdown>

    <div
      v-if="isShowingSpinner"
    >
      <Spinner small />
    </div>

    <div
      v-if="showNoConnectionsHint"
      class="feed-preference-alert"
    >
      {{ $t('feed.feed-preference.no-connections-hint') }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import Spinner from '@/components/Common/Spinner.vue'
import { IFeedContentSetting } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { LoadingStatus } from '@/store/types'

interface PreferenceOption {
  title: string
  value: string
  icon?: string
  divider?: boolean
  variant?: string
}

export default defineComponent({
  name: 'FeedPreference',
  components: { Spinner },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const feedLoading = computed(() => store.state.feed.feedLoading)
    const currentSettings = computed(() => store.state.profileSettings.currentSettings)
    const showNoConnectionsHint = computed(() => {
      return (!activeProfile.value || activeProfile.value.totals.connections === 0) &&
        selected.value?.value === IFeedContentSetting.Connections
    })

    const userOptions = computed((): PreferenceOption[] => {
      return [
        {
          title: t('feed.feed-preference.all-public-posts').toString(),
          value: IFeedContentSetting.Public,
          icon: 'list'
        },
        {
          title: t('feed.feed-preference.posts-from-my-connections-only').toString(),
          value: IFeedContentSetting.Connections,
          icon: 'user-friends'
        },
        {
          title: t('feed.feed-preference.trending-posts').toString(),
          value: IFeedContentSetting.Trending,
          icon: 'fire'
        },
      ]
    })

    const adminOptions = computed((): PreferenceOption[] => {
      return [
        {
          title: t('feed.feed-preference.review-posts').toString(),
          value: IFeedContentSetting.All,
          icon: 'lock',
          divider: true,
          variant: 'primary'
        }
      ]
    })

    const options = computed((): PreferenceOption[] => {
      return [
        ...userOptions.value,
        ...(isAdmin.value ? adminOptions.value : [])
      ]
    })

    const selected = computed((): PreferenceOption | undefined => {
      let feedContent = currentSettings.value?.feedContent as string
      if (feedContent) {
        return options.value.find(item => item.value === feedContent)
      }
      return undefined
    })

    const isShowingSpinner = computed((): boolean => {
      return feedLoading.value === LoadingStatus.Loading
    })

    const onSelected = (option: PreferenceOption) => {
      store.dispatch('profileSettings/updateProfileSettings', {
        profileId: activeProfileId.value,
        setting: 'feedContent',
        value: option.value
      })
    }

    return {
      activeProfile,
      activeProfileId,
      adminOptions,
      currentSettings,
      feedLoading,
      isAdmin,
      isShowingSpinner,
      onSelected,
      options,
      selected,
      showNoConnectionsHint,
      userOptions,
    }
  }
})
</script>

<style lang="scss" scoped>
.feed-preference {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .selected-item-icon {
    margin-right: 2px;
  }

  .list {
    color: #46be62;
  }
  .user-friends {
    color: #e7a33e;
  }
  .fire {
    color: $colorRed;
  }
  .lock {
    color: $colorRed;
  }
}

:deep(.dropdown-toggle) {
  font-weight: 600;
  transition: 0.5s background-color;
  border-radius: 6px;

  &:hover {
    background-color: #ededed;
  }

  &:active, &.btn.show {
    border-color: transparent;
  }

  .down-icon {
    font-size: 14px;
  }
}

.feed-preference-alert {
  color: $colorSecondary;
}

:deep(.dropdown-item) {
  &:active {
    svg {
      color: white;
    }
  }
  padding-left: 16px;
  display: flex;
  align-items: center;
}

.feed-preference-icon {
  min-width: 20px;
}

.feed-preference-item__label {
  margin-left: 5px;
  flex: 1;
}

.rtl-at-root {
  .selected-item-icon {
    margin-left: 2px;
    margin-right: unset;
  }

  .feed-preference-item {
    .feed-preference-item__label {
      margin-left: unset;
      margin-right: 5px;
    }
  }
}
</style>
