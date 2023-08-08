export default function ({ apiUrl, pageUrl }) {
	const httpRegx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
	new Vue({
		el: '#app',
		mixins: [authMixin, processProductMixin],
		store: window.myVuexStore,
		data: {
			bannerList: [],
			popularInfo1List: [],
			advertiseList: [],
			popularInfo2List: [],
			newsTopList: [],
			newsList: [],
			productList: [],
			logoutGoHome: false,
			isLoading: false,
			apiUrl,
			pageUrl,
		},
		provide: {
			productCategoryUrl: pageUrl.productCategoty
		},
		computed: {
			hasProductList() {
				return this.productList.length > 0
			},
			hasNewsTopList() {
				return this.newsTopList.length > 0
			},
			hasNewsList() {
				return this.newsList.length > 0
			}
		},
		methods: {
			initSwiper(payload) {
				return new Swiper(payload.el, { ...payload.options })
			},
			showSwiperNavigation(obj) {
				obj.navigation.nextEl.classList.remove('hide')
				obj.navigation.prevEl.classList.remove('hide')
			},
			createBannerData(payload) {
				return payload.reduce((prev, current) => {
					let { images, url, summary } = current
					let linkUrl = httpRegx.test(url) ? url : 'javascript:;'
					prev.push({ imgUrl:images[0], linkUrl, text: summary })
					return prev
				}, [])
			},
			createPopularData(payload) {
				return payload.map(item => {
					let imgUrl = item.images[0]
					return {
						imgUrl,
						title: item.title,
						linkUrl: httpRegx.test(item.url) ? item.url : 'javascript:;'
					}
				})
			},
			processNews(payload) {
				return payload.reduce((prev, current) => {
					prev.push({
						id: current.id,
						title: current.title,
						linkUrl: `${this.pageUrl.newsDetail}?newsId=${current.id}`,
						imgUrl: current.images[0] || '',
						startTime: current.start_time
					})
					return prev
				}, [])
			},
			async getHomeData() {
				let [banner, popular1, advertise, popular2, newsTop, news, product] = await Promise.all([
					scenesApi.banner({ url: apiUrl.banner }),
					scenesApi.popularInfo({ url: apiUrl.popularInfo, params: { layer: 1 }}),
					scenesApi.advertise({ url: apiUrl.advertise }),
					scenesApi.popularInfo({ url: apiUrl.popularInfo, params: { layer: 2 }}),
					newsApi.newsTop({ url: apiUrl.news_top }),
					newsApi.news({ url: apiUrl.news }),
					productApi.product_popular({ url: apiUrl.product_popular }),
				])
				this.bannerList = this.createBannerData(banner.aaData)
				this.popularInfo1List = this.createPopularData(popular1.aaData)
				this.advertiseList = this.createBannerData(advertise.aaData)
				this.popularInfo2List = this.createBannerData(popular2.aaData)
				this.newsTopList = this.processNews(newsTop.aaData)
				this.newsList = this.processNews(news.aaData)
				this.productList = this.processProduct(product.aaData)
			}
		},
		async mounted() {
			this.isLoading = true
			await this.checkTokenIsValid({ throwError: false })
			await this.getHomeData()
			this.isLoading = false
		},
	});
}
