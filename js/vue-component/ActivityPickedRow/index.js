Vue.component('activity-picked-row', {
  props: {
    pickInfo: { type: Object, required: true  },
    activityType: { type: String, default: 'fullAmount' }
  },
  computed: {
    isMatchedActivity() {
      return this.activityType === 'match'
    },
    labelClass() {
      if (!this.isMatchedActivity) return ''
      else return this.pickInfo.promo_type === 1 ? 'bg-tomatoRed' : 'bg-limeGreen'
    },
    subTotal() {
      let { buyCount, price } = this.pickInfo
      return buyCount * price
    }
  },
  methods: {
    remove() {
      this.$emit('remove-pick', { activityProductId: this.pickInfo.activityProductId })
    },
    changeCount(num) {
      this.$emit('change-pick-count', { 
        activityProductId: this.pickInfo.activityProductId,
        count: num
      })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="p-0 right">
        <div class="clearfix">
          <div class="position-relative overflow-hidden float-left img-box">
            <img :src="pickInfo.imgUrl" class="full-img" alt="">
            <div class="label" :class="labelClass" v-if="isMatchedActivity"></div>
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">{{ pickInfo.name }}</a>
            <p class="text-link product-spec">規格: {{ pickInfo.specName }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{ pickInfo.price | currency }}</p>
              <p class="text-tomatoRed">小計: {{ subTotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                class="sm"
                :max="pickInfo.stock"
                :count="pickInfo.buyCount"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="remove">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})