<template>
  <div class="details-accordion my-4">
    <accordion-card
      v-if="invitation && invitation.status === InviteStatus.ACCEPTED"
      id="contact-card"
      accordion-id="details-accordion"
      :icon="['fa', 'map-marker-alt']"
      :title="$t(`invites.modal.${subjectRole.toLowerCase()}-contact-details`)"
      :visible="true"
    >
      <contact-card
        :invite-id="invitation.id"
        :profile="invitation[subjectRole.toLowerCase()]"
        :role="subjectRole"
      />
    </accordion-card>
    <references-accordion
      :profile-id="subjectId"
      :subject-role="subjectRole"
    />
    <endorsements-accordion
      :profile-id="subjectId"
      :subject-role="subjectRole"
    />
    <accordion-card
      v-if="recentHostings"
      id="recent-hostings"
      accordion-id="details-accordion"
      :icon="['fal', 'user-tie']"
      :title="$t(`invites.modal.${subjectRole.toLowerCase()}-hostings`)"
    >
      <RecentHostingsGrid
        :id="subjectId"
        :default-limit="3"
        :max="50"
        :type="subjectRole"
      />
    </accordion-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import AccordionCard from '@/components/Common/AccordionCard.vue'
import ContactCard from '@/components/Invites/Accordion/ContactCard.vue'
import EndorsementsAccordion from '@/components/Invites/Accordion/EndorsementsAccordion.vue'
import RecentHostingsGrid from '@/components/Invites/Accordion/RecentHostingsGrid.vue'
import ReferencesAccordion from '@/components/Invites/Accordion/ReferencesAccordion.vue'
import { type IHostingRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type InviteDetail, InviteStatus } from '@/types'

export default defineComponent({
  name: 'DetailsAccordion',
  components: {
    AccordionCard,
    ContactCard,
    EndorsementsAccordion,
    RecentHostingsGrid,
    ReferencesAccordion,
  },
  props: {
    subjectRole: {
      type: String as () => IHostingRole,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    recentHostings: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore(storeKey)
    const invitation = computed<InviteDetail>(() => store.getters['invites/currentInvite'])

    return {
      invitation,
      InviteStatus,
    }
  }
})
</script>
