import Vue from 'vue'
import Vuex from 'vuex'
import { Rating, Action } from './common'

Vue.use(Vuex)

const ENTRIES = [
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
]

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    entries: ENTRIES.map((entry, index) => ({
      entry: entry,
      index: index,
      rating: Rating.NONE
    })),
    pos: 0,
    lastAction: null,
    counter: 0
  },

  getters: {
    numEntries (state) {
      return state.entries.length
    },
    isDone (state) {
      return state.pos >= state.entries.length
    },
    hasEntries (state, getters) {
      return getters.numEntries > 0
    },
    canRewind (state) {
      return state.pos > 0
    },
    currentEntry (state) {
      return state.entries[state.pos].entry
    },
    numDone (state, getters) {
      return getters.isDone ? getters.numEntries : state.pos + 1
    },
    recentEntries (state) {
      let entries = []
      for (let i = state.pos - 1; i > state.pos - 6 && i >= 0; i--) {
        entries.push(state.entries[i])
      }
      return entries
    }
  },

  mutations: {
    setRating (state, rating) {
      state.entries[state.pos].rating = rating
    },
    jumpTo (state, pos) {
      state.pos = pos
    },
    setLastAction (state, action) {
      state.lastAction = action
    },
    increment (state) {
      state.counter++
    }
  },

  actions: {
    rewind (context) {
      context.commit('jumpTo', context.state.pos - 1)
      context.commit('setLastAction', Action.REWIND)
      context.commit('increment')
    },
    accept (context) {
      context.commit('setRating', Rating.GOOD)
      context.commit('jumpTo', context.state.pos + 1)
      context.commit('setLastAction', Action.ACCEPT)
      context.commit('increment')
    },
    reject (context) {
      context.commit('setRating', Rating.BAD)
      context.commit('jumpTo', context.state.pos + 1)
      context.commit('setLastAction', Action.REJECT)
      context.commit('increment')
    },
    ignore (context) {
      context.commit('setRating', Rating.NONE)
      context.commit('jumpTo', context.state.pos + 1)
      context.commit('setLastAction', Action.IGNORE)
      context.commit('increment')
    },
    jumpTo (context, pos) {
      context.commit('jumpTo', pos)
      context.commit('setLastAction', Action.REWIND)
      context.commit('increment')
    }
  }
})
