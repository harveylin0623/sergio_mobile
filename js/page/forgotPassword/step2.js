export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [encodePhoneTextMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', temp_access_token: '', verify_code: '' },
      smsInfo: { status: false, message: '' },
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
          this.user.mobile = storageData.mobile
          this.user.temp_access_token = storageData.temp_access_token
        } else {
          $('#refillPopup').modal('show')
        }
        return hasData
      },
      async sendToMobile() {
        this.isLoading = true
        let response = await authApi.resend_forget_verify({
          url: apiUrl.resend_forget_verify,
          data: { temp_access_token: this.user.temp_access_token }
        })
        this.smsInfo.status = response.status === 1
        this.smsInfo.message = response.message
        if (this.smsInfo.status) $('#smsPopup').modal('show')
        this.isLoading = false
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        document.activeElement.blur()
        let response = await authApi.forget_password_verify({
          url: apiUrl.forget_password_verify,
          data: {
            temp_access_token: this.user.temp_access_token,
            verify_code: this.user.verify_code
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    },
    mounted() {
      this.checkHasUserData()
    }
  })
}