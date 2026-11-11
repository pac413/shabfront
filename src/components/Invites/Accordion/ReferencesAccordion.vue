<template>
  <div>
    <accordion-card
      id="references"
      accordion-id="details-accordion"
      :icon="['fas', 'user-friends']"
      :title="$t(`invites.modal.${subjectRole.toLowerCase()}-references`)"
      @show="onShow"
    >
      <spinner v-if="loading" />
      <template v-else-if="references.length === 0">
        <span>{{ noDataMessage }}</span>
      </template>
      <template v-else>
        <reference-line-item
          v-for="reference in references"
          :key="reference.id"
          :reference="reference"
        />
      </template>
    </accordion-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import AccordionCard from '@/components/Common/AccordionCard.vue'
import ReferenceLineItem from '@/components/Reference/ReferenceLineItem.vue'
import { IHostingRole, ISiteRole, useProfileReferencesLazyQuery } from '@/composables/graphql/generated'

const LIMIT = 10

export default defineComponent({
  name: 'ReferencesAccordion',
  components: {
    AccordionCard,
    ReferenceLineItem,
  },
  props: {
    profileId: {
      type: String,
      required: true,
    },
    subjectRole: {
      type: String as () => IHostingRole,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const offset = ref<number>(0)
    const noDataMessage = computed(() => {
      if (props.subjectRole === IHostingRole.Host) {
        return t('profile-view.host.no-references').toString()
      }
      return t('profile-view.guest.no-references').toString()
    })
    const { load, loading, result } = useProfileReferencesLazyQuery({
      id: props.profileId,
      input: {
        siteRole: props.subjectRole === IHostingRole.Host ? ISiteRole.Host : ISiteRole.Guest,
        offset: 0,
        limit: LIMIT,
      },
    })
    // Make this as a ref and add pagination
    const references = computed(() => result.value?.profile?.profile?.references || [])

    const loadMore = () => {
      load(undefined, {
        id: props.profileId,
        input: {
          siteRole: props.subjectRole === IHostingRole.Host ? ISiteRole.Host : ISiteRole.Guest,
          offset: offset.value,
          limit: LIMIT,
        },
      })
    }

    const onShow = () => {
      offset.value = 0
      loadMore()
    }

    watch(() => props.profileId, () => loadMore())
    watch(() => props.subjectRole, () => loadMore())
    
    return {
      loading,
      noDataMessage,
      onShow,
      references
    }
  }
})
</script>
