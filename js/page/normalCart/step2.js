export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, cartDescMixin, cartParamsMixin, cartStep2LogicMixin],
    store: window.myVuexStore,
    data: {
      cartStorageKey: 'cart-item-data',
      userStorageKey: 'cart-user-data',
      billInfo: { total_amount: 0, total_discount: 0, logistics_fee: 0, money_total: 0 },
      tipInfo: { status: 0, message: '' },
      orderTip: { status: false, messsage: '' },
      apiUrl,
      pageUrl,
    },
    methods: {
      createList(lists, componentName) {
        return lists.reduce((prev, current) => {
          prev.push({ ...current, uid: window.createUid(), componentName })
          return prev
        }, [])
      },
      async getCartItemData() { //取得商品資料
        let storage = window.sessionStorageObj.getItem(this.cartStorageKey)
        if (storage === null) return this.handleCartDataError('購物車資料有誤')
        this.isLoading = true
        this.backupCartData = _.cloneDeep(storage)
        let response = await cartApi.cart_calculate({ url: apiUrl.cart_calculate, data: storage })
        if (response.status !== 1) return this.handleCartDataError(response.message)
        let { carts, cart_bundles, cart_limited_time, cart_purchases, result, isRemaining, isCouponRemaining } = _.cloneDeep(response)
        let normalCart = this.createList(carts, 'normal-settled-row')
        let activityCart = this.createList(cart_bundles, 'activity-settled-row')
        let limitedCart = this.createList(cart_limited_time, 'limited-settled-row')
        this.cartList = normalCart.concat(activityCart, limitedCart)
        this.addOnList = cart_purchases
        this.couponList = result.available_coupons
        this.cartErrorInfo.isRemaining.status = isRemaining
        this.cartErrorInfo.isCouponRemaining.status = isCouponRemaining
        for (let key in this.billInfo) { //寫入金額資料
          this.billInfo[key] = result[key]
        }
        if (isRemaining || isCouponRemaining) $('#productFilterPopup').modal('show')
        this.apiIsReady = true
        this.isLoading = false
      },
      gatherOrderParams() { //彙整參數
        let logistics_type = this.backupCartData.logistics_type
        let invoice_type = this.invoiceInfo.id
        let addressee_1 = {}
        let addressee_2 = {}
        let cvs_info = {}
        if (logistics_type === 'HOME') {
          addressee_1 = this.setHomeDeliveryInfo(this.backupUserData.orderer)
          addressee_2 = this.setHomeDeliveryInfo(this.backupUserData.receiver)
        } else if (logistics_type === 'CVS') {
          cvs_info = {
            logistics_sub_type: this.backupCartData.logistics_code,
            cvs_store_id: this.backupUserData.marketInfo.CVSStoreID,
            cvs_store_name: this.backupUserData.marketInfo.CVSStoreName,
            cvs_address: this.backupUserData.marketInfo.CVSAddress,
            cvs_telephone: this.backupUserData.marketInfo.CVSTelephone,
            cvs_out_side: this.backupUserData.marketInfo.CVSOutSide,
            recipient_name: this.backupUserData.supermarket.name,
            recipient_phone: this.backupUserData.supermarket.mobile,
            recipient_email: this.backupUserData.supermarket.email,
            remark: this.backupUserData.supermarket.remark
          }
        }
        return {
          cart_ids: this.backupCartData.cart_ids,
          cart_bundle_ids: this.backupCartData.cart_bundle_ids,
          limit_ids: this.backupCartData.limit_ids,
          cart_purchase_ids: this.backupCartData.cart_purchase_ids,
          payment_type: this.backupCartData.payment_type,
          logistics_type,
          logistics_code: this.backupCartData.logistics_code,
          addressee_1,
          addressee_2,
          cvs_info,
          coupons: this.backupCartData.coupons,
          invoice_info: {
            invoice_type,
            invoice_phone_id: invoice_type === '1' ? this.invoiceInfo.invoice_phone_id : '', //手機載具
            invoice_user_id: invoice_type === '2' ? this.invoiceInfo.invoice_user_id : '', //自然人
            invoice_email: invoice_type === '3' ? this.invoiceInfo.invoice_email : '', //會員載具
            invoice_love_id: invoice_type === '4' ? this.invoiceInfo.invoice_love_id : '', //愛心碼
            invoice_num: invoice_type === '5' ? this.invoiceInfo.invoice_num : '', //統編
            invoice_company: invoice_type === '5' ? this.invoiceInfo.companyTitle : '', //公司抬頭
            invoice_addr: invoice_type === '5' ? this.invoiceInfo.companyAddress : '' //公司地址
          },
        }
      },
      async pollingOrderStatus(orderNumber) { //polling確認訂單狀態(0:處理中,1:完成,2:失敗)
        let { status: apiStatus, form, order_status } = await orderApi.order_status({ url: `${apiUrl.order_status}/${orderNumber}` })
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
            this.pollingOrderStatus(orderNumber)
          }, 3000);
        } else if (orderStatus === 1) {
          window.sessionStorageObj.removeItem(this.cartStorageKey)
          window.sessionStorageObj.removeItem(this.userStorageKey)
          if (form !== '') window.openThirdPartyPaymentWindow(form)
          setTimeout(() => { //用setTimeout是避免window.open還沒執行完就導頁
            location.href = `${this.pageUrl.cart_step3}?type=normal&orderNumber=${order_num}`
          }, 3000)
        } else if (orderStatus === 2) {
          this.handleOrderError()
        }
      },
      async createOrder() { //建立訂單
        this.isLoading = true
        let orderParams = this.gatherOrderParams()
        let response = await orderApi.order({ url: apiUrl.order_create, data: orderParams })
        this.orderTip.status = response.status === 1
        this.orderTip.message = response.message
        if (response.status === 0) {
          this.handleOrderError()
        } else if (response.status === 1) {
          this.pollingOrderStatus(response.order_num)
        } else if (response.status === 2) {
          this.handleCartDataError(response.message)
        }
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getCartItemData()
      this.getUserFilledData()
      this.isLoading = false
    }
  })
}
