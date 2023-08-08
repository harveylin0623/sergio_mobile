Vue.component('limited-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    specImageUrl() {
      return this.cartInfo.meta.spec.images[0] || ''
    },
    subtotal() {
      return this.cartInfo.count * this.cartInfo.meta.promo_price 
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="pl-0 right">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="specImageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <p class="text-tomatoRed">*{{ cartInfo.activity.title }}</p>
            <a :href="cartInfo.linkUrl" class="w-100 text-dark ellipsis">
              {{ cartInfo.meta.product.product_name }}
            </a>
            <p class="text-link product-spec">規格: {{ cartInfo.meta.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>單價: {{'$'}}{{ cartInfo.meta.promo_price | currency }}</p>
              <p>數量: {{ cartInfo.count }}</p>
              <p class="text-tomatoRed ">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})