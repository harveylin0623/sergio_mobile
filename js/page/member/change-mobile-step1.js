export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      user: { mobile: '', password: '' },
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
        let response = await memberApi.update_member_mobile({
          url: apiUrl.update_member_mobile,
          data: {
            mobile: window.wm_aes(this.user.mobile),
            password: window.wm_aes(this.user.password)
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) this.saveUserData()
        $('#tipPopup').modal('show')
        this.isLoading = false
      },
      saveUserData() {
        window.sessionStorageObj.setItem('change-mobile', { mobile: this.user.mobile })
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      this.isLoading = false
    }
  })
}