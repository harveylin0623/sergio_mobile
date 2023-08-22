export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [encodePhoneTextMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', temp_access_token: '', verify_code: '' },
      tipInfo: { status: false, message: '', isOpen: false },
      actionType: '',
      storageKey: 'forgetPw',
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      checkHasUserData() {
        let storageData = window.sessionStorageObj.getItem(this.storageKey)
        let hasData = storageData !== null
        if (hasData) {
          this.user.mobile = storageData.mobile
          this.user.temp_access_token = storageData.temp_access_token
        } else {
          this.actionType = 'refill'
          this.errorHandler('請重新填寫表單')
        }
        return hasData
      },
      async sendToMobile() {
        this.isLoading = true
        this.actionType = 'sms'
        let response = await authApi.resend_register_verify({
          url: apiUrl.resend_forget_verify,
          data: { temp_access_token: this.user.temp_access_token }
        })
        if (response.status === 1) {
          this.tipInfo.status = true
          this.tipInfo.message = response.message
          this.tipInfo.isOpen = true
        } else {
          window.sessionStorageObj.removeItem(this.storageKey)
          this.errorHandler(response.message)
        }
        this.isLoading = false
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        this.actionType = 'verify'
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
        this.tipInfo.isOpen = true
        this.isLoading = false
      },
      confirmHandler() {
        const { forget_password_step1, forget_password_step3 } = this.pageUrl
        switch (this.actionType) {
          case 'refill':
            location.href = forget_password_step1
            break
          case 'sms':
            if (!this.tipInfo.status) location.href = forget_password_step1
            break
          case 'verify':
            if (this.tipInfo.status) location.href = forget_password_step3
            break
        }
      }
    },
    mounted() {
      this.checkHasUserData()
    }
  })
}