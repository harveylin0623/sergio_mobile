export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, contactMixin],
    store: window.myVuexStore,
    data: {
      activityMenuIsOpen: false,
      activityIntro: { title: '', summary: '' },
      promoteId: 0,
      productLists: [],
      condition: { imgUrl: '', show: false, totalProduct: 0 },
      paginationInfo: { currentPage: 1, totalPage: 1 },
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      toggleActivityMenu() {
        this.activityMenuIsOpen = !this.activityMenuIsOpen
      },
      createProduct(payload) {
        return payload.reduce((prev, current) => {
          let linkUrl = `${this.pageUrl.groupBuyDetail}?promoteId=${this.promoteId}&activityProductId=${current.id}`
          prev.push({ ...current, linkUrl })
          return prev
        },[])
      },
      async getActivityProduct(count) {
        let page = count !== undefined ? count : this.paginationInfo.currentPage
        let response = await activityApi.groupbuy_meta({
          url: apiUrl.groupbuy_meta,
          params: { 
            activity_id: this.promoteId,
            page
          }
        })
        this.productLists = this.createProduct(response.aaData)
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
        this.condition.totalProduct = response.total
      },
      async getActivityData() {
        let [groupBuyInfo] = await Promise.all([
          activityApi.groupbuy({ url: `${apiUrl.groupbuy}/${this.promoteId}` }),
          this.getActivityProduct()
        ])
        let { title, summary, images } = groupBuyInfo.aaData
        this.activityIntro.title = title
        this.activityIntro.summary = summary
        this.condition.imgUrl = images[0] || ''
        this.condition.show = true
      },
      async paginationChange({ pageNumber }) {
        this.isLoading = true
        this.paginationInfo.currentPage = pageNumber
        await this.getActivityProduct()
        window.scrollTo(0, 0)
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