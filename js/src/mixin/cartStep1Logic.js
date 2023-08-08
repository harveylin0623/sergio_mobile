(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cartStep1LogicMixin = factory());
}(this, (function () {
  return {
    data() {
			return {
        cartList: [],
        addOnList: [],
        purchaseList: [],
        receipentList: [],
        pickedTicket: [],
				showLimitedDesc: false,
        isDeposit: false,
        isLoading: false,
        canUpdateHeaderCount: false, //是否可更新購物車上的數字
        deliveryType: '',
        limitedText: '',
        paymentInfo: { type: '', list: [] },
        introInfo: { name: '', summary: '', imgUrl: '', specTitle: '', price: 0 },
        otherError: { status: false, message: '' },
			}
		},
    computed: {
      hasCartItem() { //是否有購物商品
        return this.cartList.length > 0
      },
      purchaseItemSubtotal() {
        return this.addOnList.filter(item => item.isChecked).reduce((prev, current) => {
          prev += current.count * current.purchase_price
          return prev
        }, 0)
      },
      paymentList() { //付款列表(手機板沒有webATM)
        return this.paymentInfo.list.map(({ id, type, title }) => ({ id, type, title })).filter(item => item.type !== 'WebATM')
      },
      deliveryList() { //貨運方式列表
        let obj = this.paymentInfo.list.find(item => item.type === this.paymentInfo.type)
        if (obj !== undefined) return obj.relationship
        else return []
      },
      transportList() { //宅配廠商列表(防止以後會有多個宅配公司選項,目前只有一個)
        let obj = this.paymentInfo.list.find(item => item.type === this.paymentInfo.type)
        if (obj === undefined) return []
        let transport = obj.relationship.find(item => item.type === 'HOME')
        if (transport === undefined) return []
        else return transport.sub || []
      },
      marketList() { //超商列表
        let obj = this.paymentInfo.list.find(item => item.type === this.paymentInfo.type)
        if (obj === undefined) return []
        let store = obj.relationship.find(item => item.type === 'CVS')
        if (store === undefined) return []
        else return store.sub || []
      },
      hasReceipent() {
        return this.receipentList.length > 0
      },
      hasPickedTicket() { //是否有選取可用用票券
        return this.pickedTicket.length > 0
      },
    },
    methods: {
      initPurchaseSlide() {
        new Swiper('.addOn-swiper', {
          slidesPerView: 2,
          spaceBetween: 0,
          slidesPerGroup: 2,
          loop: false,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      },
      setPurchaseCheck(payload) { //加價購商品勾選
        let obj = this.addOnList.find(item => item.id === payload.id)
        obj.isChecked = payload.checked
      },
      async purchaseBuy(payload) { //購買加價購商品
        let obj = this.addOnList.find(item => item.purchase_id === payload.purchase_id)
        if (obj !== undefined) return
        this.isLoading = true
        let response = await cartApi.cart_purchase({ url: this.apiUrl.cart_purchase, data: { ...payload } })
        if (response.status !== 1) return this.isLoading = false
        let list = this.processNormalCart([response.cartPurchase])
        this.addOnList.push(list[0])
        if (this.canUpdateHeaderCount) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        this.isLoading = false
      },
      async setPurchaseCount(payload) { //更新加價溝商品數量
        this.isLoading = true
        let response = await cartApi.cart_purchase({ url: this.apiUrl.cart_purchase, data: { ...payload } })
        if (response.status !== 1) return this.isLoading = false
        let obj = this.addOnList.find(item => item.purchase_id === payload.purchase_id)
        obj.count = payload.count
        if (this.canUpdateHeaderCount) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        this.isLoading = false
      },
      async removePurchaseItem(payload) { //刪除加價購商品
        this.isLoading = true
        let response = await cartApi.cart_purchase({
          url: `${this.apiUrl.cart_purchase}/${payload.id}`,
          method: 'delete'
        })
        if (response.status !== 1) return this.isLoading = false
        let index = this.addOnList.findIndex(item => item.id === payload.id)
        this.addOnList.splice(index, 1)
        if (this.canUpdateHeaderCount) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        this.isLoading = false
      },
      setMarketType(type) {
        this.$refs.cvsDeliveryForm.openDigitalMap(type)
      },
      setHomeDeliveryFormData(payload, character = 'receiver') { //設置宅配表單資料
        this.$refs.homeDeliveryForm.setCharacterData(payload, character)
      },
      chooseTicket(tickets) {
        this.pickedTicket = _.cloneDeep(tickets)
      },
      setPickedTickChecked(payload) {
        let obj = this.pickedTicket.find(ticket => ticket.coupon_no === payload.coupon_no)
        if (obj === undefined) return
        obj.isChecked = payload.checked
      },
      introPurchase(payload) {
        this.introInfo = payload
        $('#activityProductPopup').modal('show')
      },
      limitedReminder(text) {
        this.limitedText = text
        $('#limit-popup').modal('show')
      },
      saveUserData() { //儲存使用者填寫資訊(表單資料,付款方式,貨運方式,發票資訊)
        let payload = {
          paymentType: this.paymentInfo.type,
          deliveryType: this.deliveryType,
          invoiceInfo: this.$refs.invoiceForm.getData(),
          isDeposit: this.isDeposit
        }
        if (!this.isDeposit) {
          if (this.deliveryType === 'HOME') {
            let homeDeliveryForm = this.$refs.homeDeliveryForm
            payload.isSameOrderer = homeDeliveryForm.isSameOrderer
            payload.orderer = homeDeliveryForm.orderer
            payload.receiver = homeDeliveryForm .receiver
          } else if (this.deliveryType === 'CVS') {
            let cvsDeliveryForm = this.$refs.cvsDeliveryForm
            payload.marketInfo = cvsDeliveryForm.marketInfo
            payload.supermarket = cvsDeliveryForm.supermarket
          }
        }
        window.sessionStorageObj.setItem(this.userStorageKey, payload)
      },
      async validateUserData() {
        let deliveryType = this.deliveryType
        let mappingDeliveryForm = { HOME: 'homeDeliveryForm', CVS: 'cvsDeliveryForm' }
        let mappingErrorText = { HOME: '請填寫完整的收件人和寄件人地址', CVS: '請選擇取貨超商' }
        let isInvoiceValid = await this.$refs.invoiceForm.validate()
        let { formIsValid, addressIsValid } = await this.$refs[mappingDeliveryForm[deliveryType]].validate()
        this.otherError.status = !addressIsValid
        this.otherError.message = addressIsValid ? '' : mappingErrorText[deliveryType]
        if (this.otherError.status) $('#validatePopup').modal('show')
        return formIsValid && isInvoiceValid && !this.otherError.status
      },
      async validateBarcode() {
        const invoiceForm = this.$refs.invoiceForm
        if (invoiceForm.invoiceInfo.id === '1') {
          this.isLoading = true
          let barcodeInfo = await this.checkBarcodeIsValid(invoiceForm.invoiceInfo.invoice_phone_id)
          this.otherError.status = barcodeInfo.status
          this.otherError.message = barcodeInfo.message
          if (!barcodeInfo.status) {
            $('#validatePopup').modal('show')
            this.isLoading = false
            return false
          }
        }
        return true
      },
      async setUserData() { //回填使用者資訊
        let cartUserData = window.sessionStorageObj.getItem(this.userStorageKey)
        let userInfo = window.storageObj.getItem('knn-userInfo')
        let homeDeliveryForm = this.$refs.homeDeliveryForm
        let cvsDeliveryForm = this.$refs.cvsDeliveryForm
        let invoiceForm = this.$refs.invoiceForm
        if (this.hasCartItem) {
          invoiceForm.invoiceInfo.invoice_email = userInfo.email
          invoiceForm.invoiceInfo.invoice_phone_id = userInfo.einvoice_carrier_no || ''
        }
        if (cartUserData === null) return
        if (cartUserData.deliveryType === 'HOME' && !this.isDeposit) {
          this.setHomeDeliveryFormData(cartUserData.orderer, 'orderer')
          homeDeliveryForm.setUserTel(cartUserData.orderer.tel, 'orderer')
          homeDeliveryForm.setRemark(cartUserData.receiver.remark)
          if (cartUserData.isSameOrderer) {
            homeDeliveryForm.setIsSameValue(cartUserData.isSameOrderer)
          } else {
            this.setHomeDeliveryFormData(cartUserData.receiver, 'receiver')
            homeDeliveryForm.setUserTel(cartUserData.receiver.tel, 'receiver')
          }
        }
        if (cartUserData.deliveryType === 'CVS' && !this.isDeposit) {
          cvsDeliveryForm.marketInfo = cartUserData.marketInfo
          cvsDeliveryForm.supermarket = cartUserData.supermarket
          this.$refs.marketModal.setDefaultMarketType(cartUserData.marketInfo.type)
        }

        //付款方式
        this.paymentInfo.type = cartUserData.paymentType
        await this.$nextTick()
        this.deliveryType = cartUserData.deliveryType

        //發票類型
        invoiceForm.invoiceInfo = cartUserData.invoiceInfo
      },
    },
    watch: {
      deliveryList(val) {
        this.deliveryType = val[0].type
      },
    }
  }
})));