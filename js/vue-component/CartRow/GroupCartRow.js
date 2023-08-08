Vue.component('group-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, grade_distance } = this.cartInfo
      return count * grade_distance.amount
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    },
    changeCount(num) {
      let { uid, activity_meta_id } = this.cartInfo
      this.$emit('set-count', { uid, count: num, activity_meta_id })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <div class="w-100 text-dark ellipsis">{{ cartInfo.product.product_name }}</div>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.grade_distance.amount | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.spec.spec_stock"
                :count="cartInfo.count"
                :show-upper-limited-popup="true"
                @change-count="changeCount"
                @limited-reminder="limitedReminder"
              ></input-number>
              <button class="ml-2 btn btn-outline-tomatoRed" @click="removeHandler">
                <i class="fal fa-trash-alt"></i>
                <span>刪除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
})