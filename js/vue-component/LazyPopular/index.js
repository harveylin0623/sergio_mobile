Vue.component('lazy-popular', {
  props: {
    popularList: { type: Array, required: true },
    rootMargin: { type: String, default: '0px 0px 0px 0px' }
  },
  data: () => ({
    preloadImage: document.querySelector('#popular-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.popularList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper('#popular-swiper', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
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
      this.slideList = _.cloneDeep(this.popularList)
      await this.$nextTick()
      this.initSwiper()
    }
  },
  watch: {
    popularList(val) {
      if (val.length === 0) return
      this.startObserve()
    }
  },
  template: `
    <div class="container" ref="frame">
      <div v-show="showPlaceholderImage" style="height:150px;">
        <img :src="preloadImage" class="full-img" alt="" />
      </div>
      <template v-if="allImageIsLoaded">
        <div id="popular-swiper" class="swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(slide,index) in slideList" :key="index" style="width:80%;">
              <a :href="slide.linkUrl">
                <img :src="slide.imgUrl"/>
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>`
})