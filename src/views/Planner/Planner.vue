<template>
  <div
    v-if="selectedRole"
    class="container px-0 py-4"
  >
    <div class="planner-title">
      <h1 class="mb-2">
        {{ $t('planner.title') }}
      </h1>
      <div>{{ $t('planner.sub-title') }}</div>
    </div>
    <PlannerHeading @reload="reload" />
    <div class="planner-content">
      <BTabs
        content-class="mt-3"
        nav-class="planner-content-nav"
        pills
      >
        <BTab
          :active="inboxTabActive"
          :title="inboxTabTitle"
        >
          <PlannerCard :title="$t(`planner.inbox-${selectedRole}`)">
            <Spinner v-if="loading" />
            <div
              v-else-if="inboxItems.length"
              class="p-2"
            >
              <InboxListItem
                v-for="item in inboxItems"
                :key="item.id"
                :hosting="item"
                :subject="subject"
                @view="viewHosting(item)"
                @accept="accept($event)"
                @decline="decline($event)"
              />
            </div>
            <div
              v-else
              class="pb-4 text-center text-secondary"
            >
              {{ $t(`planner.no-invites-or-requests-${selectedRole}`) }}
            </div>
          </PlannerCard>
        </BTab>
        <BTab
          :title="$t(`planner.${selectedRole}-grid-title`)"
          :active="!inboxTabActive"
        >
          <HostingGrid @view="viewHosting" />
        </BTab>
        <BTab
          :title="$t(`planner.suggestions`)"
          lazy
        >
          <PlannerSuggestions />
        </BTab>
        <BTab
          v-if="selectedRole === IHostingRole.Host"
          :title="$t('planner.preferences')"
        >
          <PreferencesByDateCard />
        </BTab>
        <BTab :title="$t(`planner.zmanim`)">
          <ZmanimCard />
        </BTab>
      </BTabs>
    </div>
    <InviteDetailsModal :role="selectedRole" />
  </div>
  <BAlert
    v-else
    :model-value="true"
    class="container my-4 align-self-start text-center"
  >
    {{ $t('planner.add-hosting-role-to-access-planner') }} <br>
    <RouterLink :to="{ name: 'edit.guest-preferences' }">
      {{ $t('planner.please-adjust-to-continue') }}
    </RouterLink>
  </BAlert>
</template>

