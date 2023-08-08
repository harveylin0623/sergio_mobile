export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      faqList: [],
      isLoading: false,
      logoutGoHome: false,
      apiUrl,
      pageUrl
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: false })
      let response = await faqApi.faq({ url: apiUrl.faq })
      this.faqList = response.aaData
      this.isLoading = false
    }
  })
}