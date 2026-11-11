<template>
  <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 profile">
    <div class="img-box overlay-image">
      <img :src="profile.image" class="img-responsive" />

      <div class="hover">
        <div v-if="$t(profile.bio).length > 0" class="text" @click="$emit('open-modal', profile)">
          More about {{ profile.firstName }}...
        </div>
      </div>

      <ul class="text-center social-media-icons">
        <a v-if="profile.facebook.length > 0" :href="profile.facebook" target="_blank">
          <li>
            <FaIcon :icon="['fab', 'facebook-f']" />
          </li>
        </a>
        <a v-if="profile.twitter.length > 0" :href="profile.twitter" target="_blank">
          <li><FaIcon :icon="['fab', 'twitter']" /></li>
        </a>
        <a v-if="profile.linkedin.length > 0" :href="profile.linkedin" target="_blank">
          <li><FaIcon :icon="['fab', 'linkedin']" /></li>
        </a>
        <a v-if="profile.instagram.length > 0" :href="profile.instagram" target="_blank">
          <li>
            <FaIcon :icon="['fab', 'instagram']" />
          </li>
        </a>
        <a v-if="profile.strava.length > 0" :href="profile.strava" target="_blank">
          <li><FaIcon :icon="['fab', 'strava']" /></li>
        </a>
      </ul>
    </div>

    <h1>{{ profile.name }}</h1>
    <h2>{{ $t(profile.title) }}</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TeamMember',
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  emits: ['open-modal'],
})
</script>

<style scoped lang="scss">
.profile {
  margin-top: 25px;
  text-align: center;

  .img-responsive,
  .thumbnail > img,
  .thumbnail a > img,
  .carousel-inner > .item > img,
  .carousel-inner > .item > a > img {
    max-height: 220px;
    margin: auto;
  }

  h1 {
    font-weight: bold;
    font-size: 20px;
    margin: 10px 0 0 0;
  }

  h2 {
    font-size: 16px;
    margin-top: 9px;
  }
}

.img-box {
  opacity: 1;
  display: block;
  position: relative;
  max-width: 220px;
  margin: auto;

  &:hover {
    cursor: pointer;
  }

  &:after {
    content: '';
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.75);
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }

  ul {
    position: absolute;
    z-index: 2;
    bottom: 50px;
    text-align: center;
    width: 100%;
    padding-left: 0px;
    height: 0px;
    margin: 0px;
    opacity: 0;
  }

  &:after,
  ul,
  ul li {
    -webkit-transition: all 0.5s ease-in-out 0s;
    -moz-transition: all 0.5s ease-in-out 0s;
    transition: all 0.5s ease-in-out 0s;
  }

  ul i {
    font-size: 20px;
    letter-spacing: 10px;
  }

  ul li {
    width: 30px;
    height: 30px;
    text-align: center;
    margin: 2px;
    padding: 5px;
    display: inline-block;
  }

  a {
    color: #fff;
  }

  &:hover:after {
    opacity: 1;
  }

  &:hover ul {
    opacity: 1;
  }

  ul a {
    -webkit-transition: all 0.3s ease-in-out 0s;
    -moz-transition: all 0.3s ease-in-out 0s;
    transition: all 0.3s ease-in-out 0s;
  }

  a:hover li {
    border-color: #fff;
    color: #88c425;
  }
}

.overlay-image {
  .text {
    color: #fff;
    font-size: 14px;
    line-height: 1.5em;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    z-index: 3;
  }

  .hover {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: 0.5s ease;
  }

  &:hover .hover {
    opacity: 1;
    cursor: pointer !important;
  }

  .social-media-icons {
    font-size: 20px;
  }
}
</style>
