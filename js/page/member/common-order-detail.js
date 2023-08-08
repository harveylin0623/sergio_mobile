export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, cartParamsMixin],
    store: window.myVuexStore,
    data: {
      orderDetail: {},
      productList: [],
      addOnList: [],
      couponList: [],
      contactTip: { status: 0, message: '' },
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasOrderDetail() {
        return !_.isEmpty(this.orderDetail)
      },
      orderCreateTime() {
        if (!this.hasOrderDetail) return ''
        else return this.orderDetail.create_time.split(' ')[0]
      },
      hasCoupon() {
        return this.couponList.length > 0
      },
      hasAddOnList() {
        return this.addOnList.length > 0
      },
      orderRefundPageLink() {
        if (!this.hasOrderDetail) return ''
        else return `${this.pageUrl.orderRefund}?orderNumber=${this.orderDetail.order_num}`
      },
      orderPayRefundPageLink() {
        if (!this.hasOrderDetail) return ''
        else return `${this.pageUrl.orderPayRefund}?orderNumber=${this.orderDetail.order_num}`
      },
      isPayRefund() {
        if (!this.hasOrderDetail) return false
        else return (this.orderDetail.status === 9 && this.orderDetail.pay_status === 1) ? true : false
      },
      showRefundData() {
        if (!this.hasOrderDetail) return false
        else return !_.isEmpty(this.orderDetail.refunds)
      },
      showRefundNumber() { //是否顯示退貨編號
        if (!this.hasOrderDetail) return false
        if (this.orderDetail.refunds === null) return false
        return this.orderDetail.refunds.rtn_order_no !== ''
      },
      paymentText() { //付款方式
        if (!this.hasOrderDetail) return ''
        let { info, pay_service_payment_info } = this.orderDetail
        if (info.pay_type === 'CVS' && pay_service_payment_info !== null) {
          let { expire_date, payment_no } = pay_service_payment_info
          return `${info.title} / 代碼:${payment_no} / 到期時間:${expire_date}`
        } else if (info.pay_type === 'ATM' && pay_service_payment_info !== null) {
          let { expire_date, bank_code, account } = pay_service_payment_info
          return `${info.title} / 銀行代碼:${bank_code} / 銀行帳號:${account} / 到期時間:${expire_date}`
        } else {
          return info.title
        }
      },
      invoiceValue() {
        if (!this.hasOrderDetail) return ''
        let invoice_title = this.orderDetail.info.invoice_title
        let invoice_type = this.orderDetail.info.invoice_type.toString()
        let targetInvoice = this.invoiceList.find(item => item.id === invoice_type)
        if (targetInvoice === undefined) return ''
        let invoice_value = this.orderDetail.info[targetInvoice.apiName]
        if (invoice_type === '4') {
          let targetInstitution = this.loveInstitution.find(item => item.id === invoice_value)
          return `${invoice_title} / ${targetInstitution.title}(${invoice_value})`
        } else if (invoice_type === '5') {
          let { invoice_company, invoice_addr } = this.orderDetail.info
          let text1 = `${invoice_title}:${invoice_company}`
          let text2 = `公司地址:${invoice_addr}`
          let text3 = `公司統編:${invoice_value}`
          return `${text1} ${text2} ${text3}`
        } else {
          return `${invoice_title}(${invoice_value})`
        }
      },
      showInvoice() {
        if (!this.hasOrderDetail) return false
        return this.orderDetail.invoice !== null
      },
      invoiceInfo() {
        if (!this.hasOrderDetail) return ''
        if (!this.orderDetail.invoice) return ''
        let invoice_number = this.orderDetail.invoice.invoice_number
        let invoice_date = this.orderDetail.invoice.invoice_date
        return `${invoice_number} / ${invoice_date}`

      },
      showOrderer() {
        if (!this.hasOrderDetail) return false
        return this.orderDetail.shipping.logistics_type === 'HOME'
      },
      ordererFullAddress() {
        if (!this.showOrderer) return ''
        let { city, area, address } = this.orderDetail.addressee_1
        return `${city}${area}${address}`
      },
      receiverName() { //收件人姓名依照運送方式來處理
        if (!this.hasOrderDetail) return ''
        let logistics_type = this.orderDetail.shipping.logistics_type
        if (logistics_type === 'HOME') {
          return this.orderDetail.addressee_2.name
        } else if (logistics_type === 'CVS') {
          return this.orderDetail.cvs_info.recipient_name
        } else if (logistics_type === 'STORE') {
          return this.orderDetail.store_info.recipient_name
        }
      },
      receiverPhone() { //收件人電話依照運送方式來處理
        if (!this.hasOrderDetail) return ''
        let logistics_type = this.orderDetail.shipping.logistics_type
        if (logistics_type === 'HOME') {
          return this.orderDetail.addressee_2.phone
        } else if (logistics_type === 'CVS') {
          return this.orderDetail.cvs_info.recipient_phone
        } else if (logistics_type === 'STORE') {
          return this.orderDetail.store_info.recipient_phone
        }
      },
      receiverFullAddress() { //收件人地址依照運送方式來處理
        if (!this.hasOrderDetail) return ''
        let logistics_type = this.orderDetail.shipping.logistics_type
        if (logistics_type === 'HOME') {
          let { city, area, address } = this.orderDetail.addressee_2
          return `${city}${area}${address}`
        } else if (logistics_type === 'CVS') {
          let { cvs_store_name, cvs_address } = this.orderDetail.cvs_info
          return `${cvs_address}(${cvs_store_name})`
        } else if (logistics_type === 'STORE') {
          let { store_name, store_address } = this.orderDetail.store_info
          return `${store_address}(${store_name})`
        }
      },
      receiverRemark() { //收件人備註依照運送方式來處理
        if (!this.hasOrderDetail) return ''
        let logistics_type = this.orderDetail.shipping.logistics_type
        if (logistics_type === 'HOME') {
          return this.orderDetail.addressee_2.remarks
        } else if (logistics_type === 'CVS') {
          return this.orderDetail.cvs_info.remarks
        } else if (logistics_type === 'STORE') {
          return this.orderDetail.store_info.remarks
        }
      },
    },
    methods: {
      createList(lists) {
        let mappingName = { normal: 'normal-order-row', purchase: 'addon-order-row', limited_time: 'limited-order-row' }
        return lists.reduce((prev, current) => {
          let uid = window.createUid()
          let componentName = mappingName[current.activity_code] || 'activity-order-row';
          prev.push({ ...current, uid, componentName })
          return prev
        }, [])
      },
      async getOrderDetail() {
        let orderNumber = window.getQuery('orderNumber')
        let response = await orderApi.order({ url: `${apiUrl.order_detail}/${orderNumber}`, method: 'get' })
        let { status, order } = response
        if (status === 0) return location.href = this.pageUrl.orderManage
        this.orderDetail = order
        let normalList = this.createList(this.orderDetail.meta)
        let activityList = this.createList(this.orderDetail.activity_bundle_meta)
        let limitedList = this.createList(this.orderDetail.limited_time_meta)
        this.productList = normalList.concat(activityList, limitedList)
        this.addOnList = this.createList(this.orderDetail.purchase_meta)
        this.couponList = this.orderDetail.coupons
      },
      async contactHandler(payload) {
        let response = null
        this.isLoading = true
        try {
          response = await customerServiceApi.online_service_create({
            url: apiUrl.online_service_create,
            data: {
              type: 'order',
              product_code: '',
              order_num: this.orderDetail.order_num,
              title: payload.title,
              message: payload.message
            }
          })
        } catch(err) {
          this.$refs.contactModal.closeModal()
          this.isLoading = false
          return
        }
        this.contactResponse(response)
        this.isLoading = false
      },
      contactResponse(response) {
        this.contactTip.status = response.status === 1
        this.contactTip.message = response.message
        this.$refs.contactModal.closeModal(this.contactTip.status)
        $('#tipPopup').modal('show')
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
