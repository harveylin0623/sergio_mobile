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
      isDeposit() { //是否為訂金
        if (!this.hasOrderDetail) return false
        else return this.orderDetail.order_type === 'deposit'
      },
      hasBalance() { //是否有尾款
        if (!this.hasOrderDetail) return false
        return this.isDeposit ? this.orderDetail.has_final_payment : false
      },
      hasAddOnList() {
        return this.addOnList.length > 0
      },
      hasCoupon() {
        return this.couponList.length > 0
      },
      orderRefundPageLink() {
        if (!this.hasOrderDetail) return ''
        else return `${this.pageUrl.orderRefund}?orderNumber=${this.orderDetail.order_num}`
      },
      subtotalText() {
        return this.isDeposit ? '訂金金額' : '小計加總'
      },
      payStatusText() {
        return this.isDeposit ? '訂金付款狀態' : '付款狀態'
      },
      paymentTitleText() {
        return this.isDeposit ? '訂金付款方式' : '付款方式'
      },
      showRefundData() {
        if (!this.hasOrderDetail) return false
        else return !_.isEmpty(this.orderDetail.refunds)
      },
      showRefundNumber() { //是否顯示退貨編號(目前用不到)
        if (!this.hasOrderDetail) return false
        if (this.orderDetail.refunds === undefined) return false
        return this.orderDetail.refunds.rtn_order_no !== ''
      },
      showLogisticsFee() { //是否顯示運費
        return this.isDeposit === false || this.hasBalance
      },
      logisticsFee() { //運費
        if (!this.hasOrderDetail) return 0
        let amount = 0
        if (this.isDeposit) {
          amount = this.hasBalance ? this.orderDetail.final_payment.logistics_fee : 0
        } else {
          amount = this.orderDetail.logistics_fee
        }
        return amount
      },
      promoFee() { //票券折抵金額
        if (!this.hasOrderDetail) return 0
        if (this.isDeposit) return 0
        else return this.orderDetail.promo_fee
      },
      totalAmount() { //結帳總金額
        if (!this.hasOrderDetail) return 0
        let { total, final_payment } = this.orderDetail
        let finalTotal = this.hasBalance ? final_payment.total : 0
        return total + finalTotal + this.logisticsFee - this.promoFee
      },
      showDelivery() { //是否顯示配送方式
        return this.isDeposit === false || this.hasBalance
      },
      deliveryText() { //配送方式
        if (!this.hasOrderDetail) return ''
        let text = ''
        if (this.isDeposit) {
          text = this.hasBalance ? this.orderDetail.final_payment.shipping.title : ''
        } else {
          text = this.orderDetail.shipping.title
        }
        return text
      },
      showOrderer() { //顯示訂購人資訊
        if (!this.hasOrderDetail) return false
        let isShow = false
        if (this.isDeposit) {
          if (this.hasBalance) {
            isShow = this.orderDetail.final_payment.shipping.logistics_type === 'HOME'
          }
        } else {
          isShow = this.orderDetail.shipping.logistics_type === 'HOME'
        }
        return isShow
      },
      ordererName() { //訂購人姓名
        if (!this.showOrderer) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let logistics_type = this.orderDetail.final_payment.shipping.logistics_type
            text = logistics_type === 'HOME' ? this.orderDetail.final_payment.addressee_1.name : ''
          }
        } else {
          let logistics_type = this.orderDetail.shipping.logistics_type
          text = logistics_type === 'HOME' ? this.orderDetail.addressee_1.name : ''
        }
        return text
      },
      ordererPhone() { //訂購人手機
        if (!this.showOrderer) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let logistics_type = this.orderDetail.final_payment.shipping.logistics_type
            text = logistics_type === 'HOME' ? this.orderDetail.final_payment.addressee_1.phone : ''
          }
        } else {
          let logistics_type = this.orderDetail.shipping.logistics_type
          text = logistics_type === 'HOME' ? this.orderDetail.addressee_1.phone : ''
        }
        return text
      },
      ordererFullAddress() { //訂購人地址
        if (!this.showOrderer) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let { city, area, address } = this.orderDetail.final_payment.addressee_1
            text = `${city}${area}${address}`
          }
        } else {
          let { city, area, address } = this.orderDetail.addressee_1
          text = `${city}${area}${address}`
        }
        return text
      },
      showReceiver() { //顯示收件人資訊
        if (!this.hasOrderDetail) return false
        let isShow = false
        if (this.isDeposit) {
          isShow = this.hasBalance
        } else {
          isShow = true
        }
        return isShow
      },
      receiverName() { //收件人姓名
        if (!this.showReceiver) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let { shipping, addressee_2, cvs_info } = this.orderDetail.final_payment
            let logistics_type = shipping.logistics_type
            text = logistics_type === 'HOME' ? addressee_2.name : logistics_type === 'CVS' ? cvs_info.receipient_name : ''
          }
        } else {
          let { shipping, addressee_2, cvs_info } = this.orderDetail
          let logistics_type = shipping.logistics_type
          text = logistics_type === 'HOME' ? addressee_2.name : logistics_type === 'CVS' ? cvs_info.receipient_name : ''
        }
        return text
      },
      receiverPhone() { //收件人電話
        if (!this.showReceiver) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let logistics_type = this.orderDetail.final_payment.shipping.logistics_type
            if (logistics_type === 'HOME') {
              text = this.orderDetail.final_payment.addressee_2.phone
            } else if (logistics_type === 'CVS') {
              text = this.orderDetail.final_payment.cvs_info.recipient_phone
            }
          }
        } else {
          let { shipping, addressee_2, cvs_info } = this.orderDetail
          let logistics_type = shipping.logistics_type
          text = logistics_type === 'HOME' ? addressee_2.phone : logistics_type === 'CVS' ? cvs_info.recipient_phone : ''
        }
        return text
      },
      receiverFullAddress() { //收件人地址
        if (!this.showReceiver) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let logistics_type = this.orderDetail.final_payment.shipping.logistics_type
            if (logistics_type === 'HOME') {
              let { city, area, address } = this.orderDetail.final_payment.addressee_1
              text = `${city}${area}${address}`
            } else if (logistics_type === 'CVS') {
              let { cvs_store_name, cvs_address } = this.orderDetail.final_payment.cvs_info
              text = `${cvs_address}(${cvs_store_name})`
            }
          }
        } else {
          let logistics_type = this.orderDetail.shipping.logistics_type
          if (logistics_type === 'HOME') {
            let { city, area, address } = this.orderDetail.addressee_2
            text = `${city}${area}${address}`
          } else if (logistics_type === 'CVS') {
            let { cvs_store_name, cvs_address } = this.orderDetail.cvs_info
            text = `${cvs_address}(${cvs_store_name})`
          }
        }
        return text
      },
      receiverRemark() { //收件人備註
        if (!this.showReceiver) return ''
        let text = ''
        if (this.isDeposit) {
          if (this.hasBalance) {
            let { shipping, addressee_2, cvs_info } = this.orderDetail.final_payment
            let logistics_type = shipping.logistics_type
            text = logistics_type === 'HOME' ? addressee_2.remarks : logistics_type === 'CVS' ? cvs_info.remarks : ''
          }
        } else {
          let { shipping, addressee_2, cvs_info } = this.orderDetail
          let logistics_type = shipping.logistics_type
          text = logistics_type === 'HOME' ? addressee_2.remarks : logistics_type === 'CVS' ? cvs_info.remarks : ''
        }
        return text
      },
      normalPaymentText() { //一般付款方式
        if (!this.hasOrderDetail) return ''
        else return this.createPaymentText(this.orderDetail)
      },
      finalPaymentText() { //尾款付款方式
        if (!this.hasOrderDetail) return ''
        if (!this.hasBalance) return ''
        else return this.createPaymentText(this.orderDetail.final_payment)
      },
      normalPayStatus() { //一般付款狀態
        if (!this.hasOrderDetail) return ''
        else return this.orderDetail.pay_status_message
      },
      finalPayStatus() { //尾款付款狀態
        if (!this.hasOrderDetail) return ''
        if (!this.hasBalance) return ''
        else return this.orderDetail.final_payment.pay_status_message
      },
      showNormalPayLink() { //顯示一般付款連結
        if (!this.hasOrderDetail) return false
        let { pay_status, pay_url, status, info } = this.orderDetail
        let pay_type = info.pay_type
        return pay_status === 0 && pay_url !== '' && status !== 9 && pay_type !== 'CVSPickupPay'
      },
      showFinalPayLink() { //顯示尾款付款連結
        if (!this.hasOrderDetail) return false
        if (!this.hasBalance) return false
        let { pay_status, pay_url, status, info } = this.orderDetail.final_payment
        let pay_type = info.pay_type
        return pay_status === 0 && pay_url !== '' && status !== 9 && pay_type !== 'CVSPickupPay'
      },
      invoiceTitleText() {
        return this.isDeposit ? '訂金發票資訊' : '發票資訊'
      },
      normalInvoiceValue() { //一般發票資訊
        if (!this.hasOrderDetail) return ''
        else return this.createInvoiceValue(this.orderDetail)
      },
      finalInvoiceValue() { //尾款發票資訊
        if (!this.hasOrderDetail) return ''
        if (!this.hasBalance) return ''
        else return this.createInvoiceValue(this.orderDetail.final_payment)
      },
      // showInvoice() {
      //   if (!this.hasOrderDetail) return false
      //   return this.orderDetail.invoice !== null
      // },
      // invoiceInfo() {
      //   return ''
      //   if (!this.hasOrderDetail) return ''
      //   if (!this.orderDetail.invoice) return ''
      //   let invoice_number = this.orderDetail.invoice.invoice_number
      //   let invoice_date = this.orderDetail.invoice.invoice_date
      //   return `${invoice_number} / ${invoice_date}`
      // }
    },
    methods: {
      createList(lists) {
        return lists.reduce((prev, current) => {
          let uid = window.createUid()
          prev.push({ ...current, uid })
          return prev
        }, [])
      },
      async getOrderDetail() {
        let orderNumber = window.getQuery('orderNumber')
        let response = await orderApi.order({ url: `${apiUrl.order_detail}/${orderNumber}`, method: 'get' })
        let { status, order } = response
        if (status === 0) return location.href = this.pageUrl.orderManage
        this.orderDetail = order
        this.productList = this.createList(this.orderDetail.meta)
        if (!_.isEmpty(this.orderDetail.final_payment)) {
          this.addOnList = this.createList(this.orderDetail.final_payment.addon_meta)
        }
        this.couponList = this.orderDetail.coupons || []
      },
      createPaymentText(obj) { //產生付款資訊
        let { info, pay_service_payment_info } = obj
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
      createInvoiceValue(obj) { //產生發票資訊
        let invoice_title = obj.info.invoice_title
        let invoice_type = obj.info.invoice_type.toString()
        let targetInvoice = this.invoiceList.find(item => item.id === invoice_type)
        let resultText = ''
        if (targetInvoice === undefined) return resultText
        let invoice_value = obj.info[targetInvoice.apiName]
        if (invoice_type === '4') {
          let targetInstitution = this.loveInstitution.find(item => item.id === invoice_value)
          resultText = `${invoice_title} / ${targetInstitution.title}(${invoice_value})`
        } else if (invoice_type === '5') {
          let { invoice_company, invoice_addr } = obj.info
          let text1 = `${invoice_title}:${invoice_company}`
          let text2 = `公司地址:${invoice_addr}`
          let text3 = `公司統編:${invoice_value}`
          resultText = `${text1} ${text2} ${text3}`
        } else {
          resultText = `${invoice_title}(${invoice_value})`
        }
        return resultText
      },
      async openDigitalMap(num) {
        this.isLoading = true
        let url = num === 0 ? this.orderDetail.pay_url : this.orderDetail.final_payment.pay_url
        let response = await customAxios({ url, method: 'get' }).then(res => res.data)
        window.openThirdPartyPaymentWindow(response.form)
        this.isLoading = false
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