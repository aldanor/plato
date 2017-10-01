import Vue from 'vue'
import Vuex from 'vuex'
import { Rating, Action } from './common'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    entries: [],
    pos: 0,
    lastAction: null,
    counter: 0,
    isUploading: true
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
    },
    hasData (state) {
      return state.entries && state.entries.length > 0
    },
    exportData (state) {
      let results = []
      for (let i = 0; i < state.pos; i++) {
        const entry = state.entries[i]
        if (entry.rating !== 0) {
          results.push({
            word: entry.entry,
            rating: entry.rating
          })
        }
      }
      return results
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
    },
    setEntries (state, entries) {
      state.entries = entries.map((entry, index) => ({
        entry: entry,
        index: index,
        rating: Rating.NONE
      }))
      state.pos = 0
    },
    startUploading (state) {
      state.isUploading = true
    },
    stopUploading (state) {
      state.isUploading = false
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
    },
    setEntries (context, entries) {
      context.commit('setEntries', entries)
    },
    startUploading (context) {
      context.commit('startUploading')
    },
    stopUploading (context) {
      context.commit('stopUploading')
    }
  }
})
