export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    store: window.myVuexStore,
    data: {
      user: { password: '', confirm_password: '', temp_access_token: '' },
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
          this.user.temp_access_token = storageData.temp_access_token
        } else {
          this.actionType = 'refill'
          this.tipInfo.status = false
          this.tipInfo.message = '請重新填寫表單'
          this.tipInfo.isOpen = true
        }
        return hasData
      },
      async submitHandler() {
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        this.actionType = 'verify'
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
        this.tipInfo.isOpen = true
        if (this.tipInfo.status) window.sessionStorageObj.removeItem(this.storageKey)
        this.isLoading = false
      },
      confirmHandler() {
        const { forget_password_step1, login } = this.pageUrl
        if (this.actionType === 'refill') {
          location.href = forget_password_step1
        } else if (this.actionType === 'verify') {
          if (this.tipInfo.status) {
            location.href = login
          } else {
            this.tipInfo.isOpen = false
          }
        }
      }
    },
    mounted() {
      this.checkHasUserData()
    }
  })
}