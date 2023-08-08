Vue.component('lazy-ad', {
  props: {
    swiperId: { type: String, required: true },
    advertiseList: { type: Array, required: true },
    rootMargin: { type: String, default: '0px 0px 0px 0px' }
  },
  data: () => ({
    preloadImage: document.querySelector('#ad-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.advertiseList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper(`#${this.swiperId}`, {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
      })
    },
    startObserve() {
      this.showPlaceholderImage = true
      new window.ObserverLazyLoading({
        dom: this.$refs.frame,
        rootMargin: this.rootMargin,
        viewInEvent: () => {
          this.loadAllImage()
        }
      })
    },
    async loadAllImage() {
      let group = []
      for (let item of this.allImages) {
        let obj = new LoadingImage().load(item)
        group.push(obj)
      }
      await Promise.all(group)
      this.showPlaceholderImage = false
      this.allImageIsLoaded = true
      this.slideList = _.cloneDeep(this.advertiseList)
      await this.$nextTick()
      this.initSwiper()
    }
  },
  watch: {
    advertiseList(val) {
      if (val.length === 0) return
      this.startObserve()
    }
  },
  template: `
    <div class="container" ref="frame">
      <div v-show="showPlaceholderImage">
        <img :src="preloadImage" class="full-img" alt=""/>
      </div>
      <template v-if="allImageIsLoaded">
        <div :id="swiperId" class="swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(slide,index) in slideList" :key="index">
              <a :href="slide.linkUrl">
                <img :src="slide.imgUrl" />
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>`
})