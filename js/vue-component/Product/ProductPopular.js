Vue.component('product-popular', {
	props: {
		productInfo: { type: Object, required: true },
		isObserve: { type: Boolean, default: true },
		width: { type: String, default: '50%' }
	},
	data: () => ({
		preloadImage: document.querySelector('#product-preload-image').href
	}),
	computed: {
		productStyle() {
			return { width: this.width }
		}
	},
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
		<a :href="productInfo.linkUrl" class="mb-16 bg-neutral-7" :style="productStyle">
			<div class="position-relative pt-full" ref="frame">
				<img :src="preloadImage" class="position-absolute full-img" style="left:0;top:0;" alt=""/>
			</div>
			<div class="pt-2">
				<div class="mb-4 text-neutral-0 text-sm line-clamp-2">{{ productInfo.product_name }}</div>
				<div class="d-flex justify-content-center text-sm">
					<p class="mr-8 text-neutral-3 text-decoration-line">{{'$'}}{{ productInfo.product_price | currency }}</p>
					<p class="text-primary-2 ">{{'$'}}{{ productInfo.product_promo_price | currency }}</p>
				</div>
			</div>
		</a>`
});