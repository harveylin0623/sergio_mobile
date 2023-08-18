export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      user: { account: '', password: '', isKeep: false },
      redirectUrl: '',
      tipInfo: { status: false, message: '', isOpen: false },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      saveUserData(payload) {
        window.storageObj.setItem(this.authKey, {
          ...payload.memberProfile,
          token: payload.aaData.access_token,
          member_status: payload.member_status
        })
      },
      setRedirectUrl() {
        let payload = window.sessionStorageObj.getItem('backUrl')
        this.redirectUrl = payload !== null ? payload.url : this.pageUrl.home
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        document.activeElement.blur()
        let response = await authApi.login({
          url: apiUrl.login,
          data: {
            account: window.wm_aes(this.user.account),
            password: window.wm_aes(this.user.password),
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        this.tipInfo.isOpen = true
        if (this.tipInfo.status) {
          this.saveUserData(response)
          this.setRedirectUrl()
        }
        this.isLoading = false
      },
      confirmHandler() {
        if (this.tipInfo.status) location.href = this.redirectUrl
      }
    },
    mounted() {
      window.addEventListener('beforeunload', () => {
        window.sessionStorageObj.removeItem('backUrl')
      })
    }
  })
}