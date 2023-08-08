export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, checkBarcodeMixin, cartDescMixin, cartParamsMixin, cartStep1LogicMixin],
    store: window.myVuexStore,
    data: {
      cartStorageKey: 'group-cart-item-data',
      userStorageKey: 'group-cart-user-data',
      apiUrl,
      pageUrl
    },
    computed: {
      allCartItemSubtotal() {
        return this.cartList.reduce((prev, current) => {
          let { count, grade_distance } = current
          prev += count * grade_distance.amount
          return prev
        }, 0)
      },
    },
    methods: {
      processNormalCart(lists) {
        return lists.reduce((prev, current) => {
          let uid = window.createUid()
          prev.push({ ...current, uid })
          return prev
        }, [])
      },
      async getProductCart() {
        let { cart } = await cartApi.groupbuy_cart({ url: apiUrl.cart, method: 'get' })
        if (cart !== null) {
          this.cartList = this.processNormalCart([cart])
        }
      },
      async setCartItemCount(payload) {
        this.isLoading = true
        let response = await cartApi.addCart({ url: apiUrl.cart, data: { ...payload } })
        if (response.status !== 1) return this.isLoading = false
        let obj = this.cartList.find(cart => cart.uid === payload.uid)
        obj.count = payload.count
        this.isLoading = false
      },
      async removeCartItem(payload) {
        this.isLoading = true
        let response = await cartApi.removeCart({ url: `${apiUrl.cart}/${payload.id}` })
        if (response.status !== 1) return this.isLoading = false
        let index = this.cartList.findIndex(item => item.uid === payload.uid)
        this.cartList.splice(index, 1)
        this.isLoading = false
      },
      getCheckedCartItemId() {
        return this.cartList.map(item => item.id)
      },
      async openTicketModal() {
        this.isLoading = true
        let cart_ids = this.getCheckedCartItemId()
        await this.$refs.cartCoupoonModal.getUserCoupon({ cart_ids })
        this.isLoading = false
      },
      async getCartData() {
        let [payment, receipent] = await Promise.all([
          cartApi.paymemt({ url: apiUrl.payment }),
          memberApi.receipent({ url: apiUrl.receipent, method: 'get' }),
          this.getProductCart(),
        ])
        this.receipentList = receipent.aaData
        this.paymentInfo.list = payment.aaData.payments
        this.paymentInfo.type = this.paymentList[0].type
        if (this.hasCartItem) {
          this.setHomeDeliveryFormData(window.storageObj.getItem(this.authKey), 'orderer')
        }
      },
      async settleHandler() {
        if (!this.isDeposit) {
          let isFormValid = await this.validateUserData()
          if (!isFormValid) return
        }
        let barcodeIsValid = await this.validateBarcode()
        if (!barcodeIsValid) return
        let payment_type = this.paymentInfo.type
        let logistics_type = this.deliveryType
        let transportType = this.transportList.length !== 0 ? this.transportList[0].type : ''
        let marketType = this.$refs.cvsDeliveryForm.marketInfo.type
        let logistics_code = logistics_type === 'HOME' ? transportType : logistics_type === 'CVS' ? marketType : ''
        window.sessionStorageObj.setItem(this.cartStorageKey, { payment_type, logistics_type, logistics_code })
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
    }
  })
}