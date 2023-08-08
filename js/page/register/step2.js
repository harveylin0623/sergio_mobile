export default function({ apiUrl, pageUrl }) {
  let widgetId = null
  new Vue({
    el: '#app',
    mixins: [encodePhoneTextMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', temp_access_token: '', verify_code: '', recaptcha_token: '' },
      smsInfo: { status: false, message: '' },
      tipInfo: { statue: false , message: ''},
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      checkHasUserData() {
        let storageData = window.sessionStorageObj.getItem('register')
        let hasData = storageData !== null
        if (hasData) {
          this.user.mobile = storageData.payload.user.mobile
          this.user.temp_access_token = storageData.temp_access_token
        } else {
          $('#refillPopup').modal('show')
        }
        return hasData
      },
      initRecaptcha() {
        grecaptcha.ready(() => {
          widgetId = grecaptcha.render('recaptcha-container', {
            sitekey: '6LfqA68UAAAAAHivfnF1r5rAYcZn2hAnnjGtd2US',
            callback: (token) => {
              this.user.recaptcha_token = token
            }
          })
        })
      },
      checkRecaptchaToken() {
        return authApi.recaptcha({
          url: apiUrl.verify_google_recaptcha,
          data: { token: this.user.recaptcha_token }
        })
      },
      async sendToMobile() {
        this.isLoading = true
        let response = await authApi.resend_register_verify({
          url: apiUrl.resend_register_verify,
          data: { temp_access_token: this.user.temp_access_token }
        })
        this.smsInfo.status = response.status === 1
        this.smsInfo.message = response.message
        if (!this.smsInfo.status) window.sessionStorageObj.removeItem('register')
        $('#smsPopup').modal('show')
        this.isLoading = false
      },
      registerVerify() {
        return authApi.register_verify({
          url: apiUrl.register_verify,
          data: {
            temp_access_token: this.user.temp_access_token,
            verify_code: this.user.verify_code
          }
        })
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        // let { success } = await this.checkRecaptchaToken()
        // if (!success) return this.errorHandler('recaptcha驗證有誤,請重新驗證')
        document.activeElement.blur()
        let response = await this.registerVerify()
        let callback = response.status === 1 ? this.successHandler : this.errorHandler
        callback(response.message)
      },
      successHandler(message) {
        this.tipInfo.status = true
        this.tipInfo.message = message
        window.sessionStorageObj.removeItem('register')
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
      errorHandler(message) {
        // grecaptcha.reset(widgetId)
        this.tipInfo.status = false
        this.tipInfo.message = message
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    },
    mounted() {
      this.checkHasUserData()
    }
  })
}