Vue.component('my-header', {
  props: {
    apiUrl: { type: Object, required: true },
  },
  data: () => ({
    notifyInfo: { list: [], unReadTotal: 0 },
    isServer: false,
    localUrl: window.componentPageUrl.myHeader.localUrl,
    serverUrl: window.componentPageUrl.myHeader.serverUrl
  }),
  computed: {
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
    cartPageUrl() {
      return this.isAuth ? this.realUrl.cart : this.realUrl.login
    },
    isAuth() {
      return this.$store.state.isAuth
    },
    cartCount() {
      return this.$store.state.cartCount
    },
    showCartCount() {
      return this.isAuth && this.cartCount > 0
    },
    showNotifyDot() {
      return this.notifyInfo.unReadTotal > 0
    }
  },
  methods: {
    toggleCategory() {
      this.$store.commit('toggleCategory', true)
    },
    toggleKeyword() {
      this.$store.commit('toggleKeyword', true)
    },
    updateCartCount(count) {
      this.$store.commit('updateCartCount', count)
    },
    async setAuthStatus(status) {
      if (!status) return
      let [cartRes, notifyRes] = await Promise.all([
        cartApi.cart_total({ url: this.apiUrl.cart_total }),
        notifyApi.notification({ url: `${this.apiUrl.notification}?page=1` })
      ])
      this.updateCartCount(cartRes.cartTotal)
      this.notifyInfo.list = notifyRes.aaData
      this.notifyInfo.unReadTotal = notifyRes.unread
    },
  },
  mounted() {
    this.isServer = window.checkIsServer()
  },
  template: `
    <header id="my-header" class="py-10 bg-neutral-7">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="mr-8 text-primary-1 text-4xl" @click="toggleCategory">
            <i class="bi bi-list"></i>	
          </div>
          <a :href="realUrl.home" class="d-flex align-items-center">
            <span class="mr-2 logo-bg"></span>
          </a>
        </div>
        <div class="d-flex align-items-center space-x-16">
          <div class="icon-page-link" @click="toggleKeyword">
            <i class="bi bi-search"></i>
          </div>
          <a v-if="isAuth" :href="realUrl.notify" class="icon-page-link">
            <i class="bi bi-bell"></i>
            <span v-if="showNotifyDot" class="bg-wrong rounded-circle bell-dot"></span>
          </a>
          <a :href="cartPageUrl" class="icon-page-link">
            <i class="bi bi-file-earmark-check"></i>
            <span v-if="showCartCount" class="text-neutral-7 bg-wrong rounded-full text-center cart-count">
              {{ cartCount }}
            </span>
          </a>
        </div>
      </div>
    </header>`
})