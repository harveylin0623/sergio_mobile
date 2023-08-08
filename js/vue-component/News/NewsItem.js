Vue.component('news-item', {
  props: {
    news: { type: Object, required: true },
    isObserve: { type: Boolean, default: true }
  },
  data() {
    return {
      preloadImage: document.querySelector('#product-preload-image').href
    }
  },
  computed: {
    dateText() {
      if (this.news.start_time === '') return ''
      let dateObj = new Date(this.news.start_time)
      let year = dateObj.getFullYear()
      let month = dateObj.getMonth() + 1
      let date = dateObj.getDate()
      return `${year}年${month}月${date}日`
    }
  },
  methods: {
    startObserve() {
			let newsImage = this.news.imgUrl
			if (!this.isObserve) return this.preloadImage = newsImage
			new window.ObserverLazyLoading({
				dom: this.$refs.frame,
				viewInEvent: async() => {
					await new window.LoadingImage().load(newsImage)
					this.preloadImage = newsImage
				}
			})
		}
  },
  mounted() {
    this.startObserve()
  },
  template: `
    <a :href="news.linkUrl" class="d-block mb-2">
      <div class="position-relative" style="padding-top:50%;" ref="frame">
        <img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0" alt="">
      </div>
      <div class="pt-1">
        <p class="mb-0 title sm text-dark ellipsis">{{ news.title }}</p>
        <p class="mb-0 title sm text-link" style="font-size:12px;">{{ dateText }}</p>
      </div>
    </a>`
})