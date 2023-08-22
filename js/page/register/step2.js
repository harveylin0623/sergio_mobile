export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [encodePhoneTextMixin, signUpStepMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', temp_access_token: '', verify_code: '' },
      tipInfo: { statue: false , message: '', isOpen: false },
      actionType: '',
      storageKey: 'register',
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      checkHasUserData() {
        let storageData = window.sessionStorageObj.getItem(this.storageKey)
        let hasData = storageData !== null
        if (hasData) {
          this.user.mobile = storageData.payload.user.mobile
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
          url: apiUrl.resend_register_verify,
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
        let response = await authApi.register_verify({
          url: apiUrl.register_verify,
          data: {
            temp_access_token: this.user.temp_access_token,
            verify_code: this.user.verify_code
          }
        })
        let callback = response.status === 1 ? this.successHandler : this.errorHandler
        callback(response.message)
      },
      successHandler(message) {
        this.tipInfo.status = true
        this.tipInfo.message = message
        this.tipInfo.isOpen = true
        window.sessionStorageObj.removeItem(this.storageKey)
        this.isLoading = false
      },
      errorHandler(message) {
        this.tipInfo.status = false
        this.tipInfo.message = message
        this.tipInfo.isOpen = true
        this.isLoading = false
      },
      closeTipModal() {
        this.tipInfo.isOpen = false
      },
      confirmHandler() {
        const { register_step1, login } = this.pageUrl
        switch (this.actionType) {
          case 'refill':
            location.href = register_step1
            break
          case 'sms':
            if (this.tipInfo.status) this.closeTipModal()
            else location.href = register_step1
            break
          case 'verify':
            if (this.tipInfo.status) location.href = login
            else this.closeTipModal()
            break
        }
      }
    },
    mounted() {
      this.stepList[0].done = true
      this.checkHasUserData()
    }
  })
}