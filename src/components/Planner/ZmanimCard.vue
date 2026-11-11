<template>
  <PlannerCard :title="$t('zmanim.zmanim-in-location', { location: location })">
    <template #menu>
      <BDropdown right no-caret pill variant="light">
        <template #button-content>
          <FaIcon :icon="['fas', 'ellipsis-h']" />
        </template>
        <BDropdownItem :to="{ name: 'edit.contact-info' }">
          {{ $t('zmanim.update-location') }}
        </BDropdownItem>
      </BDropdown>
    </template>

    <zmanim :date="selectedDate" :tooltips="[ZmanimKeys.candlelighting]" />
  </PlannerCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import Zmanim from '@/components/Common/Date/Zmanim.vue'
import PlannerCard from '@/components/Planner/PlannerCard.vue'
import { storeKey } from '@/store'
import { ZmanimKeys } from '@/utils'

export default defineComponent({
  name: 'ZmanimCard',
  components: {
    PlannerCard,
    Zmanim,
  },
  setup() {
    const store = useStore(storeKey)
    const location = computed<string>(() => store.getters['profile/locationText'])
    const selectedDate = computed<string>(() => store.getters['planner/selectedDate'])

    return {
      location,
      selectedDate,
      ZmanimKeys,
    }
  },
})
</script>

<style lang="scss" scoped>
.helper-text {
  text-align: center;
  padding: 10px 0;
}
</style>
