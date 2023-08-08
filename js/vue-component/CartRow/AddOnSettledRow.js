Vue.component('add-on-settled-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, purchase } = this.cartInfo
      return count * purchase
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="pl-0 right">
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
              <p>單價: {{'$'}}{{ cartInfo.purchase | currency }}</p>
              <p>數量: {{'$'}}{{ cartInfo.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})