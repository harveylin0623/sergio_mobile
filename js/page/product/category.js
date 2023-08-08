export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, processProductMixin],
    store: window.myVuexStore,
    data: {
      subCategoryList: [],
      productList: [],
      subCategoryIsOpen: false,
      filterCriteria: { mainId: -1, subId: -1, lastId: -1, categoryName: '', keyword: '', order_time: '', order_price: '' },
      paginationInfo: { currentPage: 1, totalPage: 1 },
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    methods: {
      resetScroll() {
        window.scrollTo({ top: 0, left: 0 })
      },
      openSubCategory() {
        this.subCategoryIsOpen = true
      },
      setFilterCriteria(payload) {
        for (let key in payload) {
          this.filterCriteria[key] = payload[key]
        }
      },
      getTargetCategoryId() { //取得目前要使用的分類id(由最後一層的分類開始判斷)
        let id = 0
        let keys = ['lastId', 'subId', 'mainId']
        for (let key of keys) {
          if (this.filterCriteria[key] !== -1) {
            id = this.filterCriteria[key]
            break
          }
        }
        return id
      },
      async getPaginationData(count) {
        this.isLoading = true
        let { keyword, order_time, order_price } = this.filterCriteria
        let categories_ids = this.getTargetCategoryId()
        let page = count !== undefined ? count : this.paginationInfo.currentPage
        let response = await productApi.product({
          url: apiUrl.product,
          params: { keyword, categories_ids, page, order_time, order_price }
        })
        this.paginationInfo.currentPage = response.current_page
        this.paginationInfo.totalPage = response.total_pages
        this.productList = this.processProduct(response.aaData)
        this.isLoading = false
      },
      pushState(level) { //依照分類層級增加參數
        let { mainId, subId, lastId, categoryName } = this.filterCriteria
        let url = `${this.pageUrl.productCategory}?mainId=${mainId}&categoryName=${categoryName}`
        if (level === 2) {
          url = `${url}&subId=${subId}`
        } else if (level === 3) {
          url = `${url}&subId=${subId}&lastId=${lastId}`
        }
        history.pushState({}, null, url)
      },
      async getSubCategoryData(count) { //取得次分類資料
        let page = count !== undefined ? count : 1
        let [category] = await Promise.all([
          productApi.product_category({
            url: apiUrl.product_category,
            params: { category_id: this.filterCriteria.mainId }
          }),
          this.getPaginationData(page)
        ])
        this.subCategoryList = category.aaData
      },
      async updateMainCategory(payload) { //更新第一層分類
        let { categoryId, categoryName } = payload
        this.setFilterCriteria({ mainId: categoryId, categoryName, subId: -1, lastId: -1 })
        this.pushState(1)
        await this.getSubCategoryData(1)
        this.$store.commit('toggleCategory', false)
        this.resetScroll()
      },
      async updateSubCategory(payload) { //更新第二層分類
        let { subId, categoryName, hasChildren } = payload
        this.setFilterCriteria({ subId, lastId: -1 })
        if (hasChildren || subId === -1) return
        this.setFilterCriteria({ categoryName })
        this.pushState(2)
        await this.getPaginationData(1)
        this.resetScroll()
        this.subCategoryIsOpen = false
      },
      async updateLastCategory(payload) { //更新第三層分類
        let { lastId, categoryName } = payload
        this.setFilterCriteria({ lastId, categoryName })
        this.pushState(3)
        await this.getPaginationData(1)
        this.resetScroll()
        this.subCategoryIsOpen = false
      },
      async paginationChange({ pageNumber }) {
        let urlObj = new URL(location.href)
        let params = new URLSearchParams(urlObj.search)
        params.delete('page')
        params.append('page', pageNumber);
        urlObj.search = params
        history.pushState({}, null, urlObj.href)
        await this.getPaginationData(pageNumber)
        this.resetScroll()
      },
      async popstateEvent() {
        let searchParams = new URL(location.href).searchParams
        let mainId = parseInt(searchParams.get('mainId')) || -1
        let subId = parseInt(searchParams.get('subId')) || -1
        let lastId = parseInt(searchParams.get('lastId')) || -1
        let categoryName = searchParams.get('categoryName') || ''
        let page = parseInt(searchParams.get('page')) || 1
        this.setFilterCriteria({ mainId, subId, lastId, categoryName })
        await this.getSubCategoryData(page)
        this.resetScroll()
      },
      async filterHandler() {
        await this.getPaginationData(1)
        this.resetScroll()
      },
      async init() {
        if (history.scrollRestoration) history.scrollRestoration = 'manual'
        window.addEventListener('popstate', this.popstateEvent)
        this.setFilterCriteria({
          mainId: parseInt(window.getQuery('mainId')) || 1,
          subId: parseInt(window.getQuery('subId')) || -1,
          lastId: parseInt(window.getQuery('lastId')) || -1,
          categoryName: window.getQuery('categoryName') || ''
        })
        await this.checkTokenIsValid({ throwError: false })
        await this.getSubCategoryData(1)
      }
    },
    async mounted() {
      this.isLoading = true
      await this.init()
      this.isLoading = false
    }
  })
}