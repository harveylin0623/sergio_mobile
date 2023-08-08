export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, fullLabelActivityMixin],
    store: window.myVuexStore,
    data: {
      apiUrl,
      pageUrl
    },
    computed: {
      isAchieved() {
        return this.pickedAmount > 0 && this.pickedAmount >= this.condition.min_amount
      },
      discountPrice() {
        if (!this.isAchieved) return 0
        let { promo_type, min_amount, promo_amount } = this.condition
        if (promo_type === 1) {
          return promo_amount
        } else if (promo_type === 2) { //先算出有多少個單位,然後再計算出要折扣多少
          let unit = Math.floor(this.pickedAmount / min_amount)
          return this.pickedAmount - (unit * promo_amount)
        } else if (promo_type === 3) {
          return Math.round(this.pickedAmount * promo_amount)
        } else {
          return 0
        }
      },
    },
    methods: {
      async getActivtyProduct() {
        let response = await activityApi.full_amount_price_meta({
          url: apiUrl.full_amount_price_meta,
          params: { 
            promotions_ids: this.promoteId,
            page: this.paginationInfo.currentPage 
          }
        })
        this.productLists = this.checkProductHasStock(response.aaData)
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
      },
      async getActivityData() {
        let [rule] = await Promise.all([
          activityApi.full_amount_price({url: `${apiUrl.full_amount_price}/${this.promoteId}`}),
          this.getActivtyProduct()
        ])
        this.setCondition(rule.aaData)
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