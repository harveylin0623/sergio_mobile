export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, encodePhoneTextMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', verify_code: '' },
      smsInfo: { status: false, message: '' },
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      checkHasUserData() {
        let storageData = window.sessionStorageObj.getItem('change-mobile')
        let hasData = storageData !== null
        if (hasData) {
          this.user.mobile = storageData.mobile
        } else {
          $('#refillPopup').modal('show')
        }
        return hasData
      },
      async sendToMobile() {
        this.isLoading = true
        let response = await memberApi.resend_member_verify({ url: apiUrl.resend_member_verify, data: {} })
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
        let response = await memberApi.member_verify({
          url: apiUrl.member_verify,
          data: { verify_code: this.user.verify_code }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) window.sessionStorageObj.removeItem('change-mobile')
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      let checked = this.checkHasUserData()
      if (!checked) return this.isLoading = false
      this.isLoading = false
    }
  })
}