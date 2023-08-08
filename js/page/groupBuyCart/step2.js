export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, cartDescMixin, cartParamsMixin, cartStep2LogicMixin],
    store: window.myVuexStore,
    data: {
      cartStorageKey: 'group-cart-item-data',
      userStorageKey: 'group-cart-user-data',
      billInfo: { total_amount: 0, logistics_fee: 0, money_total: 0 },
      tipInfo: { status: 0, message: '' },
      orderTip: { status: false, messsage: '' },
      apiUrl,
      pageUrl,
    },
    methods: {
      createList(lists) {
        return lists.reduce((prev, current) => {
          prev.push({ ...current, uid: window.createUid() })
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
        let { meta, result } = _.cloneDeep(response)
        let isRemaining = meta === null
        if (!isRemaining) this.cartList = this.createList([meta])
        this.cartErrorInfo.isRemaining.status = isRemaining
        this.cartErrorInfo.isCouponRemaining.status = false
        for (let key in this.billInfo) {
          this.billInfo[key] = result[key]
        }
        if (isRemaining) $('#productFilterPopup').modal('show')
        this.apiIsReady = true
        this.isLoading = false
      },
      gatherOrderParams() { //彙整參數
        let logistics_type = this.backupCartData.logistics_type
        let invoice_type = this.invoiceInfo.id
        let addressee_1 = {}
        let addressee_2 = {}
        let cvs_info = {}
        if (!this.isDeposit) {
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
        }
        return {
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