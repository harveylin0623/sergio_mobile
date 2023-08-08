Vue.component('cart-coupon-modal', {
  props: {
    validCouponUrl: { type: String, required: true }
  },
  data: () => ({
    ticketList: []
  }),
  computed: {
    hasTicket() {
      return this.ticketList.length > 0
    },
    modalTitle() {
      return this.hasTicket ? '您擁有的折價券' : '您目前無可用票券'
    }
  },
  methods: {
    createTicketList(lists) {
      return lists.reduce((prev, current) => {
        prev.push({ ...current, isChecked: false })
        return prev
      }, [])
    },
    async getUserCoupon(payload) {
      let response = await cartApi.valid_coupon({ url: this.validCouponUrl, data: payload })
      this.ticketList = this.createTicketList(response.result.available_coupons)
      $('#ticketPopup').modal('show')
    },
    setTicketChecked(payload) {
      let obj = this.ticketList.find(ticket => ticket.coupon_no === payload.coupon_no)
      if (obj === undefined) return
      obj.isChecked = payload.checked
    },
    confirmHandler() {
      let tickets = this.ticketList.filter(ticket => ticket.isChecked)
      this.$emit('choose-ticket', tickets)
    }
  },
  template: `
    <div class="modal fade" id="ticketPopup" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h2>{{ modalTitle }}</h2>
          </div>
          <div class="p-0 modal-body">
            <cart-coupon
              v-for="ticket in ticketList"
              :key="ticket.coupon_no"
              :ticket="ticket"
              @set-checked="setTicketChecked"
            ></cart-coupon>
          </div>
          <div class="modal-footer flex-column py-0">
            <button 
              v-show="hasTicket"
              class="btn btn-limeGreen mx-auto limit"
              data-dismiss="modal"
              @click="confirmHandler">確認</button>
            <button class="btn btn-outline-limeGreen mx-auto limit" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>`
})