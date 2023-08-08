export default (() => {
  Vue.component('order-list-row', {
    props: {
      orderInfo: { type: Object, required: true }
    },
    computed: {
      tracking_num() {
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
      }
    },
    methods: {
      openMap() {
        this.$emit('open-digital-map', { payUrl: this.orderInfo.pay_url })
      },
      cancelHandler() {
        this.$emit('cancel-order', { 
          orderNumber: this.orderInfo.order_num,
          isPaid: this.orderInfo.pay_status === 1
        })
      },
      buyAgain() {
        this.$emit('buy-again', { orderNumber: this.orderInfo.order_num })
      }
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
            <a
              v-if="orderInfo.isRefunds"
              :href="orderInfo.refundUrl"
              class="btn btn-outline-secondary"
            >退貨</a>
            <button
              class="btn btn-outline-secondary" 
              @click="buyAgain"
            >再買一次</button>
          </div>
        </div>
      </div>`
  })
})()
