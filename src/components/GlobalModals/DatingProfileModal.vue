<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    size="lg"
    hide-header
    hide-footer
    @show="onShow"
  >
    <FaIcon
      :icon="['fas', 'times']"
      class="close-icon"
      size="lg"
      @click="closeModal"
    />
    <div
      class="content p-2 p-lg-5"
      :class="isRtl"
    >
      <!-- profile info -->
      <div class="profile-info">
        <div class="avatar-container">
          <div class="avatar">
            <ProfileAvatar
              size="165px"
              thumbnail="large"
              :profile="profile"
            />
          </div>
        </div>
        <div class="info-container">
          <span class="profile-name">{{ `${profile.firstName} ${profile.lastName}` }}</span>
          <span
            v-if="age"
            class="profile-text"
          >
            {{ age }} {{ $t('profile.years-old') }}
          </span>
          <span
            v-if="profile.primaryLocation"
            class="profile-text"
          >
            {{ profile.primaryLocation.city }}, {{ profile.primaryLocation.state || profile.primaryLocation.country }}
          </span>
          <span class="profile-text">{{ activeDate }}</span>

          <div
            v-if="profile.totals"
            class="totals-container"
          >
            <div class="totals-info">
              <span class="text-uppercase">{{ $t('profile.views') }}</span>
              <span>{{ profile.totals.views }}</span>
            </div>
            <div class="totals-info">
              <span class="text-uppercase">{{ $t('profile.connections') }}</span>
              <span>{{ profile.totals.connections }}</span>
            </div>
            <div class="totals-info">
              <span class="text-uppercase">{{ $t('profile.invites') }}</span>
              <span>{{ profile.totals.invites }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- profile buttons -->
      <div class="profile-buttons pull-if-rtl">
        <MessageMe
          v-if="!isViewingSelf"
          class="profile-button"
          variant="outline-success"
          :handle="profile.handle"
        />
        <BDropdown
          v-if="!isViewingSelf"
          id="dating-options"
          :text="$t('profile.dating-options')"
          variant="danger"
          class="dating-options-dropdown"
        >
          <BDropdownItem
            v-if="!isDatingProfilePrivate"
            @click="onEmailDatingProfile"
          >
            {{ $t('profile.email-dating-profile') }}
          </BDropdownItem>
          <BDropdownItem
            v-if="!isDatingProfilePrivate"
            @click="onDownloadDatingProfile"
          >
            {{ $t('profile.download-dating-profile') }}
          </BDropdownItem>
          <BDropdownItem
            v-else
            @click="onRequestDatingProfile"
          >
            {{ $t('profile.request-dating-profile') }}
          </BDropdownItem>
        </BDropdown>
      </div>

      <!-- profile pictures -->
      <Carousel
        v-if="profileImages.length"
        ref="pictures"
        class="profile-pictures"
        :items-to-show="itemsToShow"
        :items-to-scroll="1"
        snap-align="start"
      >
        <Slide
          v-for="(image, index) in profileImages"
          :key="index"
        >
          <img
            v-if="image"
            class="profile-picture-item"
            :src="image"
            alt=""
          >
        </Slide>
      </Carousel>

      <template v-if="datingProfile">
        <!-- request dating profile  -->
        <div
          v-if="isDatingProfilePrivate"
          class="profile-container text-center"
        >
          <div class="profile-text">
            {{ profile.firstName }}'s {{ $t('profile.available-request') }}
            <br>
            <a
              href="#"
              @click="onRequestDatingProfile"
            >
              {{ $t('profile.request-to-view-dating-profile', { firstName: profile.firstName}) }}
            </a>
          </div>
        </div>

        <!-- dating profile section -->
        <div
          v-else
          class="profile-container pull-if-rtl"
        >
          <div
            v-if="datingProfile.aboutMe"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.about-me') }}:
          </div>
          <div
            v-if="datingProfile.aboutMe"
            v-show="datingProfile.primaryPersonalityTrait && datingProfile.secondaryPersonalityTrait"
            class="profile-trait pull-if-rtl-label"
          >
            {{ personality }}
          </div>
          <p v-if="datingProfile.aboutMe">
            {{ datingProfile.aboutMe }}
          </p>

          <div
            v-if="datingProfile.lookingFor"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.looking-for') }}:
          </div>
          <p v-if="datingProfile.lookingFor">
            {{ datingProfile.lookingFor }}
          </p>

          <div
            v-if="profile.religiousAffiliation ||
              datingProfile.hashkafa ||
              datingProfile.ethnicBackground ||
              datingProfile.torahObservantSince ||
              datingProfile.datingKeepKosher ||
              datingProfile.torahLearning ||
              datingProfile.prayer"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.religious-background') }}:
          </div>
          <ul
            v-if="profile.religiousAffiliation ||
              datingProfile.hashkafa ||
              datingProfile.ethnicBackground ||
              datingProfile.torahObservantSince ||
              datingProfile.datingKeepKosher ||
              datingProfile.torahLearning ||
              datingProfile.prayer"
            class="list-unstyled"
          >
            <li v-if="profile.religiousAffiliation">
              <div>{{ $t('profile.observance') }}:</div>
              <span>{{ $t(`enums.ReligiousAffiliation.${profile.religiousAffiliation}`) }}</span>
            </li>
            <li v-if="datingProfile.hashkafa">
              <div>{{ $t('profile.hashkafa') }}:</div>
              <span>{{ $t(`enums.Hashkafa.${datingProfile.hashkafa}`) }}</span>
            </li>
            <li v-if="datingProfile.ethnicBackground">
              <div>{{ $t('profile.ethnicity') }}:</div>
              <span>{{ $t(`enums.EthnicBackground.${datingProfile.ethnicBackground}`) }}</span>
            </li>
            <li v-if="datingProfile.torahObservantSince">
              <div>{{ $t('profile.torah-observant') }}:</div>
              <span>{{ datingProfile.torahObservantSince }}</span>
            </li>
            <li v-if="datingProfile.datingKeepKosher">
              <div>{{ $t('profile.kosher-status') }}:</div>
              <span>{{ $t(`enums.KeepKosher.${datingProfile.datingKeepKosher}`) }}</span>
            </li>
            <li v-if="datingProfile.torahLearning">
              <div>{{ $t('profile.learn-torah') }}:</div>
              <span>{{ $t(`enums.Frequency.${datingProfile.torahLearning}`) }}</span>
            </li>
            <li v-if="datingProfile.prayer">
              <div>{{ $t('profile.pray') }}:</div>
              <span>{{ $t(`enums.Frequency.${datingProfile.prayer}`) }}</span>
            </li>
          </ul>

          <div
            v-if="datingProfile.maritalStatus
              || profile.birthday
              || datingProfile.height
              || datingProfile.bodyType
              || datingProfile.coveringHair
              || datingProfile.wearSkirts"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.personal-data') }}:
          </div>
          <ul
            v-if="datingProfile.maritalStatus
              || profile.birthday
              || datingProfile.height
              || datingProfile.bodyType
              || datingProfile.coveringHair
              || datingProfile.wearSkirts"
            class="list-unstyled"
          >
            <li v-if="datingProfile.maritalStatus">
              <div>{{ $t('profile.marital-status') }}:</div>
              <span>{{ $t(`enums.MaritalStatus.${datingProfile.maritalStatus}`) }}</span>
            </li>
            <li v-if="age">
              <div>{{ $t('profile.age') }}:</div>
              <span>{{ age }}</span>
            </li>
            <li v-if="datingProfile.height">
              <div>{{ $t('profile.height') }}:</div>
              <span>{{ heightText }}</span>
            </li>
            <li v-if="datingProfile.bodyType">
              <div>{{ $t('profile.body-type') }}:</div>
              <span>{{ $t(`enums.DatingProfileBodyType.${datingProfile.bodyType}`) }}</span>
            </li>
            <li v-if="datingProfile.coveringHair">
              <div>{{ $t('dating-profile-edit.background.plan-on-covering-my-hair') }}:</div>
              <span>{{ $t('general.yes') }}</span>
            </li>
            <li v-if="datingProfile.wearSkirts">
              <div>{{ $t('dating-profile-edit.background.plan-on-wearing-skirts') }}:</div>
              <span>{{ $t('general.yes') }}</span>
            </li>
          </ul>

          <div
            v-if="datingProfile.primaryLanguage
              || datingProfile.secondaryLanguage
              || datingProfile.livingIsrael
              || datingProfile.locationUpbringing"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.additional-information') }}:
          </div>
          <ul
            v-if="datingProfile.primaryLanguage
              || datingProfile.secondaryLanguage
              || datingProfile.livingIsrael
              || datingProfile.locationUpbringing"
            class="list-unstyled"
          >
            <li v-if="datingProfile.primaryLanguage">
              <div>{{ $t('profile.primary-language') }}:</div>
              <span>{{ $t(`dating-profile-edit.background.language.${datingProfile.primaryLanguage}`) }}</span>
            </li>
            <li v-if="datingProfile.secondaryLanguage">
              <div>{{ $t('profile.secondary-language') }}:</div>
              <span>{{ $t(`dating-profile-edit.background.language.${datingProfile.secondaryLanguage}`) }}</span>
            </li>
            <li v-if="datingProfile.livingIsrael">
              <div>{{ $t('profile.living-israel') }}:</div>
              <span>{{ $t(`enums.Importance.${datingProfile.livingIsrael}`) }}</span>
            </li>
            <li v-if="datingProfile.locationUpbringing">
              <div>{{ $t('profile.grew-up') }}:</div>
              <span>
                {{ datingProfile.locationUpbringing }}
              </span>
            </li>
          </ul>

          <div
            v-if="datingProfile.datingEmploymentStatus
              || datingProfile.datingSecularEducation
              || datingProfile.datingJewishEducation"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.education') }}:
          </div>
          <ul
            v-if="datingProfile.datingEmploymentStatus
              || datingProfile.datingSecularEducation
              || datingProfile.datingJewishEducation"
            class="list-unstyled"
          >
            <li v-if="datingProfile.datingEmploymentStatus">
              <div>{{ $t('profile.employment') }}:</div>
              <span>{{ $t(`enums.EmploymentStatus.${datingProfile.datingEmploymentStatus}`) }}</span>
            </li>
            <li v-if="datingProfile.datingSecularEducation">
              <div>{{ $t('profile.secular') }}:</div>
              <span>{{ $t(`enums.SecularEducation.${datingProfile.datingSecularEducation}`) }}</span>
            </li>
            <li v-if="datingProfile.datingJewishEducation">
              <div>{{ $t('profile.highest-jewish') }}:</div>
              <span>{{ $t(`enums.JewishEducation.${datingProfile.datingJewishEducation}`) }}</span>
            </li>
          </ul>

          <div
            v-if="datingProfile.shadchanInfo
              || (datingProfile.references && datingProfile.references.length)"
            class="profile-label pull-if-rtl-label"
          >
            {{ $t('profile.dating-references') }}:
          </div>
          <ul
            v-if="datingProfile.shadchanInfo
              || (datingProfile.references && datingProfile.references.length)"
            class="list-unstyled"
          >
            <li v-if="datingProfile.shadchanInfo">
              <div>{{ $t('profile.matchmaker') }}:</div>
              <span>{{ datingProfile.shadchanInfo }}</span>
            </li>
            <div v-if="datingProfile.references && datingProfile.references.length">
              <li
                v-for="(reference, index) in datingProfile.references"
                :key="index"
              >
                <div>{{ $t('profile.dating-reference') }}:</div>
                <span>{{ reference.name }} {{ reference.email || '' }}</span>
              </li>
            </div>
          </ul>
        </div>
      </template>
    </div>
  </BModal>
</template>

<script lang="ts">
import 'vue3-carousel/dist/carousel.css'

import { computed, defineComponent, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Carousel, Slide } from 'vue3-carousel'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import MessageMe from '@/components/Common/MessageMe.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { useRegisterModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import type { Profile } from '@/types'
import {
  calculateAge,
  getActiveOrSinceNotation,
  getHeightText,
  getPublicMediaUrl,
  isDateValid,
} from '@/utils'

const modalId = Modal.DATING_PROFILE

export default defineComponent({
  name: 'DatingProfileModal',
  components: {
    Carousel,
    MessageMe,
    Slide,
    ProfileAvatar
  },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
  },
  setup(props) {
    const { locale, t } = useI18n()
    const store = useStore(storeKey)
    const { isVisible } = useRegisterModal(modalId)
    const { showSuccessToast, showErrorToast } = useToast()
    const mq = useMq()

    const activeProfile = computed(() => store.state.profile.activeProfile)
    const isViewingSelf = computed(() => {
      return activeProfile.value?.id === props.profile.id
    })

    const age = computed((): number | null => {
      const { birthday } = props.profile
      if (birthday && isDateValid(birthday)) {
        return calculateAge(birthday)
      }
      return null
    })

    const datingProfile = computed(() => {
      return props.profile.datingProfile
    })

    const itemsToShow = computed(() => mq.laptop ? 3 : 5)

    const profileImages = computed(() => {
      return props.profile.pictures.map(item => getPublicMediaUrl(item.medium))
    })

    const isRtl = computed(() => {
      let className = ''
      if (locale.value === 'ru') {
        className += 'locale-russian'
      }
      return className
    })

    const isDatingProfilePrivate = computed(() => {
      const { datingProfile } = props.profile
      return datingProfile?.isPrivate && (datingProfile?.id !== activeProfile.value?.datingProfile?.id)
    })

    const heightText = computed(() => {
      const { datingProfile } = props.profile
      if (datingProfile?.height) {
        return getHeightText(datingProfile?.height)
      }
      return ''
    })

    const activeDate = computed((): string => {
      const { createdAt, dateActive } = props.profile
      return getActiveOrSinceNotation(createdAt, dateActive)
    })

    const personality = computed(() => {
      const { datingProfile } = props.profile
      return t(`enums.PersonalityTrait.${datingProfile?.primaryPersonalityTrait}`).toString()
       + t('profile.and').toString()
       + t(`enums.PersonalityTrait.${datingProfile?.secondaryPersonalityTrait}`).toString()
    })

    const onShow = () => {
      // Code tweaks to render carousel
      nextTick(() => {
        nextTick(() => window.dispatchEvent(new Event('resize')))
      })
    }

    const closeModal = () => {
      isVisible.value = false
    }

    const onRequestDatingProfile = async () => {
      try {
        const payload = {
          profileId: props.profile.id
        }
        await store.dispatch('profile/requestDatingProfile', payload)
        showSuccessToast(
          t('action.dating-profile.request').toString(),
          t('profile-view.general.success').toString()
        )
      } catch (error: any) {
        showErrorToast(
          error.message.replace('GraphQL error:', ''),
          t('profile-view.general.error').toString()
        )
        console.error(error.message)
      }
    }

    const onEmailDatingProfile = async () => {
      try {
        const payload = {
          profileId: props.profile.id
        }
        await store.dispatch('profile/emailDatingProfile', payload)
        showSuccessToast(
          t('action.dating-profile.email').toString(),
          t('profile-view.general.success').toString()
        )
      } catch (error: any) {
        showErrorToast(
          error,
          t('profile-view.general.error').toString()
        )
      }
    }

    const onDownloadDatingProfile = async () => {
      try {
        const payload = {
          profileId: props.profile.id
        }
        const { data } = await store.dispatch('profile/downloadDatingProfile', payload)
        downloadPdfFromBase64(data)
        showSuccessToast(
          t('action.dating-profile.download').toString(),
          t('profile-view.general.success').toString()
        )
      } catch (error: any) {
        showErrorToast(
          t('action.dating-profile.download-error').toString(),
          t('profile-view.general.error').toString()
        )
      }
    }

    const downloadPdfFromBase64 = (b64: string) => {
      // Insert a link that allows the user to download the PDF file
      var element = document.createElement('a')
      element.setAttribute('href', 'data:application/octet-stream;base64,' + b64)
      element.setAttribute('download', `${props.profile.displayName}.pdf`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }

    return {
      activeDate,
      activeProfile,
      age,
      closeModal,
      datingProfile,
      downloadPdfFromBase64,
      heightText,
      isDatingProfilePrivate,
      isRtl,
      isViewingSelf,
      isVisible,
      itemsToShow,
      modalId,
      onDownloadDatingProfile,
      onEmailDatingProfile,
      onRequestDatingProfile,
      onShow,
      personality,
      profileImages,
    }
  }
})
</script>

<style scoped lang="scss">
.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  z-index: 100;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Poppins;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
  text-align: left;
}

