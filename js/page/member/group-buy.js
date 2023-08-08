export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, initFlatPickerMixin, orderPayMixin],
    store: window.myVuexStore,
    data: {
      orderList: [],
      criteria: { orderStatus: -1, payStatus: -1, orderNumber: '' },
      paginationInfo: { currentPage: 1, nextPage: 1, totalPage: 0 },
      tipInfo: { status: false, message: '' },
      tempOrderInfo: { orderNumber: '', isPaid: false },
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
      createOrderList(lists) {
        return lists.reduce((prev, current) => {
          let { order_num } = current
          let linkUrl = `${this.pageUrl.orderManageDetail}?orderNumber=${order_num}`
          let refundUrl = `${this.pageUrl.orderRefund}?orderNumber=${order_num}`
          prev.push({ ...current, linkUrl, refundUrl })
          return prev
        }, [])
      },
      async getPaginationData(isConcat, pageNumber) {
        let page = pageNumber !== undefined ? pageNumber : this.paginationInfo.nextPage
        let endDate = this.flatPicker.selectedDates[0]
        let startDate = dayjs(endDate).subtract(this.minMinusDay, 'day').toDate()
        let response = await orderApi.order({
          url: apiUrl.order_list,
          method: 'get',
          params: {
            order_status: this.criteria.orderStatus,
            pay_status: this.criteria.payStatus,
            start_time: this.formatDate(startDate),
            end_time: this.formatDate(endDate),
            order_num: this.criteria.orderNumber,
            page
          }
        })
        let lists = this.createOrderList(response.aaData)
        if (isConcat) this.orderList = this.orderList.concat(lists)
        else this.orderList = lists
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
      },
      async openDigitalMap({ payUrl }) {
        this.isLoading = true
        let response = await customAxios({ url: payUrl, method: 'get' }).then(res => res.data)
        window.openThirdPartyPaymentWindow(response.form)
        this.isLoading = false
      },
      returnOrder({ orderNumber }) {
        location.href = `${this.pageUrl.orderRefund}?orderNumber=${orderNumber}`
      },
      openCancelPopup({ orderNumber, isPaid }) {
        this.tempOrderInfo.orderNumber = orderNumber
        this.tempOrderInfo.isPaid = isPaid
        $('#cancelPopup').modal('show')
      },
      async cancelOrder() {
        $('#cancelPopup').modal('hide')
        this.isLoading = true
        let { orderNumber } = this.tempOrderInfo
        let response = await orderApi.order_cancel({ url: apiUrl.order_cancel, data: { order_num: orderNumber }})
        this.tipInfo.status = response.status
        this.tipInfo.message = response.message
        if (this.tipInfo.status) {
          this.updateSingleOrderData({ orderNumber, params: response.orderInfo })
        } else {
          $('#tipPopup').modal('show')
        }
        this.isLoading = false
      },
      updateSingleOrderData({ orderNumber, params }) { //更新單筆訂單狀態
        let targetOrder = this.orderList.find(order => order.order_num === orderNumber)
        if (targetOrder === undefined) return
        for (let key in params) {
          targetOrder[key] = params[key]
        }
      },
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
