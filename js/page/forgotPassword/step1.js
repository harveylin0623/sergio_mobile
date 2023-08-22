export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    store: window.myVuexStore,
    data: {
      user: { mobile: '', temp_access_token: '' },
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
        let response = await authApi.forget_password({
          url: apiUrl.forget_password,
          data: { mobile: window.wm_aes(this.user.mobile) }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) {
          this.user.temp_access_token = response.aaData.temp_access_token
          window.sessionStorageObj.setItem('forgetPw', this.user)
        }
        this.tipInfo.isOpen = true
        this.isLoading = false
      },
      confirmHandler() {
        if (this.tipInfo.status) {
          location.href = this.pageUrl.forget_password_step2
        } else {
          this.tipInfo.isOpen = false
        }
      }
    },
  })
}