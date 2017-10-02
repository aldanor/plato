<template>
  <q-list link inset-separator>
    <q-list-header>Recent Entries</q-list-header>
    <template v-for="(e, i) in recentEntries">
      <q-item @click="jumpTo(e.index)">
        <q-item-side left
          :icon="iconForRating(e.rating)"
          :color="colorForRating(e.rating)">
        </q-item-side>
        <q-item-main
          :label="e.entry"
          :class="classForRating(e.rating)">
        </q-item-main>
        <q-item-side right
          :stamp="`${e.index + 1}`">
        </q-item-side>
      </q-item>
    </template>
  </q-list>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Rating } from '../common'

export default {
  name: 'recent-entries',

  computed: mapGetters(['recentEntries']),

  methods: {
    ...mapMutations(['jumpTo']),

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
  }
}
</script>

<style>
</style>
