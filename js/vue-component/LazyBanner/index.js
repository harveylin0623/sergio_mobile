Vue.component('lazy-banner', {
  props: {
    bannerList: { type: Array, required: true }
  },
  data: () => ({
    preloadImage: document.querySelector('#banner-preload-image').href,
    slideList: [],
    showPlaceholderImage: false,
    allImageIsLoaded: false
  }),
  computed: {
    allImages() {
      return this.bannerList.map(item => item.imgUrl)
    }
  },
  methods: {
    initSwiper() {
      new Swiper('#banner-swiper', {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
      })
    },
    async loadAllImage() {
      this.showPlaceholderImage = true
      let group = []
      for (let item of this.allImages) {
        let obj = new LoadingImage().load(item)
        group.push(obj)
      }
      await Promise.all(group)
      this.showPlaceholderImage = false
      this.allImageIsLoaded = true
      this.slideList = _.cloneDeep(this.bannerList)
      await this.$nextTick()
      this.initSwiper()
    },
  },
  watch: {
    bannerList(val) {
      if (val.length === 0) return
      this.loadAllImage()
    }
  },
  template: `
    <div class="mb-2">
      <div>
        <div v-show="showPlaceholderImage">
          <img :src="preloadImage" class="full-img" alt="" />
        </div>
        <template v-if="allImageIsLoaded">
          <div id="banner-swiper" class="swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(slide,index) in slideList" :key="index">
                <a :href="slide.linkUrl">
                  <img :src="slide.imgUrl" />
                </a>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </template>
      </div>
    </div>`
})