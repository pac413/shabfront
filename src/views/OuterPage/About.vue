<template>
  <div class="about-page indent">
    <div class="row m-0">
      <div class="breadcrumb-image">
        <div class="breadcrumb-image-overlay">
          <h1>{{ $t('about-view.title') }}</h1>
        </div>
      </div>
    </div>

    <div class="about-section">
      <h1>{{ $t('about-view.about-shabbat') }}</h1>
      <p class="lead">
        {{ $t('about-view.lead') }}
      </p>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h6 class="description">
            {{ $t('about-view.leadership') }}
          </h6>

          <div class="row">
            <team-member
              v-for="(profile, index) in leadershipMembers"
              :key="index"
              :profile="profile"
              @open-modal="openModal"
            />
          </div>
        </div>
      </div>

      <div class="row team-member-section">
        <div class="col-lg-12">
          <h6 class="description">
            {{ $t('about-view.advisory-board') }}
          </h6>

          <div class="row">
            <team-member
              v-for="(profile, index) in boardMembers"
              :key="index"
              :profile="profile"
              @open-modal="openModal"
            />
          </div>
        </div>
      </div>

      <BModal
        :id="bioModalId"
        v-model="isBioModalVisible"
        :title="modalTitle"
        :header-class="hideHeader"
        hide-footer
        size="lg"
        centered
      >
        <p
          class="bio-modal-content"
          v-html="modalContent"
        />
      </BModal>
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { board,leadership } from '@/assets/js/team-members'
import TeamMember from '@/components/Outer/TeamMember.vue'
import { useModal, useRegisterModal } from '@/composables'

const bioModalId = 'bio-modal'

export default defineComponent({
  name: 'About',
  components: { TeamMember },
  setup() {
    const { t } = useI18n()
    const modal = useModal()
    const hideHeader = ref<string>('')
    const modalContent = ref<string>('')
    const modalTitle = ref<string>('')
    const { isVisible: isBioModalVisible } = useRegisterModal(bioModalId)

    const openModal = (profile: any) => {
      hideHeader.value = 'hide-modal-header'
      modalTitle.value = profile.name
      modalContent.value = t(profile.bio).toString()
      modal.show('bio-modal')
    }

    useHead({
      title: 'About Shabbat.com',
      meta: [
        { vmid: 'fb_title_meta', property: 'og:title', content: 'About Shabbat.com' },
        {
          vmid: 'fb_description_meta',
          property: 'og:description',
          content: 'Shabbat.com is a social media platform and a global movement whose mission is to assist Jewish organizations and individuals worldwide with Shabbat hospitality, matchmaking, and employment opportunities free of charge.',
        },
        {
          vmid: 'fb_image_meta',
          property: 'og:image',
          content: 'https://shabbat-com-assets.s3.us-east-2.amazonaws.com/shabbat-faces-1-bw.png',
        },
      ]
    })

    return {
      bioModalId,
      boardMembers: board,
      hideHeader,
      isBioModalVisible,
      leadershipMembers: leadership,
      modalContent,
      modalTitle,
      openModal,
    }
  }
})
</script>

<style lang="scss" scoped>
.about-page {
  width: 100%;
}

.breadcrumb-image {
  width: 100%;
  height: 462px;
  background-image: url(../../assets/img/demo-bgs/shabbat-faces-1-bw.png);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.breadcrumb-image-overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    color: #ffffff;
    font-size: 43px;
    font-weight: 600;
    line-height: 40px;
    text-transform: uppercase;
  }
}

.about-section {
  padding: 3rem 1.5rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    color: $colorText;
    font-weight: 500;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
}

.lead {
  font-size: 1.55rem;
  font-weight: 300;
  max-width: 750px;
  margin: auto;
  color: $colorText;
  line-height: 1.5;
}

.team-member-section {
  padding-top: 5em;
  margin-bottom: 5em;
}

h6.description {
  font-weight: bold;
  letter-spacing: 2px;
  color: #999;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 5px;
  text-align: center;
  font-size: 24px;
}

.bio-modal-content {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
}
</style>
