export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      user: { account: '', password: '', isKeep: false },
      redirectUrl: '',
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
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
        if (this.tipInfo.status) {
          this.saveUserData(response)
          this.setRedirectUrl()
        }
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
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
      }
    },
    mounted() {
      window.addEventListener('beforeunload', () => {
        window.sessionStorageObj.removeItem('backUrl')
      })
    }
  })
}