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
      <div style="width: 412px; max-width: 93vw;">
        <q-card style="padding-top: 20px; margin-bottom: 0;">
          <q-card-title>
            <center>
              <p class="light-paragraph">
                <transition group mode="out-in" duration="150"
                  enterActiveClass="animated fadeIn"
                  :leaveActiveClass="animateClass">
                  <div key="a" v-if="animateOddFrame && !isDone">
                    <big>{{currentEntry.entry}}</big>
                  </div>
                  <div key="b" v-else-if="!animateOddFrame && !isDone">
                    <big>{{currentEntry.entry}}</big>
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
              :disabled="!canRewind" @click="rewind" />
            <big-button icon="thumb_up" color="positive"
              :disabled="isDone" @click="accept" />
            <big-button icon="thumb_down" color="negative"
              :disabled="isDone" @click="reject" />
            <big-button icon="fast_forward" color="faded"
              :disabled="isDone" @click="ignore" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="layout-padding row justify-center"
      style="padding-top: 0;" v-show="canRewind">
      <div style="width: 400px; max-width: 90vw;">
        <q-list link inset-separator>
          <q-list-header>Recent Entries</q-list-header>
          <template v-for="(e, i) in recentEntries">
            <q-item @click="jumpTo(e.index)">
              <q-item-side left
                :icon="iconForRating(e.rating)"
                :color="colorForRating(e.rating)" />
              <q-item-main
                :label="e.entry"
                :class="classForRating(e.rating)" />
              <q-item-side right
                :stamp="`${e.index + 1}`" />
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
  QCard,
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QCardActions,
  QProgress
} from 'quasar'

import BigButton from './BigButton.vue'

import { mapState, mapActions, mapGetters } from 'vuex'
import { Rating, Action } from '../common'

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
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QProgress,
    BigButton
  },

  methods: {
    ...mapActions([
      'rewind',
      'accept',
      'reject',
      'ignore',
      'jumpTo'
    ]),

    mapRating (rating, values) {
      return {
        [Rating.NONE]: values[0],
        [Rating.BAD]: values[1],
        [Rating.GOOD]: values[2]
      }[rating]
    },

    iconForRating (rating) {
      return this.mapRating(rating, ['', 'clear', 'done'])
    },

    colorForRating (rating) {
      return this.mapRating(rating, ['faded', 'negative', 'positive'])
    },

    classForRating (rating) {
      return 'text-faded' + this.mapRating(rating, [' light-paragraph', '', ''])
    }
  },

  computed: {
    ...mapGetters([
      'currentEntry',
      'numEntries',
      'canRewind',
      'isDone',
      'numDone',
      'recentEntries'
    ]),
    ...mapState([
      'lastAction',
      'counter'
    ]),

    animateOddFrame () {
      return !(this.counter % 2)
    },

    progress () {
      return this.pos * 100.0 / this.numWords
    },

    animateClass () {
      return {
        [Action.REWIND]: 'fadeOutRight animateNeutral',
        [Action.ACCEPT]: 'fadeOut animatePositive',
        [Action.REJECT]: 'fadeOut animateNegative',
        [Action.IGNORE]: 'fadeOutLeft animateNeutral'
      }[this.lastAction] + ' animated'
    },

    statusText () {
      return `${this.numDone} of ${this.numEntries}`
    }
  }
}
</script>

<style>
.animateNeutral {
  color: #777;
  font-weight: 200;
}

.animatePositive {
  color: #21ba45;
  font-weight: 500;
}

.animateNegative {
  color: #db2828;
  font-weight: 500;
}
</style>
