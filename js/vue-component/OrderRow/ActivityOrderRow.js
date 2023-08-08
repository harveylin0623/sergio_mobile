export default (() => {
  Vue.component('activity-order-row', {
    props: {
      productInfo: { type: Object, required: true }
    },
    mixins: [cartParamsMixin],
    computed: {
      activityTitle() {
        return this.mappingActivityCode[this.productInfo.activity_code]
      },
      comboList() {
        return this.productInfo.meta
      },
      subTotal() {
        let { bundle_promo_price, count } = this.productInfo
        return bundle_promo_price * count
      }
    },
    template: `
      <div class="px-0 py-2 activity-cart-item">
        <div class="d-flex align-items-center mb-2">
          <div class="pl-0 top-2">
            <p class="ellipsis">{{ productInfo.title }}</p>
            <p class="text-tomatoRed">*{{ activityTitle }}方案</p>
          </div>
        </div>
        <div class="activity-content">
          <div class="info-box">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <p class="text-tomatoRed bundle-price">
                {{'$'}}{{ productInfo.bundle_promo_price | currency }}
              </p>
              <p class="ml-auto mr-2">x{{ productInfo.count }}</p>
            </div>
            <div>
              <combo-product 
                v-for="combo in comboList"
                :key="combo.id"
                :combo="combo"
                :activity-code="productInfo.activity_code"
                :show-combo-price="true"
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
})()