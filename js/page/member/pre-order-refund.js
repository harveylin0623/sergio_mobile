export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin],
    store: window.myVuexStore,
    data: {
      isOpen: false,
      orderDetail: {},
      productList: [],
      isAgree: false,
      applicant: { name: '', phone: '', account_name: '', bank: '', bank_branch: '', account: '', description: '', order_num: '' },
      tipInfo: { status: false, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasOrderDetail() {
        return !_.isEmpty(this.orderDetail)
      },
      trackingNum() {
        if (!this.hasOrderDetail) return ''
        let text = ''
        if (this.orderDetail.order_type === 'deposit') {
          if (this.orderDetail.has_final_payment) {
            text = this.orderDetail.final_payment.shipping.tracking_num
          } else {
            text = ''
          }
        } else {
          text = this.orderDetail.shipping.tracking_num
        }
        return text
      }
      // orderDetailPageLink() {
      //   if (!this.hasOrderDetail) return ''
      //   else return `${this.pageUrl.orderManageDetail}?orderNumber=${this.applicant.order_num}`
      // }
    },
    methods: {
      getMemberName() {
        let storage = window.storageObj.getItem('knn-userInfo')
        return storage !== null ? storage.name : ''
      },
      createList(lists, componentName) {
        return lists.reduce((prev, current) => {
          prev.push({ ...current, uid: window.createUid(), componentName })
          return prev
        }, [])
      },
      async getOrderDetail() {
        let orderNumber = window.getQuery('orderNumber')
        let response = await orderApi.order({ url: `${apiUrl.order_detail}/${orderNumber}`, method: 'get' })

        if (response.status !== 1) return location.href = this.pageUrl.orderManage
        let { order } = response
        let normalList = this.createList(order.meta, 'normal-order-row')
        let addOnList = []
        if (!_.isEmpty(order.final_payment)) {
          addOnList = this.createList(order.final_payment.addon_meta)
        }
        this.productList = normalList.concat(addOnList)
        this.applicant.order_num = orderNumber
        this.applicant.name = this.getMemberName()
        this.orderDetail = response.order
      },
      async submitHandler() {
        if (!this.isAgree) return
        let isValid = await this.$refs.form.validate()
        if (!isValid) return
        this.isLoading = true
        let response = await orderApi.order_refunds({ url: apiUrl.order_refunds, data: this.applicant })
        this.tipInfo.status = response.status === 1
        this.tipInfo.message = response.message
        $('#tipPopup').modal('show')
        this.isLoading = false
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getOrderDetail()
      this.isLoading = false
    }
  })
}
