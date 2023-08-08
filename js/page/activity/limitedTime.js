export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      promoteId: 0,
      periodList: [],
      productList: [],
      condition: { activityId: 0, periodId: 0, imgUrl: '' },
      paginationInfo: { currentPage: 1, totalPage: 1 },
      isLoading: false,
      apiIsReady: false,
      logoutGoHome: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasPeriodList() {
        return this.periodList.length > 0
      }
    },
    methods: {
      createPeriodList(payload) {
        let arr = []
        for (let key in payload) {
          arr = arr.concat(payload[key])
        }
        return arr
      },
      getValidPeriodId() { //如果沒有active的時間區間就取最後一個區間id
        if (!this.hasPeriodList) return 0
        let obj = this.periodList.find(item => item.valid)
        let total = this.periodList.length
        return obj !== undefined ? obj.id : this.periodList[total - 1].id
      },
      tidyProduct(payload) {
        return payload.reduce((prev, current) => {
          let linkUrl = `${this.pageUrl.limitProductDetail}?promoteId=${this.promoteId}&activityProductId=${current.id}`
          prev.push({ ...current, linkUrl })
          return prev
        }, [])
      },
      async getActivityProduct(count) {
        let page = count !== undefined ? count : this.paginationInfo.current
        let response = await activityApi.limited_time_meta({
          url: apiUrl.limited_time_meta,
          params: {
            activity_id: this.promoteId,
            activity_sub_id: this.condition.periodId,
            page
          }
        })
        this.productList = this.tidyProduct(response.aaData)
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
      },
      async getActivityInfo() {
        let activityInfo = await activityApi.limited_time({ url: `${apiUrl.limited_time}/${this.promoteId}` })
        if (activityInfo.status === 0) return location.href = this.pageUrl.eventList
        this.periodList = this.createPeriodList(activityInfo.aaData.sub)
        this.condition.activityId = activityInfo.aaData.id
        this.condition.periodId = this.getValidPeriodId()
        this.condition.imgUrl = activityInfo.aaData.images[0] || ''
        await this.getActivityProduct(1)
        this.apiIsReady = true
      },
      async changePeriod(id) {
        this.condition.periodId = id
        this.isLoading = true
        await this.getActivityProduct(1)
        this.isLoading = false
      },
      async paginationChange({ pageNumber }) {
        this.paginationInfo.currentPage = pageNumber
        this.isLoading = true
        await this.getActivityProduct()
        this.isLoading = false
      },
    },
    async mounted() {
      this.isLoading = true
      this.promoteId = window.getQuery('promoteId')
      await this.checkTokenIsValid({ throwError: false })
      await this.getActivityInfo()
      this.isLoading = false
    },
  })
}