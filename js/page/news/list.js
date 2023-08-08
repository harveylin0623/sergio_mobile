export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, createNewsPopulartMixin],
    store: window.myVuexStore,
    data: {
      criteria: { input: '', totalNews: 0 },
      paginationInfo: { currentPage: 1, nextPage: 1, totalPage: 0 },
      newsItems: [],
      newsPopular: [],
      logoutGoHome: false,
      isLoading: false,
      isPagLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasPopularNews() {
        return this.newsPopular.length > 0
      },
      hasNextPage() {
        let { currentPage, totalPage } = this.paginationInfo
        return currentPage < totalPage
      },
      buttonText() {
        return this.isPagLoading ? '載入中...' : '看更多'
      }
    },
    methods: {
      createNewsItem(payload) {
        return payload.reduce((prev, current) => {
          let { id, title, images, start_time } = current
          let imgUrl = images[0] ? images[0] : ''
          let linkUrl = `${this.pageUrl.newsDetail}?newsId=${id}`
          prev.push({ id, title, imgUrl, start_time, linkUrl })
          return prev
        }, [])
      },
      setPaginaitonInfo(payload) {
        this.paginationInfo.currentPage = payload.current_page
        this.paginationInfo.nextPage = payload.current_page + 1
        this.paginationInfo.totalPage = payload.total_pages
      },
      async getPaginationData(isConcat, pageNumber) {
        let page = pageNumber !== undefined ? pageNumber : this.paginationInfo.nextPage
        let response = await newsApi.news({
          url: apiUrl.news,
          params: { keyword: this.criteria.input, page }
        })
        let newsData = this.createNewsItem(response.aaData)
        this.setPaginaitonInfo(response)
        this.criteria.totalNews = response.total
        if (isConcat) this.newsItems = this.newsItems.concat(newsData)
        else this.newsItems = newsData
      },
      async seeMore() {
        if (this.isPagLoading) return
        this.isPagLoading = true
        await this.getPaginationData(true)
        this.isPagLoading = false
      },
      async searchHandler() {
        this.isLoading = true
        await this.getPaginationData(false, 1)
        this.isLoading = false
      },
      async init() {
        let [popularInfo] = await Promise.all([
          newsApi.news_popular({ url: apiUrl.news_popular }),
          this.getPaginationData(false, 1),
        ])
        this.newsPopular = this.createNewsPopular(popularInfo.aaData)
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: false })
      await this.init()
      this.isLoading = false
    }
  })
}