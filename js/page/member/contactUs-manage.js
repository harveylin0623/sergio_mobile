export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, initFlatPickerMixin],
    store: window.myVuexStore,
    data: {
      criteria: { type: '', keyword: '', start_time: '', end_time: '' },
      paginationInfo: { currentPage: 1, nextPage: 1, totalPage: 0 },
      contactList: [],
      isPagloading: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasNextPage() {
        let { currentPage, totalPage } = this.paginationInfo
        return currentPage < totalPage
      },
      buttonText() {
        return this.isPagloading ? '載入中...' : '看更多'
      }
    },
    methods: {
      setPaginationInfo(payload) {
        this.paginationInfo.currentPage = payload.current_page
        this.paginationInfo.nextPage = payload.current_page + 1
        this.paginationInfo.totalPage = payload.total_pages
      },
      createContactUsList(lists) {
        return lists.reduce((prev, current) => {
          let linkUrl = `${this.pageUrl.contactUsDetail}?contactId=${current.id}`
          prev.push({ ...current, linkUrl })
          return prev
        }, [])
      },
      async getPaginationData(isConcat, pageNumber) {
        let page = pageNumber !== undefined ? pageNumber : this.paginationInfo.nextPage
        let endDate = this.flatPicker.selectedDates[0]
        let startDate = dayjs(endDate).subtract(this.minMinusDay, 'day').toDate()
        let response = await customerServiceApi.contact_us({
          url: apiUrl.contact_us,
          method: 'get',
          params: {
            keyword: this.criteria.keyword,
            start_time: this.formatDate(startDate),
            end_time: this.formatDate(endDate),
            page
          }
        })
        let lists = this.createContactUsList(response.aaData)
        if (isConcat) this.contactList = this.contactList.concat(lists)
        else this.contactList = lists
        this.setPaginationInfo(response)
      },
      async searchHandler() {
        this.isLoading = true
        await this.getPaginationData(false, 1)
        this.isLoading = false
      },
      async seeMore() {
        if (this.isPagloading) return
        this.isPagloading = true
        await this.getPaginationData(true)
        this.isPagloading = false
      }
    },
    async mounted() {
      this.isLoading = true
      this.initFlatPicker()
      await this.checkTokenIsValid({ throwError: true })
      await this.getPaginationData(false, 1)
      this.isLoading = false
    }
  })
}
