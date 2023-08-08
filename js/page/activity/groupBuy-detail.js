export default function({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, createSpecSlideListMixin, contactMixin],
    store: window.myVuexStore,
    data: {
      activityProductId: '',
      deadline: '',
      orderQuantity: 0,
      durationValid: false,
      rankList: [],
      specSlideList: [],
      user: { count: 1 },
      productInfo: { name: '', product_summary: '', num: '', product_detail: '', product_promo_price: 0, activityDetail: '', activity_summary: '', activityId: 0, activity_spec_stock: 0 },
      tipInfo: { status: false, message: '' },
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasProductInfo() {
        return this.productInfo.num !== ''
      },
      currentClassesAmount() { //目前級距金額
        if (!this.hasProductInfo) return 0
        let amount = 0
        let targetRank = this.rankList.find(rank => {
          let { class_min, class_max } = rank
          return this.orderQuantity >= class_min && this.orderQuantity <= class_max
        })
        if (targetRank !== undefined) {
          amount = targetRank.amount
        } else {
          let firstRank = this.rankList[0]
          let lastRank = this.rankList[this.rankList.length - 1]
          amount = this.orderQuantity < firstRank.class_min ? firstRank.amount : this.orderQuantity > lastRank.class_max ? lastRank.amount : 0
        }
        return amount
      },
      canBuy() {
        return this.durationValid && this.productInfo.activity_spec_stock > 0
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
        this.productInfo.product_promo_price = payload.product.product_promo_price
        this.productInfo.activityId = payload.activity_id
        this.productInfo.activityDetail = payload.activity_product_detail
        this.productInfo.activity_summary = payload.activity_product_summary
        this.productInfo.activity_spec_stock = payload.activity_spec_stock
        this.specSlideList = payload.spec.images
      },
      async getActivityData() {
        this.activityProductId = window.getQuery('activityProductId')
        let url = `${apiUrl.groupbuy_meta}/${this.activityProductId}`
        let response = await activityApi.groupbuy_meta({ url })
        let { duration_valid, end_time, classes, order_quantity } = response.aaData
        this.durationValid = duration_valid
        this.deadline = end_time
        this.rankList = classes
        this.orderQuantity = order_quantity
        this.setProductInfo(response.aaData)
        await this.$nextTick()
        this.initSpecSlide()
      },
      changeCount(num) {
        this.user.count = num
      },
      async buyHandler() {
        if (!this.canBuy) return
        this.isLoading = true
        let response = await activityApi.groupbuy_cart({
          url: apiUrl.groupbuy_cart,
          data: {
            activity_meta_id: this.activityProductId,
            count: this.user.count
          }
        })
        let { status, message } = response
        this.tipInfo.status = status === 1
        this.tipInfo.message = message
        if (this.tipInfo.status) {
          location.href = this.pageUrl.cart
        } else {
          $('#tipPopup').modal('show')
          this.isLoading = false
        }
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