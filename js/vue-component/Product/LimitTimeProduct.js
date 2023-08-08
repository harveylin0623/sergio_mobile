export default (() => {
  Vue.component('limit-time-product', {
    props: {
      detail: { type: Object, required: true },
      isObserve: { type: Boolean, default: true }
    },
    data() {
      return {
        preloadImage: document.querySelector('#product-preload-image').href
      }
    },
    computed: {
      imageUrl() {
        return this.detail.product.images[0] || ''
      },
      statusText() {
        return this.detail.limited_time_sub.valid ? '立即搶購' : '查看詳情'
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
      <div class="d-flex align-items-start py-2 bd-bottom-divide">
        <div class="flex-grow-0 flex-shrink-0" style="width:90px;height:90px;" ref="frame">
          <img :src="preloadImage" class="full-img" alt="">
        </div>
        <div class="mb-0 pl-1 pt-1 flex-grow-1 flex-shrink-1 title sm">
          <p class="mb-2 ellipsis">{{ detail.product.product_name }}</p>
          <div class="d-flex justify-content-between align-items-center">
            <p>
              價格: <span class="text-tomatoRed">{{'$'}}{{ detail.promo_price | currency }}</span>
            </p>
            <a :href="detail.linkUrl" class="py-1 px-2 text-white rounded bg-limeGreen">{{ statusText }}</a>
          </div>
        </div>
      </div>`
  })
})()