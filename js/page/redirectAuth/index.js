export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    data: {
      isVerify: true,
      apiUrl,
      pageUrl
    },
    methods: {
      redirectHandler(goHome) {
        let homeUrl = this.pageUrl.home
        let redirectUrl = window.getQuery('redirect')
        if (redirectUrl === null || redirectUrl === '') {
            redirectUrl = homeUrl
        } else {
            redirectUrl = decodeURIComponent(window.atob(redirectUrl));
        }
        setTimeout(() => {
          //location.href = goHome ? homeUrl : redirectUrl
          location.href = redirectUrl
        }, 2000)
      },
      async doVerify() {
        let token = window.getQuery('member_access_token')
        let hasToken = token !== null
        if (!hasToken) return this.redirectHandler(true)
        let response = await authApi.externalLogin({ url: apiUrl.external_login, data: { token } })
        if (response.status === 1) {
          let { aaData, memberProfile, member_status } = response
          window.storageObj.setItem(this.authKey, {
            ...memberProfile,
            token: aaData.access_token,
            member_status
          })
          this.redirectHandler(false)
        } else {
          //this.isVerify = false
          this.redirectHandler(true)
        }
      }
    },
    mounted() {
      this.doVerify()
    }
  })
}
