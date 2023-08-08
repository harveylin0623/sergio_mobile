Vue.component('limited-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    isValid() {
      return this.cartInfo.valid
    },
    isChecked: {
      get() {
        return this.cartInfo.isChecked
      },
      set(val) {
        if (!this.isValid) return
        this.$emit('set-check', { uid: this.cartInfo.uid, checked: val })
      }
    },
    imageUrl() {
      return this.cartInfo.meta.spec.images[0] || ''
    },
    subtotal() {
      let { valid, count, meta } = this.cartInfo
      if (!valid) return 0
      else return count * meta.promo_price
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    },
    changeCount(num) {
      this.$emit('set-count', { 
        code: this.cartInfo.activity_code,
        activity_product_promotions_id: this.cartInfo.activity.id,
        activity_product_promotions_sub_id: this.cartInfo.interval.interval_id,
        activity_meta_id: this.cartInfo.meta.activity_meta_id,
        count: num,
        uid: this.cartInfo.uid
      })
    },
    limitedReminder(text) {
      this.$emit('limited-reminder', text)
    }
  },
  template: `
    <div class="normal-cart-item" :class="{invalid:!isValid}">
      <div class="left">
        <div class="form-check" v-show="isValid">
          <input type="checkbox" class="mr-0 form-check-input" v-model="isChecked">
        </div>
      </div>
      <div class="right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <p class="text-tomatoRed">*{{ cartInfo.activity.title }}</p>
            <a :href="cartInfo.linkUrl" class="w-100 text-dark ellipsis">
              {{ cartInfo.meta.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.meta.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.meta.promo_price | currency }}</p>
              <p class="text-tomatoRed" v-if="isValid">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-2">
              <input-number
                v-if="isValid"
                class="sm"
                :max="cartInfo.meta.activity_spec_stock"
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