export default function({ apiUrl, pageUrl }) {
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
        let { min_amount } = this.condition
        let isMultiple = (this.pickedTotal % min_amount) === 0
        return this.pickedTotal > 0 && this.pickedTotal >= min_amount && isMultiple
      },
      discountPrice() {
        if (!this.isAchieved) return 0
        let { promo_type, min_amount, promo_amount } = this.condition
        if (promo_type === 1) {
          return promo_amount
        } else if (promo_type === 2) {
          let unit = Math.floor(this.pickedTotal / min_amount)
          return this.pickedAmount - (unit * promo_amount )
        } else if (promo_type === 3) {
          return Math.round(this.pickedAmount * promo_amount)
        } else {
          return 0
        }
      },
      remindedText() {
        return `(請選擇${this.condition.min_amount}的倍數，可享有折扣)`
      },
      displayRemind() { //是否顯示條件未達的提示
        return !this.isAchieved && this.pickedTotal > 0
      }
    },
    methods: {
      async getActivtyProduct() {
        let response = await activityApi.full_amount_count_meta({
          url: apiUrl.full_amount_count_meta,
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
          activityApi.full_amount_count({ url: `${apiUrl.full_amount_count}/${this.promoteId}` }),
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