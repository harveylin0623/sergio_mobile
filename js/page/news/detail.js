export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, createNewsPopulartMixin],
    store: window.myVuexStore,
    data: {
      newsInfo: { title: '', images: '', start_time: '', detail: '', pre_id: null, next_id: null },
      keyword: '',
      newsPopular: [],
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasPopularNews() {
        return this.newsPopular.length > 0
      },
      dateText() {
        if (this.newsInfo.start_time === '') return ''
        let dateObj = new Date(this.newsInfo.start_time)
        let year = dateObj.getFullYear()
        let month = dateObj.getMonth() + 1
        let date = dateObj.getDate()
        return `${year}年${month}月${date}日`
      },
      noPrevNews() {
        return this.newsInfo.pre_id === null
      },
      noNextNews() {
        return this.newsInfo.next_id === null
      },
      hideAllButton() {
        return this.noPrevNews && this.noNextNews
      }
    },
    methods: {
      setNewsInfo(payload) {
        for (let key in this.newsInfo) {
          if (key === 'images') {
            this.newsInfo[key] = payload[key][0] || ''
            continue
          }
          this.newsInfo[key] = payload[key]
        }
      },
      dirHandler(num) {
        let disabled = num === 1 ? this.noNextNews : this.noPrevNews
        if (disabled) return
        let { pre_id, next_id } = this.newsInfo
        let newsId = num === 1 ? next_id : pre_id
        location.href = `${this.pageUrl.newsDetail}?newsId=${newsId}`
      },
      searchHandler() {
        location.href = `${this.pageUrl.news}?keyword=${this.keyword}`
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: false })
      let newsId = parseInt(window.getQuery('newsId'))
      let [newsDetail, newsPopular] = await Promise.all([
        newsApi.news_detail({ url: `${apiUrl.news_detail}/${newsId}` }),
        newsApi.news_popular({ url: apiUrl.news_popular })
      ])
      if (newsDetail.aaData.length === 0) return location.href = this.pageUrl.home
      this.setNewsInfo(newsDetail.aaData[0])
      this.newsPopular = this.createNewsPopular(newsPopular.aaData)
      this.isLoading = false
    }
  })
}