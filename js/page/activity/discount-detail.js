import Countdown from '../../src/classTool/Countdown.js'
export default function ({ apiUrl, pageUrl }) {
  new Vue({
    el: '#app',
    mixins: [authMixin, createSpecSlideListMixin, contactMixin],
    data: {
      breadList: [
        { title: '首頁', pageUrl: pageUrl.home },
        { title: '優惠活動', pageUrl: pageUrl.eventList },
        { title: '急殺活動', pageUrl: '' },
        { title: '急殺活動商品詳情', pageUrl: '' },
      ],
      user: { buyCount: 1 },
      specSlideList: [],
      productInfo: { name: '', product_summary: '', num: '', product_detail: '', product_promo_price: 0, product_code: '', specStock: 0, activityDetail: '', activity_summary: '', specId: 0, activityId: 0 },
      gradeId: 11, //後端會給目前級距
      buyGradeList: [],
      timeInfo: { day: 0, hour: 0, minute: 0, second: 0, timeUp: true },
      tipInfo: { status: false, message: '' },
      logoutGoHome: false,
      isLoading: false,
      apiUrl,
      pageUrl
    },
    computed: {
      hasProductInfo() {
        return this.productInfo.product_code !== ''
      },
      targetGradeItem() {
        return this.buyGradeList.find(grade => grade.id === this.gradeId)
      },
      hasSpecStock() {
        return this.productInfo.specStock > 0
      },
      displayCartButton() {
        return !this.timeInfo.timeUp && this.hasSpecStock
      },
      // subTotal() {
      //   if (this.targetGradeItem === undefined) return 0
      //   else return this.targetGradeItem.amount * this.user.buyCount
      // }
    },
    methods: {
      setBreadList() {
        let promoteId = window.getQuery('promoteId')
        this.breadList[2].pageUrl = `${this.pageUrl.eventAllDiscount}?promoteId=${promoteId}`
      },
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
        this.productInfo.product_promo_price = payload.promo_price
        this.productInfo.product_code = payload.product.product_code
        this.productInfo.specId = payload.meta_spec.id
        this.productInfo.specStock = payload.meta_spec.spec_stock
        this.productInfo.activityId = payload.activity_id
        this.productInfo.activityDetail = payload.activity_product_detail
        this.productInfo.activity_summary = payload.activity_product_summary
        this.specSlideList = this.createSpecSlideList(payload.product.specs)
      },
      startCountdown(endTime) {
        new Countdown({
          endTime,
          updateEvent: (payload) => {
            for (let key in payload) {
              this.timeInfo[key] = payload[key]
            }
            this.timeInfo.timeUp = false
          },
          timeUpEvent: () => {
            this.timeInfo.timeUp = true
          }
        })
      },
      async getActivityData() {
        let activityProductId = window.getQuery('activityProductId')
        let promoteId = window.getQuery('promoteId')
        let [activity, product] = await Promise.all([
          activityApi.groupbuy({ url: `${apiUrl.groupbuy}/${promoteId}` }),
          activityApi.groupbuy_meta({ url: `${apiUrl.groupbuy_meta}/${activityProductId}` })
        ])
        this.setProductInfo(product.aaData)
        this.buyGradeList = product.aaData.class
        this.startCountdown(activity.aaData.end_time)
        await this.$nextTick()
        this.initSpecSlide()
      },
      addCart() {
        if (!this.displayCartButton) return
      }
    },
    async mounted() {
      this.isLoading = true
      this.setBreadList()
      await this.checkTokenIsValid({ throwError: false })
      await this.getActivityData()
      this.isLoading = false
    }
  })
}