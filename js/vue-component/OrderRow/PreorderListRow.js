export default (() => {
  Vue.component('preorder-list-row', {
    props: {
      orderInfo: { type: Object, required: true }
    },
    computed: {
      isDeposit() {
        return this.orderInfo.order_type === 'deposit'
      },
      tracking_num() {
        if (this.isDeposit) return ''
        let shipping = this.orderInfo.shipping
        let { logistics_provider, tracking_num } = shipping
        let str = ''
        if ((typeof logistics_provider === 'string' && logistics_provider.trim().length > 0) &&
          (typeof tracking_num === 'string' && tracking_num.trim().length > 0)) {
          str = logistics_provider + ' / ' + tracking_num
        } else if (typeof logistics_provider === 'string' && logistics_provider.trim().length > 0) {
          str = logistics_provider
        } else if (typeof tracking_num === 'string' && tracking_num.trim().length > 0) {
          str = tracking_num
        } else {
          str = ''
        }
        return str
      },
      unPaid() {
        let { pay_status, pay_url, status, info } = this.orderInfo
        let pay_type = info.pay_type
        return pay_status === 0 && pay_url !== '' && status !== 9 && pay_type !== 'CVSPickupPay'
      },
      balancePageUrl() {
        return `${this.orderInfo.balanceUrl}?orderNumber=${this.orderInfo.order_num}`
      },
      showBalanceButton() {
        return this.orderInfo.has_final_payment_cart === true
      }
    },
    methods: {
      openMap() {
        this.$emit('open-digital-map', { payUrl: this.orderInfo.pay_url })
      },
      returnHandler() {
        this.$emit('return-order', { orderNumber: this.orderInfo.order_num })
      },
      cancelHandler() {
        let cancelOrderNumber = ''
        if (this.isDeposit) {
          if (this.orderInfo.has_final_payment) {
            cancelOrderNumber = this.orderInfo.final_payment.order_num
          } else {
            cancelOrderNumber = this.orderInfo.order_num
          }
        } else {
          cancelOrderNumber = this.orderInfo.order_num
        }
        this.$emit('cancel-order', { 
          parentOrderNumber: this.orderInfo.order_num,
          cancelOrderNumber,
        })
      },
    },
    template: `
      <div class="mb-2 bd-limeGreen rounded">
        <div class="p-2 d-flex justify-content-between align-items-center rounded-top bg-mintGreen">
          <a :href="orderInfo.linkUrl" class="mb-0 title sm text-time text-decoration-underline">
            {{ orderInfo.order_num }}
          </a>
          <p class="mb-0 title sm">{{ orderInfo.status_message }}</p>
        </div>
        <div class="bg-white rounded-bottom">
          <div class="p-2 mb-0 bd-bottom-divide title sm">訂單日期 : {{ orderInfo.create_time }}</div>
          <div class="p-2 mb-0 bd-bottom-divide title sm">預購型態 : {{ orderInfo.order_type_text }}</div>
          <div class="p-2 mb-0 bd-bottom-divide title sm">物流資訊 : {{ tracking_num }}</div>
          <div class="d-flex align-items-center p-2 mb-0 bd-bottom-divide title sm">
            <div class="w-50 flex-grow-0 flex-shrink-0 bd-right-divide">
              <span class="text-tomatoRed">{{ orderInfo.pay_status_message }}</span>
              <a href="javascript:;" class="text-dark text-decoration-underline" v-if="unPaid" @click="openMap">【前往付款】
              </a>
            </div>
            <div class="w-50 flex-grow-0 flex-shrink-0 text-right">
              訂單金額 : 
              <span class="text-tomatoRed">{{'$'}}{{ orderInfo.money_total | currency }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center p-2 order-list-footer">
            <button
              v-if="orderInfo.isCancel"
              class="btn btn-outline-secondary"
              @click="cancelHandler"
            >取消訂單</button>
            <button
              v-if="orderInfo.isRefunds"
              class="btn btn-outline-secondary" 
              @click="returnHandler"
            >退貨</button>
            <a
              v-if="showBalanceButton"
              :href="balancePageUrl"
              class="btn btn-outline-secondary" 
            >預購尾款</a>
          </div>
        </div>
      </div>`
  })
})()
