(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cartStep2LogicMixin = factory());
}(this, (function () {
  return {
    data() {
			return {
				cartList: [],
        addOnList: [],
        couponList: [],
        backupCartData: {},
        backupUserData: {},
        paymentType: '',
        deliveryType: '',
        isLoading: false,
        apiIsReady: false,
        isDeposit: false,
        orderer: { name: '', email: '', mobile: '', tel: '', city: '', district: '', address: ''},
        receiver: { name: '', email: '', mobile: '', tel: '', city: '', district: '', address: '', remark: '' },
        marketInfo: { type: '', CVSAddress: '', CVSOutSide: '', CVSStoreID: '', CVSStoreName: '', CVSTelephone: '' },
        invoiceInfo: { id: '', invoice_email: '', invoice_phone_id: '', invoice_love_id: '', invoice_user_id: '', invoice_num: '', companyTitle: '', companyAddress: '' },
        cartErrorInfo: {
          isRemaining: {
            status: true,
            text: '『尚有其他商品因付款方式和物流限制不同，還保留在購物車中未帶入訂單，若有使用票券將可能因條件不符被移除，請再次確認您的商品清單，謝謝。』'
          },
          isCouponRemaining: {
            status: true,
            text: '您所選取的票券，因購買商品內容及使用規則限制而有所異動，請確認訂單內有計入的票券內容，謝謝。'
          }
        }
			}
		},
    computed: {
      paymentName() {
        return this.mappingPaymentType[this.paymentType] || ''
      },
      deliveryName() {
        return this.mappingDeliveryCode[this.deliveryType] || ''
      },
      marketName() {
        if (this.deliveryType !== 'CVS') return ''
        else return this.mappingMarketCode[this.marketInfo.type] || ''
      },
      invoiceName() {
        let obj = this.invoiceList.find(item => item.id === this.invoiceInfo.id)
        if (obj !== undefined) return obj.title
        else return ''
      },
      loveInstitutionName() { //愛心碼機構
        let obj = this.loveInstitution.find(item => item.id === this.invoiceInfo.invoice_love_id)
        if (obj !== undefined) return obj.title
        else return ''
      },
      invoiceValue() { //先區別愛心碼和公司統編
        let obj = this.invoiceList.find(item => item.id === this.invoiceInfo.id)
        if (obj === undefined) return ''
        let apiName = obj.apiName
        let invoiceValue = this.invoiceInfo[apiName]
        if (this.invoiceInfo.id === '4') {
          return `${this.loveInstitutionName}(${invoiceValue})`
        } else if (this.invoiceInfo.id === '5') {
          let text1 = `統一編號: ${invoiceValue}`
          let text2 = `公司抬頭: ${this.invoiceInfo.companyTitle}`
          let text3 = `公司地址: ${this.invoiceInfo.companyAddress}`
          return `${text1} ${text2} ${text3}`
        } else {
          return invoiceValue
        }
      },
      startingPoint() { //寄件人地點
        let { city, district, address } = this.orderer
        return `${city}${district}${address}`
      },
      destination() { //運送目的地
        let deliveryType = this.deliveryType
        let result = ''
        if (deliveryType === 'HOME') {
          let { city, district, address } = this.receiver
          result = `${city}${district}${address}`
        } else if (deliveryType === 'CVS') {
          let { CVSStoreName, CVSAddress } = this.marketInfo
          result = `${CVSStoreName}(${CVSAddress})`
        } else if (deliveryType === '') {
          result = ''
        }
        return result
      },
      olListStyle() { //錯誤訊息是否加上編號
        let arr = []
        for (let key in this.cartErrorInfo) {
          arr.push(this.cartErrorInfo[key].status)
        }
        let count = arr.filter(item => item).length
        return count > 1 ? 'list-style-type: decimal;' : ''
      },
    },
    methods: {
      getUserFilledData() { //取得使用者填寫資訊
        let storage = window.sessionStorageObj.getItem(this.userStorageKey)
        if (storage === null) return this.handleCartDataError('購物車資料有誤')
        this.backupUserData = _.cloneDeep(storage)
        this.isDeposit = storage.isDeposit
        this.paymentType = storage.paymentType
        this.deliveryType = storage.deliveryType
        this.invoiceInfo = storage.invoiceInfo
        if (!this.isDeposit) {
          if (this.deliveryType === 'HOME') {
            this.orderer = storage.orderer
            this.receiver = storage.receiver
          } else if (this.deliveryType === 'CVS') {
            this.marketInfo = storage.marketInfo
            this.receiver = storage.supermarket
          }
        }
      },
      setHomeDeliveryInfo(payload) { //設定宅配相關資訊
        return {
          name: payload.name,
          contact: payload.tel,
          phone: payload.mobile,
          email: payload.email,
          city: payload.city,
          area: payload.district,
          address: payload.address,
          zip_code: payload.code.toString(),
          remark: payload.remark || ''
        }
      },
      async pollingOrderStatus(orderNumber, pageType) { //polling確認訂單狀態(0:處理中,1:完成,2:失敗)
        let { status: apiStatus, form, order_status } = await orderApi.order_status({ url: `${this.apiUrl.order_status}/${orderNumber}` })
        if (apiStatus !== 1) {
          this.orderTip.status = false
          this.orderTip.message = '訂單成立失敗'
          this.handleOrderError()
          return
        }
        let { status:orderStatus, order_num } = order_status
        this.orderTip.status = orderStatus === 1
        this.orderTip.message = orderStatus === 2 ? '訂單成立失敗' : ''
        if (orderStatus === 0) {
          setTimeout(() => {
            this.pollingOrderStatus(orderNumber, pageType)
          }, 3000);
        } else if (orderStatus === 1) {
          window.sessionStorageObj.removeItem(this.cartStorageKey)
          window.sessionStorageObj.removeItem(this.userStorageKey)
          if (form !== '') window.openThirdPartyPaymentWindow(form)
          setTimeout(() => { //用setTimeout是避免window.open還沒執行完就導頁
            location.href = `${this.pageUrl.cart_step3}?orderNumber=${order_num}&type=${pageType}`
          }, 3000)
        } else if (orderStatus === 2) {
          this.handleOrderError()
        }
      },
      async createOrder(pageType) { //建立訂單
        this.isLoading = true
        let orderParams = this.gatherOrderParams()
        let response = await orderApi.order({ url: this.apiUrl.order_create, data: orderParams })
        this.orderTip.status = response.status === 1
        this.orderTip.message = response.message
        if (response.status === 0) {
          this.handleOrderError()
        } else if (response.status === 1) {
          this.pollingOrderStatus(response.order_num, pageType)
        } else if (response.status === 2) {
          this.handleCartDataError(response.message)
        }
      },
      handleCartDataError(message) { //購物車資料錯誤處理
        this.tipInfo.stataus = false
        this.tipInfo.message = message
        $("#tipPopup").modal('show')
      },
      handleOrderError() { //訂單錯誤處理
        $('#orderPopup').modal('show')
        this.isLoading = false
      },
    }
  }
})));