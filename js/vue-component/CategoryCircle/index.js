Vue.component('category-circle', {
  props: {
    popular: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#product-preload-image').href
  }),
  methods: {
    startObserve() {
      let productImage = this.popular.imgUrl
      if (!this.isObserve) return this.preloadImage = productImage
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        viewInEvent: async() => {
          await new window.LoadingImage().load(productImage)
          this.preloadImage = productImage
        }
      })
    }
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="popular.linkUrl" class="flex-grow-0 flex-shrink-0 mr-3 category-circle">
      <div class="rounded-circle img-box" ref="frame">
        <img :src="preloadImage" class="rounded-circle full-img" alt="">
      </div>
      <div class="pt-1 mb-0 text-dark text-center title xs">{{ popular.title }}</div>
    </a>`
})