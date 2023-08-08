export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, fullLabelActivityMixin],
    store: window.myVuexStore,
    data: {
      condition: { activityId: -1,  code: '', imgUrl: '', red_amount: 1, green_amount: 1, productType: 0 },
      apiUrl,
      pageUrl
    },
    computed: {
      redProductCount() {
        return this.calculateTypeCount(1)
      },
      greenProductCount() {
        return this.calculateTypeCount(2)
      },
      isAchieved() { //數量和條件相除餘數是0,數量和條件相除倍數必須相等
        if (this.redProductCount === 0 || this.greenProductCount === 0) return false
        let { red_amount, green_amount } = this.condition
        let is_red_remainder_zero = this.redProductCount % red_amount === 0
        let is_green_remainder_zero = this.greenProductCount % green_amount === 0
        if (!(is_red_remainder_zero && is_green_remainder_zero)) return false
        let red_multiple = Math.floor(this.redProductCount / red_amount)
        let green_multiple = Math.floor(this.greenProductCount / green_amount)
        return red_multiple === green_multiple
      },
    },
    methods: {
      setCondition(payload) {
        this.condition.activityId = payload.id
        this.condition.code = payload.code
        this.condition.imgUrl = payload.images[0] || ''
        this.condition.red_amount = payload.red_amount
        this.condition.green_amount = payload.green_amount
        this.activityIntro.title = payload.title
        this.activityIntro.summary = payload.summary
      },
      calculateTypeCount(id) {
        return this.pickList.reduce((prev, current) => {
          if (current.promo_type === id) return prev += current.buyCount
          return prev
        }, 0)
      },
      async getActivtyProduct(count) {
        let page = count !== undefined ? count : this.paginationInfo.currentPage
        let response = await activityApi.red_with_green_meta({
          url: apiUrl.red_with_green_meta,
          params: { 
            promotions_ids: this.promoteId, 
            promo_type: this.condition.productType,
            page
          }
        })
        this.productLists = this.checkProductHasStock(response.aaData)
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
      },
      async getActivityData() {
        let [rule] = await Promise.all([
          activityApi.red_with_green({ url: `${apiUrl.red_with_green}/${this.promoteId}` }),
          this.getActivtyProduct()
        ])
        this.setCondition(rule.aaData)
      },
      async changeLabelType() {
        this.isLoading = true
        await this.getActivtyProduct(1)
        this.isLoading = false
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