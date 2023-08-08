Vue.component('balance-add-on-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { valid, count, purchase_price } = this.cartInfo
      if (!valid) return 0
      else return count * purchase_price
    }
  },
  methods: {
    removeHandler() {
      this.$emit('remove', { id: this.cartInfo.id })
    },
    changeCount(num) {
      let { product_code, spec_id, purchase_id } = this.cartInfo
      this.$emit('set-count', { product_code, spec_id, count: num, purchase_id })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.purchase_price | currency }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
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