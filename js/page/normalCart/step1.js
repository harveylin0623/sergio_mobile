export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, checkBarcodeMixin, cartDescMixin, cartParamsMixin, cartStep1LogicMixin],
    store: window.myVuexStore,
    data: {
      isAllChecked: true,
      canUpdateHeaderCount: true,
      cartStorageKey: 'cart-item-data',
      userStorageKey: 'cart-user-data',
      apiUrl,
      pageUrl
    },
    computed: {
      checkedCartList() {
        return this.cartList.filter(cart => cart.isChecked)
      },
      canSettle() { //是否可結帳
        return this.checkedCartList.length > 0
      },
      normalItemSubTotal() {
        return this.calculateItemSubtotal(true)
      },
      activityItemSubTotal() {
        return this.calculateItemSubtotal(false)
      },
      allCartItemSubtotal() {
        return this.normalItemSubTotal + this.activityItemSubTotal
      },
    },
    methods: {
      processNormalCart(lists) {
        return lists.reduce((prev, current) => {
          let { valid, product_code, product } = current
          let uid = window.createUid()
          let linkUrl = `${this.pageUrl.productDetail}?productCode=${product_code}&category_id=${product.category_id}`
          prev.push({ ...current, isChecked: valid, componentName: 'normal-cart-row', uid, linkUrl })
          return prev
        }, [])
      },
      processaActvityCart(lists) {
        return lists.reduce((prev, current) => {
          let uid = window.createUid()
          prev.push({ ...current, isChecked: current.valid, componentName: 'activity-cart-row', uid })
          return prev
        }, [])
      },
      processLimitedCart(lists) {
        return lists.reduce((prev, current) => {
          let { activity, meta, valid } = current
          let uid = window.createUid()
          let linkUrl = `${this.pageUrl.limitedProductDetail}?promoteId=${activity.id}&activityProductId=${meta.activity_meta_id}`
          prev.push({ ...current, isChecked: valid, componentName: 'limited-cart-row', uid, linkUrl })
          return prev
        }, [])
      },
      async getProductCart() {
        let [normalCart, activityCart, limitedCart] = await Promise.all([
          cartApi.getCart({ url: apiUrl.cart }),
          cartApi.getProductPromotions({ url: apiUrl.product_promotions }),
          cartApi.getLimitedTime({ url: apiUrl.limit_time }),
        ])
        let normalList = this.processNormalCart(normalCart.aaData)
        let activityList = this.processaActvityCart(activityCart.aaData)
        let limitedList = this.processLimitedCart(limitedCart.aaData)
        this.cartList = normalList.concat(activityList, limitedList)
      },
      setCheckedAll() {
        this.cartList.forEach(item => {
          if (item.valid) item.isChecked = this.isAllChecked
        })
      },
      setCartItemChecked(payload) {
        let obj = this.cartList.find(cart => cart.uid === payload.uid)
        obj.isChecked = payload.checked
        let validList = this.cartList.filter(cart => cart.valid)
        if (validList.length === 0) return
        this.isAllChecked = validList.every(item => item.isChecked)
      },
      calculateItemSubtotal(isNormal) { //計算購物車商品項目金額
        let arr = this.checkedCartList.filter(cart => {
          if (isNormal) return cart.activity_code === 'normal'
          else return cart.activity_code !== 'normal'
        })
        return arr.reduce((prev, current) => {
          let { activity_code, count, product, bundle_promo_price, meta } = current
          let price = activity_code === 'normal' ? product.product_promo_price : activity_code === 'limit_time' ? meta.promo_price : bundle_promo_price
          prev += count * price
          return prev
        }, 0)
      },
      async setCartItemCount(payload) {
        this.isLoading = true
        let realApiUrl = payload.code === 'normal' ? apiUrl.cart : apiUrl.limit_time
        let response = await cartApi.addCart({ url: realApiUrl, data: { ...payload } })
        if (response.status !== 1) return this.isLoading = false
        let obj = this.cartList.find(cart => cart.uid === payload.uid)
        obj.count = payload.count
        this.myHeader.updateCartCount(response.cartTotal)
        this.isLoading = false
      },
      async removeCartItem(payload) {
        this.isLoading = true
        let mappingApiUrl = { normal: apiUrl.cart, limit_time: apiUrl.limit_time }
        let realApiUrl = mappingApiUrl[payload.activity_code] || apiUrl.product_promotions
        let response = await cartApi.removeCart({ url: `${realApiUrl}/${payload.id}` })
        if (response.status !== 1) return this.isLoading = false
        let index = this.cartList.findIndex(item => item.uid === payload.uid)
        this.cartList.splice(index, 1)
        this.myHeader.updateCartCount(response.cartTotal)
        this.isLoading = false
      },
      getCheckedCartItemId(code, isSpecify = true) { //取得勾選指定activity_code的商品id
        return this.checkedCartList.filter(item => {
          let activity_code = item.activity_code
          if (isSpecify) return activity_code === code
          else return activity_code !== 'normal' && activity_code !== 'limit_time'
        }).map(item => item.id)
      },
      async openTicketModal() {
        this.isLoading = true
        let cart_ids = this.getCheckedCartItemId('normal')
        let bundle_ids = this.getCheckedCartItemId('', false)
        let limit_ids = this.getCheckedCartItemId('limit_time')
        let purchase_ids = this.addOnList.filter(item => item.isChecked).map(item => item.id)
        await this.$refs.cartCoupoonModal.getUserCoupon({ cart_ids, bundle_ids, limit_ids, purchase_ids })
        this.isLoading = false
      },
      async getCartData() {
        let [addOnData, purchase, receipent, payment] = await Promise.all([
          cartApi.cart_purchase({ url: apiUrl.cart_purchase, method: 'get' }),
          productApi.product_purchase({ url: apiUrl.product_purchase }),
          memberApi.receipent({ url: apiUrl.receipent, method: 'get' }),
          cartApi.paymemt({ url: apiUrl.payment }),
          this.getProductCart(),
        ])
        this.addOnList = this.processNormalCart(addOnData.aaData)
        this.purchaseList = purchase.aaData
        this.receipentList = receipent.aaData
        this.paymentInfo.list = payment.aaData
        this.paymentInfo.type = this.paymentList[0].type
        await this.$nextTick()
        if (this.hasCartItem) {
          this.setHomeDeliveryFormData(window.storageObj.getItem(this.authKey), 'orderer')
          this.initPurchaseSlide()
        }
      },
      async settleHandler() {
        if (!this.canSettle) return
        let isFormValid = await this.validateUserData()
        if (!isFormValid) return
        let barcodeIsValid = await this.validateBarcode()
        if (!barcodeIsValid) return
        let cart_ids = this.getCheckedCartItemId('normal')
        let cart_bundle_ids = this.getCheckedCartItemId('', false)
        let limit_ids = this.getCheckedCartItemId('limit_time')
        let cart_purchase_ids = this.addOnList.filter(item => item.isChecked).map(item => item.id)
        let coupons = this.pickedTicket.filter(item => item.isChecked).map(item => item.coupon_no)
        let payment_type = this.paymentInfo.type
        let logistics_type = this.deliveryType
        let transportType = this.transportList.length !== 0 ? this.transportList[0].type : ''
        let logistics_code = logistics_type === 'HOME' ? transportType : logistics_type === 'CVS' ? this.$refs.cvsDeliveryForm.marketInfo.type : ''
        window.sessionStorageObj.setItem(this.cartStorageKey, { cart_ids, cart_bundle_ids, limit_ids, cart_purchase_ids, coupons, payment_type, logistics_type, logistics_code })
        this.saveUserData()
        location.href = this.pageUrl.cart_step2
      },
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: true })
      await this.getCartData()
      await this.setUserData()
      this.isLoading = false
    },
  })
}