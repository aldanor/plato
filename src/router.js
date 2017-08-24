import Vue from 'vue'
import VueRouter from 'vue-router'

import Hello from './components/Hello.vue'
import Error404 from './components/Error404.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', component: Hello },

    // Always leave this last one
    { path: '*', component: Error404 } // Not found
  ]
})
