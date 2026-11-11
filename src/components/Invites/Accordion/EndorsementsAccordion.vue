<template>
  <div>
    <accordion-card
      id="endorsements"
      accordion-id="details-accordion"
      :icon="['fas', 'file-signature']"
      :title="$t(`invites.modal.${subjectRole.toLowerCase()}-endorsements`)"
      @show="onShow"
    >
      <spinner v-if="loading" />
      <template v-else-if="endorsements.length === 0">
        <span>{{ noDataMessage }}</span>
      </template>
      <template v-else>
        <endorsement-item
          v-for="item in endorsements"
          :key="item.id"
          :endorsement="item"
          :site-role="subjectRole"
        />
      </template>
    </accordion-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import AccordionCard from '@/components/Common/AccordionCard.vue'
import EndorsementItem from '@/components/Profile/Endorsement/EndorsementItem.vue'
import { IEndorsementSiteRole, IHostingRole, useEndorsementsLazyQuery } from '@/composables/graphql/generated'

const LIMIT = 10

export default defineComponent({
  name: 'EndorsementsAccordion',
  components: {
    AccordionCard,
    EndorsementItem,
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
        return t('profile-view.host.no-endorsements').toString()
      }
      return t('profile-view.guest.no-endorsements').toString()
    })
    const { load, loading, result } = useEndorsementsLazyQuery({
      profileId: props.profileId,
      onSiteRole: props.subjectRole === IHostingRole.Host ? IEndorsementSiteRole.Host : IEndorsementSiteRole.Guest,
      offset: 0,
      limit: LIMIT,
    })
    // Make this as a ref and add pagination
    const endorsements = computed(() => result.value?.endorsements?.edges?.nodes || [])

    const loadMore = () => {
      load(undefined, {
        profileId: props.profileId,
        onSiteRole: props.subjectRole === IHostingRole.Host ? IEndorsementSiteRole.Host : IEndorsementSiteRole.Guest,
        offset: offset.value,
        limit: LIMIT,
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
      endorsements
    }
  }
})
</script>
