<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>Plato</q-toolbar-title>
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

    <div class="layout-padding row justify-center">
      <div style="width: 400px; max-width: 90vw;">
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
          </q-card-title>
          <q-progress :percentage="progress" color="primary" animate />
          <q-card-separator/>
          <q-card-actions align="center">
            <big-button icon="fast_rewind" color="faded"
              :disabled="!canRewind" @click="onRewind" />
            <big-button icon="thumb_up" color="positive"
              :disabled="isDone" @click="onAccept" />
            <big-button icon="thumb_down" color="negative"
              :disabled="isDone" @click="onReject" />
            <big-button icon="fast_forward" color="faded"
              :disabled="isDone" @click="onIgnore" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="layout-padding row justify-center"
      style="padding-top: 0;" v-show="canRewind">
      <div style="width: 400px; max-width: 90vw;">
        <q-list link inset-separator>
          <q-list-header>Recent Words</q-list-header>
          <template v-for="(r, i) in lastRatings">
            <q-item @click="jumpBack(r.num - 1)">
              <q-item-side left
                :icon="iconForRating(r.rating)"
                :color="colorForRating(r.rating)" />
              <q-item-main
                :label="r.word"
                :class="classForRating(r.rating)" />
              <q-item-side right
                :stamp="`#${r.num}`" />
            </q-item>
          </template>
        </q-list>
      </div>
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
  QItemTile,
  QFixedPosition,
  QCard,
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QCardActions,
  QProgress
} from 'quasar'

import BigButton from './BigButton.vue'

const Action = {
  REWIND: 'rewind',
  ACCEPT: 'accept',
  REJECT: 'reject',
  IGNORE: 'ignore'
}

const Rating = {
  NONE: -1,
  BAD: 0,
  GOOD: 1
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
    QItemTile,
    QFixedPosition,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QProgress,
    BigButton
  },

  data () {
    return {
      words: [
        'Banto',
        'Victo',
        'Molin',
        'Tangi',
        'Fango',
        'Numa',
        'Spando',
        'Ravio',
        'Simi',
        'Aira'
      ],
      ratings: [],
      pos: 0,
      show: true,
      action: Action.ACCEPT
    }
  },

  created () {
    this.ratings = Array(this.numWords).fill(Rating.NONE)
  },

  methods: {
    onRewind () {
      this.advance(Action.REWIND, this.pos - 1)
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

    jumpBack (pos) {
      this.advance(Action.REWIND, pos)
    },

    advance (action, pos = null) {
      pos = pos === null ? this.pos + 1 : pos
      this.action = action
      if (action === Action.REWIND) {
        this.pos = pos
      }
      else {
        const rating = {
          accept: Rating.GOOD,
          reject: Rating.BAD,
          ignore: Rating.NONE
        }[action]
        this.ratings[this.pos] = rating
        this.pos += 1
      }
      this.show = !this.show
    },

    colorForRating (rating) {
      return rating === Rating.NONE ? 'faded'
        : rating === Rating.GOOD ? 'positive' : 'negative'
    },

    iconForRating (rating) {
      return rating === Rating.NONE ? ''
        : rating === Rating.GOOD ? 'done' : 'clear'
    },

    classForRating (rating) {
      return rating === Rating.NONE ? 'text-faded' : ''
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

    numDone () {
      return this.isDone ? this.numWords : this.pos + 1
    },

    progress () {
      return this.pos * 100.0 / this.numWords
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
      return `${this.numDone} of ${this.numWords}`
    },

    lastRatings () {
      let ratings = []
      for (let i = this.pos - 1; i > this.pos - 6 && i >= 0; i--) {
        ratings.push({
          num: i + 1,
          word: this.words[i],
          rating: this.ratings[i]
        })
      }
      return ratings
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
