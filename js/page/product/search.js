export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, processProductMixin],
    store: window.myVuexStore,
    data: {
      productList: [],
      filterCriteria: { keyword: '' },
      paginationInfo: { currentPage: 1, totalPage: 1, totalItem: 0 },
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      paginationText() {
        let { currentPage, totalPage } = this.paginationInfo
        return `${currentPage} / ${totalPage}`
      },
    },
    methods: {
      pushState({ keyword = '', pageNumber = 1 }) {
        let url = `${this.pageUrl.searchProduct}?productKeyword=${keyword}&page=${pageNumber}`
        history.pushState({}, null, url)
      },
      async searchKeyword(keyword) {
        this.isLoading = true
        this.filterCriteria.keyword = keyword
        this.pushState({ keyword, pageNumber: 1 })
        await this.getPaginationData(1)
        window.scrollTo({ top: 0, left: 0 })
        this.$store.commit('toggleKeyword', false)
        this.isLoading = false
      },
      async getPaginationData(count) {
        this.isLoading = true
        let page = count !== undefined ? count : this.paginationInfo.currentPage
        let response = await productApi.product({
          url: apiUrl.product,
          params: { keyword: this.filterCriteria.keyword, page }
        })
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
        this.paginationInfo.totalItem = response.total
        this.productList = this.processProduct(response.aaData)
        this.isLoading = false
      },
      async paginationChange({ pageNumber }) {
        this.isLoading = true
        this.pushState({ keyword: this.filterCriteria.keyword, pageNumber })
        await this.getPaginationData(pageNumber)
        window.scrollTo({ top: 0, left: 0 })
        this.isLoading = false
      },
      async popstateEvent() {
        this.isLoading = true
        let pageNumber = parseInt(window.getQuery('page')) || 1
        this.filterCriteria.keyword = window.getQuery('productKeyword') || ''
        await this.getPaginationData(pageNumber)
        window.scrollTo({ top: 0, left: 0 })
        this.$store.commit('toggleCategory', false)
        this.isLoading = false
      },
      async init() {
        let pageNumber = parseInt(window.getQuery('page')) || 1
        window.addEventListener('popstate', this.popstateEvent)
        this.filterCriteria.keyword = window.getQuery('productKeyword') || ''
        if (history.scrollRestoration) history.scrollRestoration = 'manual';
        await this.checkTokenIsValid({ throwError: false })
        await this.getPaginationData(pageNumber)
      }
    },
    async mounted() {
      this.isLoading = true
      await this.init()
      this.isLoading = false
    }
  })
}