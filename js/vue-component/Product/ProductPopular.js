Vue.component('product-popular', {
	props: {
		productInfo: { type: Object, required: true },
		isObserve: { type: Boolean, default: true }
	},
	data: () => ({
		preloadImage: document.querySelector('#product-preload-image').href
	}),
	methods: {
		startObserve() {
			let productImage = this.productInfo.main_image
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
		<a :href="productInfo.linkUrl" class="mb-2 col-6 bg-white">
			<div class="position-relative" style="padding-top:100%;" ref="frame">
				<img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
			</div>
			<div class="pt-2">
				<div class="mb-0 text-dark title sm ellipsis">{{ productInfo.product_name }}</div>
				<div class="mb-0 text-center text-tomatoRed title sm">
					{{'$'}}{{ productInfo.product_promo_price | currency }}
				</div>
			</div>
		</a>`
});