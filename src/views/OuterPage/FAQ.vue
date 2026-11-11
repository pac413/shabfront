<template>
  <div class="fag-page container indent">
    <!-- Page Header -->
    <div class="page-header">
      <h1>Shabbat.com FAQ <FaIcon :icon="['fal', 'question-circle']" /></h1>
      <h2>
        <small>Shabbat.com Frequently Asked Questions</small>
      </h2>
    </div>
    <br />

    <!-- FAQ Notice -->
    <div class="alert alert-warning" role="alert">
      This section contains a series of questions and answers, related to <strong>Shabbat.com</strong> and its site and
      app usage. If you cannot find an answer to your question, make sure to
      <a class="alert-link" href="http://www.shabbat.com/contact">contact us.</a>
    </div>

    <!-- Questions -->
    <div v-for="(category, title) in faqs" :key="title" class="faq-group">
      <div class="faq-category">
        {{ title }}
      </div>

      <BCard v-for="(faq, index) in category" :key="index" no-body>
        <BCardHeader v-b-toggle="'answer-' + faq.id" :href="'#' + faq.id">
          <div class="question">
            {{ faq.question }}
          </div>
          <div class="caret">
            <FaIcon :icon="['fas', 'caret-down']" />
          </div>
        </BCardHeader>
        <BCollapse :id="'answer-' + faq.id">
          <BCardBody>
            <BCardText>
              <div v-html="faq.answer" />
              <button v-clipboard:copy="'http://www.shabbat.com/faq/#' + faq.id" class="btn btn-success pull-right">
                <FaIcon :icon="['fas', 'paste']" />
              </button>
            </BCardText>
          </BCardBody>
        </BCollapse>
      </BCard>
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from '@vueuse/head'
import { defineComponent } from 'vue'

import { DONATE_SHABBAT_LINK } from '@/utils'

const FAQS = {
  General: [
    {
      question: 'I love Shabbat.com and would like to contribute towards its Herculean efforts. How can I?',
      answer: `You can contribute on a one-time or ongoing basis. Shabbat.com is a registered 501c3 non profit Corporation. All donations are therefore tax deductible. Navigate to our <a href='${DONATE_SHABBAT_LINK}'>donate page</a>.`,
      id: 'g1',
    },
    {
      question: 'Can Shabbat.com find me a place for Shabbat?',
      answer:
        "Shabbat.com doesn't act to locate hosts and request Shabbat placement. Navigate to Shabbat.com and click on ‘Join Now’ in the top right corner or    center of the screen. Once you are a member – you can search by different location parameters (such as city, zip code, proximity, etc) and see Hosts that you can view their profiles. On profile pages is a 'Host Me' button that allows you to initiate a Host request.<br /><br /> Alternatively, you can download our app in the <a href='https://itunes.apple.com/us/app/id1037705799'>apple app store</a> or <a href='https://play.google.com/store/apps/details?id=com.tribex.shabbat&hl=en'>google play.</a> Follow the registration prompts on the screen and search for hosts in the top search bar located on every view in the app. You can tap the menu icon (in search screen) and activate Gps device based proximity searches and more.",
      id: 'g2',
    },
  ],
  Privacy: [
    {
      question: 'How do I block someone from bothering me?',
      answer: `
        <p>Any member that you are not comfortable with can be blocked. If you block another member they cannot:</p>
        <ul>
          <li>message you</li>
          <li>invite or request hosting</li>
          <li>friend you</li>
        </ul>
        <p>Note: All previous messages and invites disappear automatically on the site.</p>
        <p>To block a member on the website, here are 4 ways to initiate it:</p>
        <ul>
          <li>
            <p>Navigate to their profile, click on the 'About tab (under the cover image in the center of the page). Then click on ‘Member Blocking’ and click on the ‘block’ button.</p>
          </li>
          <li>
            <p>Click on the ‘Gear’ icon menu item in the header of any inner page (on the left). This
                opens the 'Privacy and Availability' settings menu. Click on the item that says ‘Stop someone from bothering
                me’. There you can type the name of the member you wish to block and eventually block
                them.
            </p>
          </li>
          <li>
            <p>On any conversation in your messages page, there is a settings menu (identified by a
                ‘gear’ icon). There is a menu option for blocking the member in your conversation.
                This option is helpful in case someone messages you and upon receiving their message
                you wish to immediately block them.
            </p>
          </li>
          <li>
            <p>Any invite email, friend email, or message email contains a prominent link to take action
                and block the member.</p>
          </li>
        </ul>
      `,
      id: 'p1',
    },
    {
      question: 'How do I prevent people from messaging me?',
      answer:
        "In your 'Privacy and Availability' settings you can specify that you don't want to be contacted. In the header menu area on the far right, click on the 'gear' icon. The first menu item is 'Who can message me?'. There you have multiple options for being messaged. The app contains the same possibilities. On your home screen, swipe to the right. Select 'Privacy Shortcuts'.",
      id: 'p2',
    },
    {
      question: 'I wish to delete my Shabbat.com account. Where can I do that?',
      answer:
        "Account suspend and delete actions are located in your advanced settings page. Note this is only available on the website and not yet on the app. Navigate to your profile by clicking on your name in the header of the page on the left side. On your profile page there are menu items under your cover picture. Click on 'Edit Profile'. On the left side of the page, click on 'Account Settings'. Select 'Advanced Settings' on the screen under the 'Delete Account' section.",
      id: 'p3',
    },
  ],
}

export default defineComponent({
  name: 'FAQ',
  setup() {
    useHead({
      title: 'Shabbat.com Frequently asked questions',
      meta: [
        { vmid: 'fb_title_meta', property: 'og:title', content: 'Shabbat.com FAQ' },
        { vmid: 'fb_description_meta', property: 'og:description', content: 'Shabbat.com Frequently Asked Questions' },
      ],
    })

    return {
      faqs: FAQS,
    }
  },
})
</script>

<style lang="scss" scoped>
.fag-page {
  margin: 0 auto;
  padding: 3em 0;

  @media (max-width: $mobileMaxWidth) {
    padding: 3em 1rem;
  }
}

.page-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  h1 {
    line-height: 40px;
    display: flex;
    align-items: center;

    svg {
      margin-left: 10px;
    }
  }

  h2 {
    margin-top: 0;
    line-height: 24px;
    color: #777;
    font-size: 1.5rem;
  }
}

.faq-category {
  font-size: 27px;
  margin: 2rem 1rem 1rem;
}

.faq-group .card + .card {
  margin-top: 5px;
}

.card {
  .card-header {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    font-size: 16px;

    .question {
      flex: 1;
    }
    .caret {
      flex: 0 0 auto;
    }
  }

  .card-header.collapsed svg.fa-caret-down {
    transform: rotate(0deg);
    color: #454444;
  }

  .card-header svg.fa-caret-down {
    transform: rotate(-180deg);
    color: #f58723;
    transition: all linear 100ms;
  }

  .card-text ul li p {
    padding-left: 15px;
  }
}

.pull-right {
  float: right;
}

.card-body:after {
  display: table;
  content: ' ';
  clear: both;
}

.rtl-at-root {
  .page-header {
    h1 {
      svg {
        margin-left: unset;
        margin-right: 10px;
      }
    }
  }

  .card {
    .card-text ul li p {
      padding-left: unset;
      padding-right: 15px;
    }
  }
}
</style>
