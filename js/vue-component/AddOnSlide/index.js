Vue.component('add-on-slide', {
  props: {
    purchase: { type: Object, required: true }
  },
  computed: {
    imageUrl() {
      return this.purchase.spec.images[0] || ''
    }
  },
  methods: {
    introHandler() {
      this.$emit('intro', {
        name: this.purchase.product.product_name,
        summary: this.purchase.product.product_summary,
        imgUrl: this.imageUrl,
        specTitle: this.purchase.spec.spec_title,
        price: this.purchase.purchase_price
      })
    },
    buyHandler() {
      this.$emit('purchase-buy', {
        purchase_id: this.purchase.id,
        product_code: this.purchase.product.product_code,
        spec_id: this.purchase.spec.id,
        count: 1
      })
    }
  },
  template: `
    <div class="px-2 swiper-slide">
      <div class="position-relative" style="padding-top:100%;" @click="introHandler">
        <img :src="imageUrl" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
      </div>
      <div class="my-1">
        <div class="title sm mb-0 ellipsis only">{{ purchase.product.product_name }}</div>
        <div class="mb-0 text-center text-tomatoRed title sm">
          {{'$'}}{{ purchase.purchase_price | currency }}
        </div>
      </div>
      <button class="w-100 btn btn-limeGreen" @click="buyHandler">選購</button>
    </div>`
})