Vue.component('my-header', {
  props: {
    apiUrl: { type: Object, required: true },
  },
  data: () => ({
    notifyInfo: { list: [], unReadTotal: 0 },
    cartCount: 0,
    isServer: false,
    localUrl: window.componentPageUrl.myHeader.localUrl,
    serverUrl: window.componentPageUrl.myHeader.serverUrl
  }),
  computed: {
    isAuth() {
      return this.$store.state.isAuth
    },
    realUrl() {
      return this.isServer ? this.serverUrl : this.localUrl
    },
    cartPageUrl() {
      return this.isAuth ? this.realUrl.cart : this.realUrl.login
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
      this.cartCount = count
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
    <header id="my-header" class="bg-white">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="mr-2 text-limeGreen" @click="toggleCategory">
            <i class="fal fa-bars"></i>
          </div>
          <a :href="realUrl.home" class="d-flex align-items-center">
            <span class="mr-2 logo-bg"></span>
            <h2 class="text-moBlue font-weight-bold logo-title">光南大批發</h2>
          </a>
        </div>
        <div class="d-flex align-items-center">
          <a :href="realUrl.notify" class="icon-page-link" v-if="isAuth">
            <i class="fal fa-bell text-dark"></i>
            <span class="bg-tomatoRed rounded-circle bell-dot" v-if="showNotifyDot"></span>
          </a>
          <a href="javascript:;" class="icon-page-link" @click="toggleKeyword">
            <i class="fal fa-search text-dark"></i>
          </a>
          <a :href="cartPageUrl" class="icon-page-link">
            <i class="fal fa-shopping-cart text-dark"></i>
            <p class="text-white bg-tomatoRed rounded-circle text-center cart-count" v-if="showCartCount">
              <span>{{ cartCount }}</span>
            </p>
          </a>
        </div>
      </div>
    </header>`
})