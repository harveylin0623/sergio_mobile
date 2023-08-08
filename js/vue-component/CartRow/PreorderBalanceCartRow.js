Vue.component('preorder-balance-cart-row', {
  props: {
    cartInfo: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.cartInfo.spec.images[0] || ''
    },
    subtotal() {
      let { count, final_payment } = this.cartInfo.balance
      return count * final_payment
    }
  },
  template: `
    <div class="normal-cart-item">
      <div class="right pl-0">
        <div class="clearfix">
          <div class="float-left img-box">
            <img :src="imageUrl" class="full-img" alt="">
          </div>
          <div class="float-left desc-box">
            <div class="w-100 text-dark ellipsis">{{ cartInfo.product.product_name }}</div>
            <p class="text-link product-spec">規格: {{ cartInfo.spec.spec_title }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <p>尾款: {{'$'}}{{ cartInfo.balance.final_payment | currency }}</p>
              <p>數量: x{{ cartInfo.balance.count }}</p>
              <p class="text-tomatoRed">小計: {{'$'}}{{ subtotal | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})