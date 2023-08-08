export default (() => {
  Vue.component('limited-order-row', {
    props: {
      productInfo: { type: Object, required: false }
    },
    computed: {
      specImageUrl() {
        return this.productInfo.spec.images[0] || ''
      },
      subtotal() {
        return this.productInfo.count * this.productInfo.promo_price
      }
    },
    template: `
      <div class="px-0 py-2 normal-cart-item">
        <div class="pl-0 right">
          <div class="clearfix">
            <div class="float-left img-box">
              <img :src="specImageUrl" class="full-img" alt="">
            </div>
            <div class="float-left desc-box">
              <p class="text-tomatoRed">*{{ productInfo.activity_title }}</p>
              <p class="w-100 text-dark ellipsis">{{ productInfo.product.product_name }}</p>
              <p class="text-link product-spec">規格: {{ productInfo.spec.spec_title }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <p>單價: {{'$'}}{{ productInfo.promo_price | currency }}</p>
                <p>數量: {{ productInfo.count }}</p>
                <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>`
  })
})()