import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import state from './state'
import vuexPersistedstate from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
export default new Vuex.Store({
  actions,
  mutations,
  state,
  plugins: [vuexPersistedstate({storage: window.sessionStorage})]
})
