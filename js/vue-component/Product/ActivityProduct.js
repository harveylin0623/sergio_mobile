Vue.component('activity-product', {
  props: {
    detail: { type: Object, required: true },
    activityType: { type: String, default: 'fullAmount' },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  computed: {
    isMatchedActivity() {
      return this.activityType === 'match'
    },
    labelClass() {
      if (!this.isMatchedActivity) return ''
      else return this.detail.promo_type === 1 ? 'bg-tomatoRed' : 'bg-limeGreen'
    },
    specImageUrl() {
      return this.detail.spec.images[0] || ''
    },
    productPrice() {
      return this.isMatchedActivity ? this.detail.promo_price : this.detail.product.product_promo_price
    }
  },
  methods: {
    pickHandler() {
      this.$emit('pick', {
        activityProductId: this.detail.id,
        productId: this.detail.product.id,
        name: this.detail.product.product_name,
        price: this.productPrice,
        specId: this.detail.spec.id,
        specName: this.detail.spec.spec_title,
        stock: this.detail.spec.spec_stock,
        imgUrl: this.specImageUrl,
        promo_type: this.detail.promo_type,
        product_code: this.detail.product.product_code
      })
    },
    introHandler() {
      this.$emit('intro', {
        name: this.detail.product.product_name,
        summary: this.detail.product.product_summary,
        specTitle: this.detail.spec.spec_title,
        price: this.productPrice,
        imgUrl: this.specImageUrl
      })
    },
    startObserve() {
      if (!this.isObserve) return this.preloadImage = this.specImageUrl
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(this.specImageUrl)
          this.preloadImage = this.specImageUrl
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <div class="mb-3 col-6 bg-white">
      <div class="position-relative overflow-hidden" style="padding-top:100%;" @click="introHandler" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
        <div class="match-label" :class="labelClass" v-if="isMatchedActivity"></div>
      </div>
      <div class="pt-2">
        <div class="mb-0 text-dark title sm ellipsis only">{{ detail.product.product_name }}</div>
        <div class="mb-1 text-center text-tomatoRed title sm">
          {{'$'}}{{ productPrice | currency }}
        </div>
        <button class="w-100 btn btn-outline-limeGreen" @click="pickHandler">選購</button>
      </div>
    </div>`
})