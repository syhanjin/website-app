import Vuex, {
  Store
} from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Store({
  state: {
    isAuthenticated: false,
    token: '',
    admin: 0,
    me: {},
    perfection: {}
  },
  mutations: {
    initializeStore(state) {
      const token = uni.getStorageSync('token')
      // console.log(token)
      if (token) {
        state.token = token
        state.isAuthenticated = true
      } else {
        state.token = ''
        state.isAuthenticated = false
      }
    },
    setSignature(state, signature) {
      state.me.signature = signature
    },
    setMe(state, me) {
      state.me = me
    },
    setPerfection(state, perfection) {
      state.perfection = perfection
    },
    setAvatar(state, avatar) {
      state.me.avatar = avatar
    },
    setToken(state, token) {
      state.token = token
      state.isAuthenticated = true
    },
    setAdmin(state, admin) {
      state.admin = admin
    },
    removeToken(state) {
      state.token = ''
      state.isAuthenticated = false
    },
    // setWordsPerfectionLibraries(state, libraries) {
    //   state.perfection.word_libraries = libraries
    // }
  }
})


export default store