<script lang="ts">
import { capitalize } from 'lodash'
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import InviteDetailsModal from '@/components/Invites/Modal/InviteDetailsModal.vue'
import HostingGrid from '@/components/Planner/HostingGrid/HostingGrid.vue'
import InboxListItem from '@/components/Planner/InboxTab/InboxListItem.vue'
import PlannerCard from '@/components/Planner/PlannerCard.vue'
import PlannerHeading from '@/components/Planner/PlannerHeading.vue'
import PlannerSuggestions from '@/components/Planner/PlannerSuggestions.vue'
import PreferencesByDateCard from '@/components/Planner/PreferencesByDateCard.vue'
import ZmanimCard from '@/components/Planner/ZmanimCard.vue'
import { useModal, useToast } from '@/composables'
import {
  type IHostingFragmentFragment,
  type IHostingPart,
  IHostingRole,
  IHostingStatus,
  IHostingType,
  useAcceptHostingMutation,
  useDeclineHostingMutation,
  useHostingsLazyQuery,
  useMyHostProfileLazyQuery,
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { upcomingShabbatOrYomTov } from '@/utils'

export default defineComponent({
  name: 'Planner',
  components: {
    InboxListItem,
    PlannerCard,
    PlannerHeading,
    InviteDetailsModal,
    HostingGrid,
    PlannerSuggestions,
    PreferencesByDateCard,
    ZmanimCard
  },
  setup() {
    const store = useStore(storeKey)
    const modal = useModal()
    const route = useRoute()
    const { t } = useI18n()
    const { showSuccessToast } = useToast()

    const roles = computed<IHostingRole[]>(() => store.getters['planner/roles'])
    const selectedRole = computed(() => store.state.planner.selectedRole)
    const selectedDate = computed(() => store.state.planner.selectedDate)
    const subject = computed(() => {
      return selectedRole.value === IHostingRole.Host
        ? IHostingRole.Guest
        : IHostingRole.Host
    })
    const inboxTabTitle = computed(() => {
      return t(`planner.inbox-${selectedRole.value}`).toString()
        + (inboxItems.value.length > 0 ? ` (${inboxItems.value.length})` : '')
    })

    const inboxTabActive = ref(false)
    const viewHostingPayload = ref({
      visibility: false,
      hostingId: ''
    })

    const { load: loadHostings, onResult: onLoadHostingsResult, result, loading } = useHostingsLazyQuery({
      input: {
        date: upcomingShabbatOrYomTov(),
        role: IHostingRole.Host
      }
    })
    const hostings = computed(() => result.value?.Hostings.hostings || [])
    const pendingHostings = computed(() => hostings.value.filter(item => item.status === IHostingStatus.Pending))
    const inboxItems = computed(() => {
      if (loading.value) {
        return []
      }
      if (selectedRole.value === IHostingRole.Guest) {
        return pendingHostings.value.filter(item => item.type === IHostingType.Invitation)
      }
      return pendingHostings.value.filter(item => item.type === IHostingType.Request)
    })

    onLoadHostingsResult((result) => {
      if (result.loading) {
        return
      }
      const hostings = result.data?.Hostings?.hostings as IHostingFragmentFragment[] || []

      if (viewHostingPayload.value.visibility) {
        const hosting = hostings.find(item => item.id === viewHostingPayload.value.hostingId)
        if (hosting && selectedRole.value) {
          inboxTabActive.value = true
          viewHosting(hosting)
        }
      }
    })

    const { load: loadHostProfileByDate, onResult: onLoadHostProfileByDate } = useMyHostProfileLazyQuery({
      date: upcomingShabbatOrYomTov()
    })
    onLoadHostProfileByDate((result) => {
      if (result.loading) {
        return
      }
      const hostProfile = result.data?.myHostProfile.hostProfile
      store.commit('planner/SET_HOST_PROFILE_FOR_DATE', hostProfile)
    })
    
    const {
      mutate: acceptHosting,
      onDone: onAcceptHostingDone,
    } = useAcceptHostingMutation(() => ({
      variables: {
        id: '',
        note: '',
        parts: []
      }
    }))

    const {
      mutate: declineHosting,
      onDone: onDeclineHostingDone,
    } = useDeclineHostingMutation(() => ({
      variables: {
        id: '',
        note: ''
      }
    }))
    
    const accept = (payload: { id: string, parts: IHostingPart[] }) => {
      acceptHosting(payload)
    }

    onAcceptHostingDone((result) => {
      const hosting = result.data?.acceptHosting.hosting!
      showAcceptDeclineToast(true, hosting.type)
    })

    const decline = (props: { id: string }) => {
      declineHosting({ id: props.id })
    }

    onDeclineHostingDone((result) => {
      const hosting = result.data?.declineHosting.hosting!
      showAcceptDeclineToast(false, hosting.type)
    })

    const showAcceptDeclineToast = (accept: boolean, hostingType: IHostingType) => {
      const type = hostingType === IHostingType.Invitation
        ? t('invites.modal.invitation-request').toString()
        : t('invites.modal.hosting-request').toString()

      const action = accept ? 'accepted' : 'declined'

      showSuccessToast(
        t(`invites.modal.request-${action}`, { type }).toString(),
        t('profile-view.general.success').toString(),
      )
    }

    const viewHosting = (hosting: IHostingFragmentFragment) => {
      store.dispatch('invites/setCurrentInvite', {
        invite: hosting
      })
      modal.show('inviteDetailsModal-' + selectedRole.value)
      // Reset viewHostingPayload
      viewHostingPayload.value = {
        visibility: false,
        hostingId: ''
      }
    }

    const reload = () => {
      loadHostings(undefined, {
        input: {
          date: selectedDate.value || upcomingShabbatOrYomTov(),
          role: selectedRole.value || IHostingRole.Host,
        }
      }, { fetchPolicy: 'network-only' })
      // Get hostProfiles for the date
      loadHostProfileByDate(undefined, {
        date: selectedDate.value
      }, { fetchPolicy: 'network-only' })
    }

    const setRole = (role: IHostingRole) => {
      // Dispatch setRole planner action to update states
      store.dispatch('planner/setRole', role)
    }

    watch(route, () => {
      const { role, date } = route.params
      const hostingId = route.params.hostingId as string
      const hostingRole = role && IHostingRole[capitalize(role as string) as keyof typeof IHostingRole]

      if (hostingRole) {
        setRole(hostingRole)
      } else if (!selectedRole.value || !(selectedRole.value in roles.value)) {
        setRole(roles.value[0])
      }

      if (hostingRole && date && hostingId) {
        store.dispatch('planner/goToHosting', { role: hostingRole, date, hostingId })

        // Flag shouldViewHosting as true
        viewHostingPayload.value = {
          visibility: true,
          hostingId
        }
      }
    }, { immediate: true })

    watch(selectedDate, () => reload(), { immediate: true })
    watch(selectedRole, () => reload(), { immediate: true })

    return {
      accept,
      decline,
      IHostingRole,
      inboxItems,
      inboxTabActive,
      inboxTabTitle,
      roles,
      selectedRole,
      subject,
      viewHosting,
      reload,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.planner-title {
  margin: 2rem;
}

:deep(.planner-content-nav) {
  padding: 0 1rem;

  .nav-link {
    color: $colorText;
    font-size: 1.2rem;
    padding: 1rem;
    margin: 0 1rem;

    &.active {
      background: transparent;
      border-radius: 0;
      border-bottom: solid 3px black;
      font-weight: bold;
    }
  }
}
</style>
