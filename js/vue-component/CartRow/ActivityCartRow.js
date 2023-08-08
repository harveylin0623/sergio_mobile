Vue.component('activity-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  mixins: [cartParamsMixin],
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
    subtotal() {
      let { valid, count, bundle_promo_price } = this.cartInfo
      if (!valid) return 0
      else return count * bundle_promo_price
    },
    activityTitle() {
      return this.mappingActivityCode[this.cartInfo.activity_code]
    },
    comboList() {
      return this.cartInfo.cart
    }
  },
  methods: {
    removeHandler() {
      let { id, uid, activity_code } = this.cartInfo
      this.$emit('remove', { id, uid, activity_code })
    }
  },
  template: `
    <div class="activity-cart-item" :class="{invalid:!isValid}">
      <div class="d-flex align-items-center">
        <div class="top-1">
          <div class="form-check" v-show="isValid">
            <input type="checkbox" class="mr-0 form-check-input" v-model="isChecked">
          </div>
        </div>
        <div class="top-2">
          <p class="ellipsis">{{ cartInfo.activity.title }}</p>
          <p class="text-tomatoRed">*已符合{{ activityTitle }}活動方案</p>
        </div>
      </div>
      <div class="activity-content">
        <div class="info-box">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <p class="text-tomatoRed bundle-price">
              小計: {{'$'}}{{ cartInfo.bundle_promo_price | currency }}
            </p>
            <p class="ml-auto mr-2">x{{ cartInfo.count }}</p>
            <button class="btn btn-outline-tomatoRed" @click="removeHandler">
              <i class="fal fa-trash-alt"></i>
              <span>刪除</span>
            </button>
          </div>
          <div>
            <combo-product
              v-for="combo in comboList"
              :key="combo.id"
              :combo="combo"
              :activity-code="cartInfo.activity_code"
            ></combo-product>
          </div>
        </div>
        <div class="decorate-box">
          <div class="bg-limeGreen line"></div>
          <div class="bg-limeGreen rounded-circle text-white text-center ball">
            <i class="fal fa-bullhorn"></i>
          </div>
        </div>
      </div>
    </div>`
})