Vue.component('pre-order-product', {
  props: {
    detail: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  computed: {
    imageUrl() {
      return this.detail.product.images[0] || ''
    },
    priceText() {
      let { deposit, deposit_type } = this.detail
      let mappingType = { 0:'售價', 1:'訂金' }
      let dollarText = `$${this.$options.filters.currency(deposit)}`
      return `${mappingType[deposit_type]}: ${dollarText}`
    }
  },
  methods: {
    startObserve() {
      if (!this.isObserve) return this.preloadImage = this.imageUrl
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(this.imageUrl)
          this.preloadImage = this.imageUrl
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="detail.linkUrl" class="mb-3 col-6 bg-white">
      <div class="position-relative" style="padding-top:100%;" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
      </div>
      <div class="pt-2">
        <div class="mb-0 text-dark title sm ellipsis only">{{ detail.product.product_name }}</div>
        <div class="mb-1 text-center text-tomatoRed title sm">{{ priceText }}</div>
      </div>
    </a>`
})