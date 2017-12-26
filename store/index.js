import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// window.fetch() のためのポリフィル
require('whatwg-fetch')

const store = () => new Vuex.Store({

  state: {
    authUser: null
  },

  mutations: {
    SET_USER: function (state, user) {
      state.authUser = user
    }
  },

  actions: {
    nuxtServerInit ({commit}, {req}) {
      console.log('req')
      console.log(req.isAuthenticated())
      if (req.session && req.session.authUser) {
        commit('SET_USER', req.session.authUser)
      }
    },
    async login ({commit}) {
      try {
        const {data} = await axios.post('/auth')
        commit('SET_USER', data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          throw new Error('Bad credentials')
        }
        throw error
      }
    }
  }
})
export default store
