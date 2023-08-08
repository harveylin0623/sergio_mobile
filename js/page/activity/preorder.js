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
          let linkUrl = `${this.pageUrl.preOrderDetail}?promoteId=${this.promoteId}&activityProductId=${current.id}`
          prev.push({ ...current, linkUrl })
          return prev
        },[])
      },
      async getActivityProduct(count) {
        let page = count !== undefined ? count : this.paginationInfo.currentPage
        let response = await activityApi.preorder_meta({
          url: apiUrl.preorder_meta,
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
        let [preOrder] = await Promise.all([
          activityApi.preorder({ url: `${apiUrl.preorder}/${this.promoteId}` }),
          this.getActivityProduct()
        ])
        let { title, summary, images } = preOrder.aaData
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