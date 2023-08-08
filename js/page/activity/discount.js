export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    data: {
      breadList: [
        { title: '首頁', pageUrl: pageUrl.home },
        { title: '優惠活動', pageUrl: pageUrl.eventList },
        { title: '急殺活動', pageUrl: '' },
      ],
      promoteId: 0,
      allProducts: [],
      condition: { imgUrl: '', show: false },
      paginationInfo: { currentPage: 1, totalPage: 1, perPage: 10 },
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      totalProducts() {
        return this.allProducts.length
      },
      productLists() {
        let { currentPage, perPage } = this.paginationInfo
        let startIndex = (currentPage - 1) * perPage
        let endIndex = (currentPage - 1) * perPage + perPage
        return this.allProducts.slice(startIndex, endIndex)
      },
    },
    methods: {
      async getActivityData() {
        let [rule, product] = await Promise.all([
          activityApi.groupbuy({ url: `${apiUrl.groupbuy}/${this.promoteId}` }),
          activityApi.groupbuy_meta({ url: `${apiUrl.groupbuy_meta}?activity_id=${this.promoteId}` })
        ])
        this.condition.imgUrl = rule.aaData.images[0] || ''
        this.condition.show = true
        this.allProducts = product.aaData
        this.paginationInfo.totalPage = Math.ceil(this.allProducts.length / this.paginationInfo.perPage)
      },
      paginationChange({ pageNumber }) {
        this.paginationInfo.currentPage = pageNumber
      },
    },
    async mounted() {
      this.isLoading = true
      this.promoteId = window.getQuery('promoteId')
      await this.checkTokenIsValid({ throwError: false })
      await this.getActivityData()
      this.isLoading = false
    }
  })
}