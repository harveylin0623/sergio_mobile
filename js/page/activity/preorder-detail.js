export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, createSpecSlideListMixin, contactMixin],
    store: window.myVuexStore,
    data: {
      activityProductId: '',
      specSlideList: [],
      user: { count: 1 },
      productInfo: { name: '', product_summary: '', num: '', product_detail: '', product_promo_price: 0, product_code: '', specId: 0, specTitle: '', activityId: 0, activityStock: 0, activityDetail: '', activity_summary: '', domestic_foreign: 0, return_goods: 0, deposit_type: 0 },
      tipInfo: { status: false, message: '' },
      cartInfo: { status: false, message: '' },
      cartStorageKey: 'preorder-cart-item-data',
      userStorageKey: 'preorder-cart-user-data',
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasProductCode() {
        return this.productInfo.product_code !== ''
      },
      hasSpecStock() {
        return this.productInfo.activityStock > 0
      },
      locationText() {
        return this.productInfo.domestic_foreign === 0 ? '國內' : '國外'
      },
      returnGoodsText() {
        return this.productInfo.return_goods === 0 ? '不可退貨' : '可退貨'
      },
      depositText() {
        return this.productInfo.deposit_type === 0 ? '售價' : '訂金'
      }
    },
    methods: {
      initSpecSlide() {
        let swiperD = new Swiper('.swiper-container-D', {
          slidesPerView: 5,
          spaceBetween: 10,
          watchSlidesProgress: true,
        })
        new Swiper('.swiper-container-M', {
          speed: 1500,
          autoplay: { delay: 5000 },
          effect: 'fade',
          thumbs: { swiper: swiperD },
        })
      },
      setProductInfo(payload) {
        this.productInfo.name = payload.product.product_name
        this.productInfo.product_summary = payload.product.product_summary
        this.productInfo.num = payload.product.product_num
        this.productInfo.product_detail = payload.product.product_detail
        this.productInfo.product_promo_price = payload.deposit
        this.productInfo.product_code = payload.product.product_code
        this.productInfo.specId = payload.spec.id
        this.productInfo.specTitle = payload.spec.spec_title
        this.productInfo.activityId = payload.activity_id
        this.productInfo.activityStock = payload.activity_spec_stock
        this.productInfo.activityDetail = payload.activity_product_detail
        this.productInfo.activity_summary = payload.activity_product_summary
        this.productInfo.domestic_foreign = payload.domestic_foreign
        this.productInfo.return_goods = payload.return_goods
        this.productInfo.deposit_type = payload.deposit_type
        this.specSlideList = payload.spec.images
      },
      async getActivityData() {
        this.activityProductId = window.getQuery('activityProductId')
        let url = `${apiUrl.preorder_meta}/${this.activityProductId}`
        let response = await activityApi.preorder_meta({ url })
        if (response.status === 0) return location.href = this.pageUrl.home
        this.setProductInfo(response.aaData)
        await this.$nextTick()
        this.initSpecSlide()
      },
      changeCount(num) {
        this.user.count = num
      },
      async buyHandler() {
        if (!this.hasSpecStock) return
        this.isLoading = true
        let response = await activityApi.preorder({
          url: apiUrl.preorder,
          method: 'post',
          data: {
            activity_meta_id: this.activityProductId,
            count: this.user.count
          }
        })
        this.cartInfo.status = response.status === 1
        this.cartInfo.message = response.message
        window.sessionStorageObj.removeItem(this.cartStorageKey)
        window.sessionStorageObj.removeItem(this.userStorageKey)
        if (this.cartInfo.status) {
          location.href = this.pageUrl.cart
        } else {
          $('#cartPopup').modal('show')
        }
        this.isLoading = false
      }
    },
    async mounted() {
      this.isLoading = true
      await this.checkTokenIsValid({ throwError: false })
      await this.getActivityData()
      this.isLoading = false
    }
  })
}