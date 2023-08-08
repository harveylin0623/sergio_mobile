Vue.component('activity-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  mixins: [cartParamsMixin],
  computed: {
    subtotal() {
      let { count, bundle_promo_price } = this.cartInfo
      return count * bundle_promo_price
    },
    activityTitle() {
      return this.mappingActivityCode[this.cartInfo.activity_code]
    },
    comboList() {
      return this.cartInfo.cart
    }
  },
  template: `
    <div class="activity-cart-item">
      <div class="d-flex align-items-center mb-2">
        <div class="pl-0 top-2">
          <p class="ellipsis">{{ cartInfo.activity.title }}</p>
          <p class="text-tomatoRed">*已符合{{ activityTitle }}</p>
        </div>
      </div>
      <div class="activity-content">
        <div class="info-box">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <p class="text-tomatoRed bundle-price">
              {{'$'}}{{ cartInfo.bundle_promo_price | currency }}
            </p>
            <p class="ml-auto mr-2">x{{ cartInfo.count }}</p>
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