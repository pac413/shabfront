<template>
  <PlannerCard>
    <div class="heading-content">
      <div class="left-column">
        <h4
          class="my-3"
          v-html="formattedParshaTitle"
        />

        <div class="date-nav">
          <ShabbatYomTovDatePicker
            :model-value="selectedDate"
            variant="primary"
            @change="updateSelectedDate"
          />
          <span
            class="px-2 py-1 ms-1 nav-date-left"
            @click.prevent="navigateDate(-1)"
          >
            <FaIcon :icon="['fa', 'chevron-left']" />
            <BLink class="text-link">{{ $t(`planner.previous`) }}</BLink>
          </span>
          <span
            class="px-2"
            @click.prevent="navigateDate(1)"
          >
            <BLink class="text-link">{{ $t(`planner.next`) }}</BLink>
            <FaIcon :icon="['fa', 'chevron-right']" />
          </span>
        </div>
        <div class="swap-role my-3 pe-3">
          <ProfileAvatar
            linkable
            class="avatar"
            size="30px"
            :profile="profile"
          />
          <span
            class="ps-2 pe-1"
            v-html="$t(`planner.you-are-currently-${selectedRole}`)"
          />
          <span
            v-html="$t(
              'planner.change-preferences',
              {
                link: '/profile/edit/' + selectedRole?.toLowerCase() + '-preferences'
              }
            )"
          />
          <span
            v-if="roles.length > 1"
            @click="swapRole"
            v-html="$t(`planner.swap-role-from-${selectedRole}`)"
          />
        </div>
      </div>
      <div class="candlelighting-wrapper px-5">
        <candlelighting />
      </div>
    </div>
  </PlannerCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import shabbatYomTovDates from '@/assets/js/dates'
import ShabbatYomTovDatePicker from '@/components/Common/Date/ShabbatYomTovDatePicker.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import Candlelighting from '@/components/Planner/Candlelighting/Candlelighting.vue'
import PlannerCard from '@/components/Planner/PlannerCard.vue'
import { IHostingRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { SiteRole } from '@/types'

export default defineComponent({
  name: 'PlannerHeading',
  components: {
    PlannerCard,
    ShabbatYomTovDatePicker,
    ProfileAvatar,
    Candlelighting
  },
  emits: ['reload'],
  setup(_, { emit }) {
    const store = useStore(storeKey)
    const profile = computed(() => store.state.profile.activeProfile)
    const roles = computed<IHostingRole[]>(() => store.getters['planner/roles'])
    const selectedDate = computed(() => store.state.planner.selectedDate)
    const selectedRole = computed(() => store.state.planner.selectedRole)
    const formattedParshaTitle = computed<(date: string) => string>(() =>
      store.getters['planner/formattedParshaTitle']
    )

    const swapRole = () => {
      const newRole = selectedRole.value === IHostingRole.Guest ? IHostingRole.Host : IHostingRole.Guest
      store.dispatch('planner/setRole', newRole)
      emit('reload')
    }

    const navigateDate = (step: number) => {
      step = step || 1
      const currentIndex = shabbatYomTovDates.findIndex(item => item.date === selectedDate.value)
      if (currentIndex === -1) {return}
      const newDate = shabbatYomTovDates[currentIndex + step].date
      newDate && updateSelectedDate(newDate)
    }

    const updateSelectedDate = (newDate: string) => {
      store.dispatch('planner/setDate', newDate)
      emit('reload')
    }

    return {
      formattedParshaTitle,
      navigateDate,
      profile,
      roles,
      selectedDate,
      selectedRole,
      SiteRole,
      swapRole,
      updateSelectedDate,
    }
  }
})
</script>
<style lang="scss" scoped>
.heading-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-column {
    .date-nav {
      display: flex;
      align-items: center;
      cursor: pointer;
      a {
        color: $colorText;
        font-size: 1rem;
        padding: .5rem;
      }

      .nav-date-left {
        border-right: 1px solid $colorLightGrey1;
      }
    }
    .swap-role {
      border: 1px solid $colorLightGrey1;
      border-radius: 50px;
      padding: 0.4rem;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      white-space: break-spaces;
    }
  }
  .candlelighting-wrapper {
    max-width: 400px;
  }
}

:deep(.b-form-datepicker) .btn-primary.dropdown-toggle {
  color: $colorRed;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: .25rem;
}

.text-link, .swap-role :deep(span) a {
  text-decoration: underline;
  color: #353535;

  &:hover, &:active {
    text-decoration: none;
  }
}

.rtl-at-root {
  .heading-content {
    .left-column {
      .date-nav {
        .nav-date-left {
          border-left: 1px solid $colorLightGrey1;
          border-right: unset;
        }
      }
    }
  }
}
</style>
