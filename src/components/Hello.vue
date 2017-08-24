<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        NLP Annotate
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <q-list no-border link inset-delimiter>
        <q-list-header>Essential Links</q-list-header>
        <q-item @click="launch('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click="launch('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
          <q-item-side icon="chat" />
          <q-item-main label="Gitter Channel" sublabel="Quasar Lobby" />
        </q-item>
        <q-item @click="launch('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </div>

    <div class="layout-padding justify-center">
      <q-card style="padding-top: 25px">
        <q-card-title>
          <center>
            <p class="light-paragraph">
              <transition group mode="out-in" duration="150"
                enterActiveClass="animated fadeIn"
                :leaveActiveClass="animateStyle">
                <div key="a" v-if="show && !isDone">
                  <big>{{currentWord}}</big>
                </div>
                <div key="b" v-else-if="!show && !isDone">
                  <big>{{currentWord}}</big>
                </div>
                <div key="c" v-else>
                  <p class="strong text-faded">
                    <big>
                      Done!
                    </big>
                  </p>
                </div>
              </transition>
            </p>
          </center>
          <div slot="right">{{statusText}}</div>
          <right></right>
        </q-card-title>
        <q-card-separator/>
        <q-card-actions align="center">
          <q-btn big flat class="big-button" :disabled="!canRewind"
            color="faded" icon="fast_rewind" @click="onRewind" />
          <q-btn big flat class="big-button" :disabled="isDone"
            color="positive" icon="thumb_up" @click="onAccept" />
          <q-btn big flat class="big-button" :disabled="isDone"
            color="negative" icon="thumb_down" @click="onReject" />
          <q-btn big flat class="big-button" :disabled="isDone"
            color="faded" icon="fast_forward" @click="onIgnore" />
        </q-card-actions>
      </q-card>
    </div>
  </q-layout>
</template>

<script>
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'
import 'quasar-extras/animate/fadeOutRight.css'
import 'quasar-extras/animate/fadeOutLeft.css'

import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QFixedPosition,
  QCard,
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QCardActions
} from 'quasar'

const Action = {
  REWIND: 'rewind',
  ACCEPT: 'accept',
  REJECT: 'reject',
  IGNORE: 'ignore'
}

export default {
  name: 'index',

  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QFixedPosition,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions
  },

  data () {
    return {
      words: [
        'Foo',
        'Bar',
        'Baz',
        'Qwe'
      ],
      pos: 0,
      show: true,
      action: Action.ACCEPT
    }
  },

  methods: {
    onRewind () {
      this.advance(Action.REWIND)
    },

    onAccept () {
      this.advance(Action.ACCEPT)
    },

    onReject () {
      this.advance(Action.REJECT)
    },

    onIgnore () {
      this.advance(Action.IGNORE)
    },

    advance (action) {
      this.action = action
      this.pos += action === Action.REWIND ? -1 : 1
      this.show = !this.show
    }
  },

  computed: {
    currentWord () {
      return this.words[this.pos]
    },

    numWords () {
      return this.words.length
    },

    canRewind () {
      return this.pos > 0
    },

    isDone () {
      return this.pos === this.numWords
    },

    animateStyle () {
      const styles = {
        rewind: 'fadeOutRight',
        accept: 'fadeOut',
        reject: 'fadeOut',
        ignore: 'fadeOutLeft'
      }
      return `animated ${styles[this.action]} ${this.action}`
    },

    statusText () {
      const pos = this.isDone ? this.numWords : this.pos + 1
      return `${pos} of ${this.numWords}`
    }
  }
}
</script>

<style lang="sass">
$rewind-color: darken(#777, 0%);
$accept-color: darken(#21ba45, 0%);
$reject-color: darken(#db2828, 0%);
$ignore-color: darken(#777, 0%);

.rewind { color: $rewind-color; font-weight: 200; }
.accept { color: $accept-color; font-weight: 500; }
.reject { color: $reject-color; font-weight: 500; }
.ignore { color: $ignore-color; font-weight: 200; }

.big-button { padding-left: 18px !important; }
</style>
