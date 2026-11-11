<template>
  <div
    class="matchmaking-container"
    @click="onClickOut"
  >
    <div class="pull-if-rtl inner-container p-3">
      <div class="sticky-subheader align-items-center my-3 py-2">
        <h5 class="pull-if-rtl-label d-none d-sm-block">
          {{ $t('sticky-subheader.matchmaking-title') }}
        </h5>
      </div>

      <div class="row matchmaking-content">
        <MatchmakingGuys
          class="col-md-5 h-100 pe-5"
          :filters="guysFilters"
          @show-filter="onToggleFilters(MatchmakingType.Guys, $event)"
          @drop="onSelected(MatchmakingType.Guys, $event)"
        />
        <MatchmakingDropzone
          class="col-md-2"
          :current-guy="currentGuy"
          :current-girl="currentGirl"
          @match="onClickMatch"
          @clear="onClickClear"
          @select="onSelected"
        />
        <MatchmakingGirls
          class="col-md-5 h-100 ps-5"
          :filters="girlsFilters"
          @show-filter="onToggleFilters(MatchmakingType.Girls, $event)"
          @drop="onSelected(MatchmakingType.Girls, $event)"
        />
      </div>
    </div>

    <MatchmakingGuysFilters
      :filters="guysFilters"
      :visible="filterVisible[MatchmakingType.Guys]"
      @toggle="onToggleFilters(MatchmakingType.Guys)"
      @change="onChangeFilters(MatchmakingType.Guys, $event)"
    />
    <MatchmakingGirlsFilters
      :filters="girlsFilters"
      :visible="filterVisible[MatchmakingType.Girls]"
      @toggle="onToggleFilters(MatchmakingType.Girls)"
      @change="onChangeFilters(MatchmakingType.Girls, $event)"
    />

    <MatchmakingModal
      id="matchmaking-modal"
      :guy="currentGuy"
      :girl="currentGirl"
      @complete="onCompleteMatch"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type Ref,ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import MatchmakingDropzone from '@/components/Matchmaking/MatchmakingDropzone.vue'
import MatchmakingGirls from '@/components/Matchmaking/MatchmakingGirls.vue'
import MatchmakingGirlsFilters from '@/components/Matchmaking/MatchmakingGirlsFilters.vue'
import MatchmakingGuys from '@/components/Matchmaking/MatchmakingGuys.vue'
import MatchmakingGuysFilters from '@/components/Matchmaking/MatchmakingGuysFilters.vue'
import MatchmakingModal from '@/components/Matchmaking/MatchmakingModal.vue'
import { useModal, useToast } from '@/composables'
import { IMatchParty, useCreateDatingMatchMutation } from '@/composables/graphql/generated'
import {
  InitialMatchmakingBoolean,
  InitialMatchmakingFilters,
  InitialMatchmakingProfile,
  type MatchmakingBoolean,
  type MatchmakingFilterOption,
  type MatchmakingProfile,
  MatchmakingType,
  type Profile,
} from '@/types'

export default defineComponent({
  name: 'Matchmaking',
  components: {
    MatchmakingGuysFilters,
    MatchmakingGirlsFilters,
    MatchmakingGuys,
    MatchmakingGirls,
    MatchmakingDropzone,
    MatchmakingModal
  },
  setup() {
    const { t } = useI18n()
    const modal = useModal()
    const { showSuccessToast, showErrorToast } = useToast()

    const match: Ref<MatchmakingProfile> = ref({ ...InitialMatchmakingProfile })
    const filterVisible: Ref<MatchmakingBoolean> = ref({ ...InitialMatchmakingBoolean })
    const currentGuy: Ref<Profile | null> = ref(null)
    const currentGirl: Ref<Profile | null> = ref(null)
    const guysFilters: Ref<MatchmakingFilterOption> = ref({ ...InitialMatchmakingFilters })
    const girlsFilters: Ref<MatchmakingFilterOption> = ref({ ...InitialMatchmakingFilters })

    // disable outside scrolling when filter sidebar is opened
    watch(filterVisible, (value: MatchmakingBoolean) => {
      document.documentElement.style.overflow =
        (value[MatchmakingType.Guys] || value[MatchmakingType.Girls])
          ? 'hidden'
          : 'auto'
    })

    // Event handler for outside click
    const onClickOut = () => {
      filterVisible.value = { ...InitialMatchmakingBoolean }
    }

    // Event handler to toggle filter menu
    const onToggleFilters = (type: MatchmakingType, event?: Event) => {
      if (event) {
        event.stopPropagation()
      }
      filterVisible.value[type] = !filterVisible.value[type]
    }

    const onChangeFilters = (type: MatchmakingType, filters: MatchmakingFilterOption) => {
      type === MatchmakingType.Guys ?
        guysFilters.value = { ...filters } :
        girlsFilters.value = { ...filters }
    }

    // Event handler for Match button click
    const onClickMatch = () => {
      if (!currentGuy.value || !currentGirl.value) {
        return showErrorToast(t('matchmaking-view.select-guy-girl-error').toString())
      }
      modal.show('matchmaking-modal')
    }

    const onSelected = (type: MatchmakingType, profile: Profile) => {
      type === MatchmakingType.Guys ? currentGuy.value = profile : currentGirl.value = profile
    }

    // Event handler for Clear button click
    const onClickClear = () => {
      currentGuy.value = null
      currentGirl.value = null
    }
    
    const { mutate: createDatingMatch, onDone } = useCreateDatingMatchMutation({
      variables: {
        guy: '',
        girl: '',
        message: '',
        party: IMatchParty.Both
      }
    })

    onDone(() => {
      showSuccessToast(t('matchmaking-view.matchmaking-saved-success').toString())
    })
    
    const onCompleteMatch = (suggestion: IMatchParty, note: string) => {
      if (!currentGuy.value || !currentGirl.value) {
        return
      }
      createDatingMatch({
        guy: currentGuy.value.id,
        girl: currentGirl.value.id,
        message: note,
        party: suggestion
      })
    }

    return {
      MatchmakingType,
      match,
      filterVisible,
      currentGuy,
      currentGirl,
      guysFilters,
      girlsFilters,
      onClickOut,
      onToggleFilters,
      onChangeFilters,
      onClickMatch,
      onClickClear,
      onCompleteMatch,
      onSelected
    }
  }
})
</script>

<style lang="scss" scoped>
.matchmaking-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  .inner-container {
    background-color: #f8fafd;
    display: flex;
    flex-direction: column;
    height: calc(100vh - #{$header-height});
    overflow: auto;
  }
}

.matchmaking-content {
  flex: 1;
  overflow: auto;
}

.sticky-subheader {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8fafd;

  h5 {
    font-size: 18px;
    font-weight: bold;
    color: $colorStickyText;
  }
}
</style>
