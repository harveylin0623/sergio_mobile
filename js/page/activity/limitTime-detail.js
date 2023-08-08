export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, contactMixin],
    store: window.myVuexStore,
    data: {
      specSlideList: [],
      user: { buyCount: 1 },
      productInfo: { name: '', product_summary: '', num: '', product_detail: '', product_price: 0, product_promo_price: 0, product_code: '', startTime: '', endTime: '', valid: false, activityStock: 0, specStock: 0, activityDetail: '', specId: 0, activityId: 0, periodId: 0, activity_meta_id: 0 },
      tipInfo: { status: false, message: '' },
      cartInfo: { status: false, message: '', isRedirect: false },
      isLoading: false,
      logoutGoHome: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasProductCode() {
        return this.productInfo.product_code !== ''
      },
      noSpecialPrice() {
        let { product_price, product_promo_price } = this.productInfo
        return product_price <= product_promo_price
      },
      specialPriceTitle() {
        return this.noSpecialPrice ? '售價' : '優惠價'
      },
      periodText() {
        let { startTime, endTime } = this.productInfo
        let formatText = 'YYYY/MM/DD HH:mm'
        if (startTime === '' || endTime === '') return ''
        startTime = dayjs(startTime).format(formatText)
        endTime = dayjs(endTime).format(formatText)
        return `${startTime} ~ ${endTime}`
      },
      enableCartButton() {
        let { valid, activityStock } = this.productInfo
        return valid && activityStock > 0
      },
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
        this.productInfo.product_price = payload.product.product_promo_price
        this.productInfo.product_promo_price = payload.promo_price
        this.productInfo.product_code = payload.product.product_code
        this.productInfo.startTime = payload.limited_time_sub.start_time
        this.productInfo.endTime = payload.limited_time_sub.end_time
        this.productInfo.valid = payload.limited_time_sub.valid
        this.productInfo.activityStock = payload.activity_spec_stock
        this.productInfo.specId = payload.spec.id
        this.productInfo.specStock = payload.spec.spec_stock
        this.productInfo.activityId = payload.activity_id
        this.productInfo.periodId = payload.activity_sub_id
        this.productInfo.activity_meta_id = payload.id
        this.productInfo.activityDetail = payload.activity_product_detail
        this.specSlideList = payload.spec.images
      },
      async getActivityData() {
        let activityProductId = window.getQuery('activityProductId')
        let url = `${apiUrl.limited_time_meta}/${activityProductId}`
        let response = await activityApi.limited_time_meta({ url })
        this.setProductInfo(response.aaData)
        await this.$nextTick()
        this.initSpecSlide()
      },
      changeCount(num) {
        this.user.buyCount = num
      },
      async addCart(isRedirect) {
        if (!this.enableCartButton) return
        this.isLoading = true
        let response = await cartApi.product_promotions_limit_time({
          url: apiUrl.product_promotions_limit_time,
          data: {
            code: 'limit_time',
            activity_product_promotions_id: this.productInfo.activityId,
            activity_product_promotions_sub_id: this.productInfo.periodId,
            activity_meta_id: this.productInfo.activity_meta_id,
            count: this.user.buyCount
          }
        })
        this.cartInfo.status = response.status === 1
        this.cartInfo.message = response.message
        this.cartInfo.isRedirect = isRedirect
        if (this.cartInfo.status) {
          this.myHeader.updateCartCount(response.cartTotal)
        }
        $('#cartPopup').modal('show')
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