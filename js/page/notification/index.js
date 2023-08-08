export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      notifyList: [],
      paginationInfo: { currentPage: 1, totalPage: 1 },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      async getPaginationData(count) {
        this.isLoading = true
        let page = count !== undefined ? count : this.paginationInfo.currentPage
        let response = await notifyApi.notification({ url: apiUrl.notification, params: { page } })
        this.notifyList = response.aaData
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
        this.isLoading = false
      },
      async paginationChange({ pageNumber }) {
        await this.getPaginationData(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      async setReadStatus(notifyId) {
        let url = `${apiUrl.notification}/${notifyId}`
        await notifyApi.notification({ url, method: 'put' })
        let obj = this.notifyList.find(item => item.id === notifyId)
        obj.read_status = true
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getPaginationData()
      this.isLoading = false
    }
  })
}