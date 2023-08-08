Vue.component('cart-coupon', {
  props: {
    ticket: { type: Object, required: true }
  },
  computed: {
    isChecked: {
      get() {
        return this.ticket.isChecked
      },
      set(val) {
        this.$emit('set-checked', {
          coupon_no: this.ticket.coupon_no,
          checked: val
        })
      }
    },
    deadline() {
      let { redeem_start_datetime, redeem_end_datetime } = this.ticket
      let startTime = redeem_start_datetime.split(' ')[0]
      let endTime = redeem_end_datetime.split(' ')[0]
      return `${startTime}~${endTime}`
    }
  },
  template: `
    <label class="d-flex align-items-start mb-2 bd-divide rounded cart-coupon">
      <div class="d-flex justify-content-center align-items-center flex-shrink-0 flex-grow-0 left">
        <i class="fas fa-ticket-alt fa-2x text-limeGreen"></i>
      </div>
      <div class="d-flex justify-content-center align-items-center right">
        <div class="pr-1 desc-box">
          <p class="title sm mb-0">{{ ticket.title }}</p>
          <p class="mb-0 text-break title sm text-limeGreen">{{ deadline }}</p>
          <p class="title sm mb-0">可用次數<span class="mx-1 text-tomatoRed">100</span>次</p>
        </div>
        <div class="flex-shrink-0 flex-grow-0 input-box">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" v-model="isChecked">
          </div>
        </div>
      </div>
    </label>`
})