<template>
  <div class="parsha-search">
    <div class="parsha-headline">
      {{ $t('parsha.search.title') }}
    </div>
    <BTabs>
      <BTab
        v-for="(parshios, chumash) in parshaList"
        :key="chumash"
        :title="chumash"
      >
        <BListGroup>
          <BListGroupItem
            v-for="parsha in parshios"
            :key="parsha.id"
            @click="navigateParsha(parsha.id)"
          >
            {{ parsha.parsha }}
          </BListGroupItem>
        </BListGroup>
      </BTab>
    </BTabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import type { ParshaAudio } from '@/types'

export default defineComponent({
  name: 'ParshaSearch',
  emits: ['scroll-to'],
  setup(_, { emit }) {
    const store = useStore(storeKey)
    const parshaList = computed<ParshaAudio[]>(
      () => store.getters['parsha/parshaListByChumash']
    )

    const navigateParsha = (id: string) => {
      store.dispatch('parsha/setSelectedParsha', id)
      emit('scroll-to')
    }

    return {
      parshaList,
      navigateParsha
    }
  }
})
</script>

<style lang="scss" scoped>
.parsha-headline {
  padding: 1rem;
}

.parsha-search {
  max-width: 800px;
  margin: 2rem auto;
}

:deep(.nav-tabs) {
  border-bottom: none;
  margin: 1rem 0;

  .nav-item {
    flex: 1;
    line-height: 2rem;
  }
  .nav-link {
    font-size: 1.5rem;
    color: $colorText;
    border:none;
    background-color: transparent;
    padding: 0.5rem;

    &:hover {
      color: #164796;
    }
    &.active {
      font-weight: bold;
      color: #164796;
      border: none;
    }
  }
}

:deep(.tab-content) {
  border-top: solid 4px black;

  .list-group-item {
    border: none;
    border-bottom: 1px solid #B6B6B6;
    padding: 1rem .5rem;
    background-color: transparent;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      background-color: $colorLightGrey3;
      cursor: pointer;
    }
  }
}
</style>
