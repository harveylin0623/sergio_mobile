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
      orderCreateTime() {
        if (!this.hasOrderDetail) return
        else return this.orderDetail.create_time.split(' ')[0]
      },
      orderDetailPageLink() {
        if (!this.hasOrderDetail) return ''
        else return `${this.pageUrl.orderManageDetail}?orderNumber=${this.applicant.order_num}`
      }
    },
    methods: {
      getMemberData() {
        let storage = window.storageObj.getItem('knn-userInfo')
        this.applicant.name = storage !== null ? storage.name : ''
      },
      createList(lists) {
        let mappingName = { normal: 'normal-order-row', purchase: 'addon-order-row', limited_time: 'limited-order-row' }
        return lists.reduce((prev, current) => {
          prev.push({
            ...current,
            uid: window.createUid(),
            componentName: mappingName[current.activity_code] || 'activity-order-row'
          })
          return prev
        }, [])
      },
      async getOrderDetail() {
        this.applicant.order_num = window.getQuery('orderNumber')
        let response = await orderApi.order({ url: `${apiUrl.order_detail}/${this.applicant.order_num}`, method: 'get' })
        if (response.status !== 1) return location.href = this.pageUrl.memberCenterOrderManage
        let normalList = this.createList(response.order.meta)
        let activityList = this.createList(response.order.activity_bundle_meta)
        let limitedList = this.createList(response.order.limited_time_meta)
        let addOnList = this.createList(response.order.purchase_meta)
        this.productList = normalList.concat(activityList, limitedList, addOnList)
        this.getMemberData()
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
