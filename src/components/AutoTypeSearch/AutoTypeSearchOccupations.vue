<template>
  <search-items
    v-if="items.length > 0"
    title="Occupation"
  >
    <template #content>
      <search-item
        v-for="(item, index) of items"
        :key="index"
        :url="item.url"
        :title="item.title"
        :keyword="keyword"
        :active="activeIndex === index"
        @close-popup="$emit('close-popup')"
      >
        <template #avatar>
          <FaIcon
            class="form-control-feedback result-item-avatar-icon"
            :icon="['fas', 'business-time']"
          />
        </template>
      </search-item>
    </template>
  </search-items>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import type { Occupation } from '@/types'

import AutoTypeSearchItem from './Common/AutoTypeSearchItem.vue'
import AutoTypeSearchItems from './Common/AutoTypeSearchItems.vue'

export default defineComponent({
  name: 'AutoTypeSearchOccupations',
  components: {
    SearchItem: AutoTypeSearchItem,
    SearchItems: AutoTypeSearchItems
  },
  props: {
    keyword: {
      type: String,
      required: true
    },
    occupations: {
      type: Array as () => Occupation[],
      required: true,
      default: () => [] 
    },
    activeIndex: {
      type: Number,
      default: null
    }
  },
  emits: ['close-popup'],
  setup(props) {
    const router = useRouter()

    const items = computed(() => {
      return props.occupations.map(occupation => ({
        title: `${occupation.name}`,
        url: router.resolve({
          name: 'Search',
          query: {
            type: 'all',
            occupation: occupation.name
          }
        }).href
      }))
    })

    return { items }
  }
})

</script>
