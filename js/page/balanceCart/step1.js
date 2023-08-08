export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, checkBarcodeMixin, cartDescMixin, cartParamsMixin, cartStep1LogicMixin],
    store: window.myVuexStore,
    data: {
      parentOrderNumber: '',
      cartId: 0,
      cartStorageKey: 'balance-cart-item-data',
      userStorageKey: 'balance-cart-user-data',
      apiUrl,
      pageUrl
    },
    computed: {
      billAmount() {
        let cartAmount = this.cartList.reduce((prev, current) => {
          let { count, final_payment } = current.balance
          prev += count * final_payment
          return prev
        }, 0)
        let addOnAmount = this.addOnList.reduce((prev, current) => {
          prev += current.count * current.purchase_price
          return prev
        }, 0)
        return cartAmount + addOnAmount
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
        let orderNumber = window.getQuery('orderNumber')
        let response = await cartApi.getCart({ url: `${apiUrl.cart}/${orderNumber}` })
        let { metas, count, final_payment, total, parent_order_num, id:cartId } = response.cart
        let lists = this.processNormalCart(metas)
        lists[0].balance = { count, final_payment, total }
        this.cartList = lists
        this.parentOrderNumber = parent_order_num
        return {
          cartId,
          activity_meta_id: metas[0].activity_meta_id
        }
      },
      async getPurchaseData(groupIds) {
        let { cartId, activity_meta_id } = groupIds
        return Promise.all([
          cartApi.cart_purchase({
            url: apiUrl.product_purchase,
            method: 'get',
            params: { activity_meta_id }
          }).then(res => {
            return res.aaData
          }),
          productApi.product_purchase({ 
            url: apiUrl.cart_purchase, 
            method: 'get', 
            params: { cart_id: cartId }
          }).then(res => {
            return res.purchase
          })
        ])
      },
      async openTicketModal() {
        this.isLoading = true
        let purchase_ids = this.addOnList.filter(item => item.isChecked).map(item => item.id)
        await this.$refs.cartCoupoonModal.getUserCoupon({ cart_ids, bundle_ids, limit_ids, purchase_ids })
        this.isLoading = false
      },
      async getCartData() {
        let [receipent, payment, groupIds] = await Promise.all([
          memberApi.receipent({ url: apiUrl.receipent, method: 'get' }),
          cartApi.paymemt({ url: apiUrl.payment }),
          this.getProductCart(),
        ])
        let [purchaseData, addOnData] = await this.getPurchaseData(groupIds)
        this.purchaseList = purchaseData
        this.addOnList = this.processNormalCart(addOnData)
        this.receipentList = receipent.aaData
        this.paymentInfo.list = payment.aaData
        this.paymentInfo.type = this.paymentList[0].type
        this.cartId = groupIds.cartId
        await this.$nextTick()
        if (this.hasCartItem) {
          this.setHomeDeliveryFormData(window.storageObj.getItem(this.authKey), 'orderer')
          this.initPurchaseSlide()
        }
      },
      async purchaseBuy(payload) {
        let obj = this.addOnList.find(item => item.purchase_id === payload.purchase_id)
        if (obj !== undefined) return
        this.isLoading = true
        let response = await cartApi.cart_purchase({ 
          url: apiUrl.cart_purchase, 
          data: { cart_id: this.cartId, ...payload } 
        })
        if (response.status !== 1) return this.isLoading = false
        this.addOnList.push(response.purchase)
        if (this.canUpdateHeaderCount) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        this.isLoading = false
      },
      async setPurchaseCount(payload) {
        this.isLoading = true
        let response = await cartApi.cart_purchase({ 
          url: apiUrl.cart_purchase, 
          data: { cart_id: this.cartId, ...payload } 
        })
        if (response.status !== 1) return this.isLoading = false
        let obj = this.addOnList.find(item => item.purchase_id === payload.purchase_id)
        obj.count = payload.count
        if (this.canUpdateHeaderCount) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        this.isLoading = false
      },
      async removePurchaseItem(payload) {
        this.isLoading = true
        let response = await cartApi.cart_purchase({
          url: `${apiUrl.cart_purchase}/${payload.id}`,
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
      async settleHandler() {
        let isFormValid = await this.validateUserData()
        if (!isFormValid) return
        let barcodeIsValid = await this.validateBarcode()
        if (!barcodeIsValid) return

        let cart_id = this.cartId
        let coupons = []
        let payment_type = this.paymentInfo.type
        let logistics_type = this.deliveryType
        let transportType = this.transportList.length !== 0 ? this.transportList[0].type : ''
        let logistics_code = logistics_type === 'HOME' ? transportType : logistics_type === 'CVS' ? this.$refs.cvsDeliveryForm.marketInfo.type : ''
        window.sessionStorageObj.setItem(this.cartStorageKey, { cart_id, coupons, payment_type, logistics_type, logistics_code })
        this.saveUserData()
        location.href = `${this.pageUrl.cart_step2}?orderNumber=${this.parentOrderNumber}`
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