.profile-info {
  width: 100%;
  display: flex;

  @media (max-width: $mobileMaxWidth) {
    flex-direction: column;
  }

  .avatar-container {
    flex: 2;
    display: flex;
    justify-content: center;

    @media (max-width: $mobileMaxWidth) {
      flex: unset;
    }

    .avatar {
      height: 177px;
      width: 177px;
      padding: 5px;
      border: 2px solid #f39c12;
      border-radius: 50%;
    }
  }

  .info-container {
    flex: 3;
    display: flex;
    flex-direction: column;

    @media (max-width: $mobileMaxWidth) {
      flex: unset;
      text-align: center;
    }

    .profile-name {
      font-size: 20px;
      font-weight: 700;
      margin-top: 10px;
    }

    .profile-text {
      font-size: 14px;
      color: grey;
    }

    .totals-container {
      display: flex;
      width: 100%;
      margin-top: 20px;

      .totals-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 40px;

        span {
          &:first-child {
            font-size: 12px;
            color: gray;
          }
          &:last-child {
            font-size: 20px;
            font-weight: 700;
            color: gray;
          }
        }
      }
    }
  }
}

.profile-buttons {
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-top: 1px solid #e7eaf3;
}

@mixin profile-button-mixin {
  border-radius: 30px;
  padding: 0.25rem 1rem;
  border-radius: 30px;
  margin: 6px;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: bold;

  svg {
    margin-left: 8px;
  }

  .rtl-at-root {
    svg {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}
:deep(.profile-button) {
  @include profile-button-mixin;
}

:deep(.dating-options-dropdown) {
  button {
    @include profile-button-mixin;
    width: 200px;
  }
}

ul.list-unstyled {
  width: 100% !important;
  padding: 0.25rem 0;
  margin-top: 0.25rem;

  li {
    font-size: 12px;
  }
}

:deep(.dropdown-item) {
  width: 200px;
  font-size: 12px;
}

.profile-pictures {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 50px 5px rgba(0, 0, 0, 0.25);
  margin: 7px auto 7px;
  width: 100%;
  padding: 6px;
  padding-right: 0px;
}

.profile-picture-item {
  flex: 1;
  width: calc(100% - 6px);
  overflow: hidden;
  object-fit: cover;
}

.profile-container {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 50px 5px rgba(0, 0, 0, 0.25);
  height: auto;
  margin: 7px auto 7px;
  width: 100%;
  overflow: hidden;
  padding: 20px 30px;
  position: relative;
  display: flex;
  flex-direction: column;

  .profile-label {
    font-size: 17px;
    font-weight: bold;
    border-bottom: 1px dotted grey;
    margin-bottom: 12px;
    margin-top: 20px;
  }

  .profile-trait {
    padding-bottom: 10px;
    font-family: 'Parisienne', cursive;
    font-size: 14px;
    font-weight: bold;
  }

  p {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 20px;
  }

  li {
    font-size: 13px;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    div {
      margin-right: 5px;
      font-weight: bold;
    }
  }

  a:hover {
    text-decoration: none;
  }

  .view-complete-dating-profile {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: #0082bf;
    padding: 15px;
    margin-bottom: 0.5rem;

    &:hover {
      color: #0052ea;
    }
  }
}

.list-unstyled {
  li {
    display: flex;
    align-items: center;
  }
}

.rtl-at-root {
  .close-icon {
    left: 15px;
    right: unset;
  }

  .profile-view-button {
    svg {
      margin-left: 0px;
      margin-right: 8px;
    }
  }

  .list-inline {
    padding-left: unset;
    padding-right: 0;
  }

  .list-unstyled {
    padding-right: 0;

    li {
      text-align: right;

      div {
        margin-left: 5px;
        margin-right: 0;
      }
    }
  }
}
</style>
