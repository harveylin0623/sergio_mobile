(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.myVuexStore = factory());
}(this, (function () {
  Vue.use(Vuex)
  const store = new Vuex.Store({
    state: {
      isAuth: false,
      categorySidebarIsOpen: false,
      keywordSidebarIsOpen: false,
      cartCount: 0
    },
    mutations: {
      setAuth(state, payload) {
        state.isAuth = payload
      },
      toggleCategory(state, payload) {
        state.categorySidebarIsOpen = payload
      },
      toggleKeyword(state, payload) {
        state.keywordSidebarIsOpen = payload
      },
      updateCartCount(state, payload) {
        state.cartCount = payload
      }
    }
  })

  return store
})));