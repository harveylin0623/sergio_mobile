Vue.component('normal-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    specImageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      return this.cartInfo.count * this.cartInfo.product.product_promo_price
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="p-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="specImageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <a href="javascript:;" class="w-100 text-dark ellipsis">
              {{ cartInfo.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.product.product_promo_price | currency }}</p>
              <p>數量: x{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})