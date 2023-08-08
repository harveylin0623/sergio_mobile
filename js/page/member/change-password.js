export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      user: { old_password: '', new_password: '', confirm_password: '' },
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
        let response = await memberApi.update_member_password({
          url: apiUrl.update_member_password,
          data: {
            old_password: window.wm_aes(this.user.old_password),
            new_password: window.wm_aes(this.user.new_password),
          }
        })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        if (this.tipInfo.status) {
          this.user = { old_password: '', new_password: '', confirm_password: '' }
          this.$refs.form.reset()
        }
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    },
    async mounted() {
      await this.checkTokenIsValid({ throwError: true })
    }
  })
}