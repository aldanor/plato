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
    }
  },

  mutations: {
    jumpTo (state, pos) {
      state.pos = pos
      state.lastAction = Action.REWIND
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
    },
    rewind (state) {
      state.pos--
      state.lastAction = Action.REWIND
      state.counter++
    },
    accept (state) {
      state.entries[state.pos].rating = Rating.GOOD
      state.pos++
      state.lastAction = Action.ACCEPT
      state.counter++
    },
    reject (state) {
      state.entries[state.pos].rating = Rating.BAD
      state.pos++
      state.lastAction = Action.REJECT
      state.counter++
    },
    ignore (state) {
      state.entries[state.pos].rating = Rating.NONE
      state.pos++
      state.lastAction = Action.IGNORE
      state.counter++
    }
  },

  actions: {
    rewind (context) {
      context.commit('rewind')
    },
    accept (context) {
      context.commit('accept')
    },
    reject (context) {
      context.commit('reject')
    },
    ignore (context) {
      context.commit('ignore')
    },
    jumpTo (context, pos) {
      context.commit('jumpTo', pos)
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
