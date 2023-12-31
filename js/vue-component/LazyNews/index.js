Vue.component('lazy-news', {
  props: {
    newsList: { type: Array, required: true },
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
      return this.newsList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper('#news-swiper', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 16,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
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
      this.slideList = _.cloneDeep(this.newsList)
      await this.$nextTick()
      this.initSwiper()
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
  },
  watch: {
    newsList(val) {
      if (val.length === 0) return
      this.startObserve()
    }
  },
  template: `
    <div ref="frame">
      <div v-show="showPlaceholderImage" style="height:150px;">
        <img :src="preloadImage" class="full-img" alt=""/>
      </div>
      <template v-if="allImageIsLoaded">
        <div id="news-swiper" class="swiper">
          <div class="swiper-wrapper">
            <div v-for="news in slideList" :key="news.id" class="swiper-slide" style="width:80%;">
              <a :href="news.linkUrl" class="d-block">
                <div class="mb-8">
                  <img :src="news.imgUrl" class="full-img rounded-lg" alt="">
                </div>
                <p class="text-sm text-neutral-0 line-clamp-1">{{ news.title }}</p>
                <p class="text-xs text-neutral-3">{{ news.startTime }}</p>
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>`
})