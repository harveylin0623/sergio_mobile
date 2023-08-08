export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    store: window.myVuexStore,
    data: {
      user: { password: '', confirm_password: '', temp_access_token: '' },
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      checkHasUserData() {
        let storageData = window.sessionStorageObj.getItem('forgetPw')
        let hasData = storageData !== null
        if (hasData) {
          this.user.temp_access_token = storageData.temp_access_token
        } else {
          $('#refillPopup').modal('show')
        }
        return hasData
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        document.activeElement.blur()
        let response = await authApi.reset_password({
          url: apiUrl.reset_password,
          data: {
            temp_access_token: this.user.temp_access_token,
            new_password: window.wm_aes(this.user.password),
            confirm_password: window.wm_aes(this.user.confirm_password)
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) window.sessionStorageObj.removeItem('forgetPw')
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    },
    mounted() {
      this.checkHasUserData()
    }
  })
}