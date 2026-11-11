<template>
  <search-items
    v-if="items.length > 0"
    title="People"
  >
    <template #content>
      <search-item
        v-for="(item, index) of items"
        :key="item.profile.handle"
        :url="item.url"
        :title="item.title"
        :keyword="keyword"
        :typeahead-mode="typeaheadMode"
        :active="activeIndex === index"
        @close-popup="$emit('close-popup')"
        @selected="$emit('selected', item.profile)"
      >
        <template #avatar>
          <ProfileAvatar
            thumbnail="small"
            :profile="item.profile"
          />
        </template>
      </search-item>
    </template>

    <template #footer>
      <RouterLink
        v-if="!typeaheadMode"
        :to="{
          name: 'Search',
          query: {
            type: 'all',
            name: keyword
          }
        }"
        @click="$emit('close-popup')"
      >
        <span v-html="footerText" />
      </RouterLink>
    </template>
  </search-items>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import type { SimpleProfile } from '@/types'
import { getLocationDisplay } from '@/utils'

import AutoTypeSearchItem from './Common/AutoTypeSearchItem.vue'
import AutoTypeSearchItems from './Common/AutoTypeSearchItems.vue'


export default defineComponent({
  name: 'AutoTypeSearchProfiles',
  components: {
    ProfileAvatar,
    SearchItem: AutoTypeSearchItem,
    SearchItems: AutoTypeSearchItems,
  },
  props: {
    keyword: {
      type: String,
      required: true
    },
    profiles: {
      type: Array as () => SimpleProfile[],
      required: true,
      default: () => []
    },
    typeaheadMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    activeIndex: {
      type: Number,
      default: null
    }
  },
  emits: ['close-popup', 'selected'],
  setup(props) {
    const router = useRouter()
    const { t } = useI18n()

    const items = computed(() => {
      return props.profiles.map(profile => {
        const location = getLocationDisplay(profile.primaryLocation)

        const { firstName, lastName } = profile
        return {
          profile,
          title: location ? `${firstName} ${lastName}` + ' • ' + location : `${firstName} ${lastName}`,
          url: router.resolve({
            name: 'Profile',
            params: {
              handle: profile.handle
            }
          }).href
        }
      })
    })

    const footerText = computed(() => t(
      'outer-search.searchAllFor',
      {
        group: 'People',
        searchTerm: props.keyword
      }
    ).toString())

    return {
      items,
      footerText
    }
  }
})
</script>
