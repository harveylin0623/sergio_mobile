export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      pageInfo: { title: '', detail: '' },
      isLoading: false,
      logoutGoHome: false,
      apiUrl,
      pageUrl
    },
    methods: {
      async getPageData() {
        let pageCode = window.getQuery('page_code')
        let response = await scenesApi.footerInfo({ url: `${apiUrl.footerInfo}/${pageCode}` })
        if (response.status === 0) return location.href = pageUrl.home
        this.pageInfo.title = document.title = response.aaData.title
        this.pageInfo.detail = response.aaData.detail
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: false })
      await this.getPageData()
      this.isLoading = false
    }
  })
}