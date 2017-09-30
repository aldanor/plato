<template>
  <q-layout view="lHh Lpr fff">
    <q-toolbar slot="header">
      <q-toolbar-title>Plato</q-toolbar-title>
    </q-toolbar>

    <div v-if="!isUploading" class="layout-padding row justify-center">
      <div style="width: 412px; max-width: 93vw;">
        <q-card style="padding-top: 20px; margin-bottom: 0;">
          <q-card-title style="position: relative;">
            <center>
              <transition group mode="out-in" duration="150"
                enterActiveClass="animated fadeIn"
                :leaveActiveClass="animateClass">
                <p class="entry" key="a" v-if="animateOddFrame && !isDone">
                  {{currentEntry}}
                </p>
                <p class="entry" key="b" v-else-if="!animateOddFrame && !isDone">
                  {{currentEntry}}
                </p>
                <p class="strong text-faded" key="c" v-else>
                  <big>Done!</big>
                </p>
              </transition>
            </center>
            <transition
              enterActiveClass="animated fadeIn"
              leaveActiveClass="animated fadeOut"
              duration="300">
              <div class="text-faded" id="status-bottom-right" v-show="!isDone">
                <small>{{statusText}}</small>
              </div>
            </transition>
          </q-card-title>
          <q-progress :percentage="progress" color="primary" animate />
          <q-card-separator/>
          <q-card-actions align="center">
            <big-button icon="attachment" color="faded"
              :disabled="false" @click="startUploading" />
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

    <div v-if="!isUploading" class="layout-padding row justify-center"
      style="padding-top: 0; margin-bottom: 0;" v-show="canRewind">
      <div style="width: 400px; max-width: 90vw;">
        <recent-entries />
      </div>
    </div>

    <div v-if="isUploading" class="layout-padding row justify-center">
      <div style="width: 412px; max-width: 93vw;">
        <upload></upload>
     </div>
    </div>
  </q-layout>
</template>

<script>
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'
import 'quasar-extras/animate/fadeOutRight.css'
import 'quasar-extras/animate/fadeOutLeft.css'

import BigButton from './BigButton.vue'
import RecentEntries from './RecentEntries.vue'
import Upload from './Upload.vue'

import { mapState, mapActions, mapGetters } from 'vuex'
import { Action } from '../common'

export default {
  name: 'index',

  components: { BigButton, RecentEntries, Upload },

  methods: mapActions([
    'rewind', 'accept', 'reject', 'ignore', 'jumpTo', 'startUploading'
  ]),

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
      'counter',
      'pos',
      'isUploading'
    ]),

    animateOddFrame () {
      return !(this.counter % 2)
    },

    progress () {
      return this.pos * 100.0 / this.numEntries
    },

    animateClass () {
      return {
        [Action.REWIND]: 'fadeOutRight animate-neutral',
        [Action.ACCEPT]: 'fadeOut animate-positive',
        [Action.REJECT]: 'fadeOut animate-negative',
        [Action.IGNORE]: 'fadeOutLeft animate-neutral'
      }[this.lastAction] + ' animated'
    },

    statusText () {
      return `${this.numDone} of ${this.numEntries}`
    }
  }
}
</script>

<style>
#file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

#status-bottom-right {
  position: absolute;
  right: 8px;
  bottom: 0px;
}

.entry {
  font-weight: 200;
  font-size: 170%;
}

.animate-positive.entry,
.animate-negative.entry {
  font-weight: 500;
}

.animate-neutral {
  color: #777;
}

.animate-positive {
  color: #21ba45;
}

.animate-negative {
  color: #db2828;
}
</style>
